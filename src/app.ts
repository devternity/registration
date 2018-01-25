import {module} from 'angular'


import {Filters} from './Filters'
import {DiscountCtrl} from './DiscountCtrl'
import {AttendeeCtrl} from "./AttendeeCtrl"
import {Event} from './Event'

import {notification} from './Notification'

let app = module('app', [])
new Filters(app)

app.service('Event', Event)

app.controller('AttendeeCtrl', AttendeeCtrl)
app.controller('DiscountCtrl', DiscountCtrl);
app.controller('Attendify', function($http, $rootScope, Event) {
	 
	Event.latest()
		.then(latestEvent => {
			let workshopsOnSale = latestEvent
					.program
					.filter(p => { return p.event == "workshops" })[0]
					.schedule
					.filter(w => { return !w.sold_out })
                    .concat({ title: "No Workshop Pass", product: false })
			this.workshops = workshopsOnSale;
			this.event = latestEvent;			
		})
		.catch(e => {
			notification.show("❌ Sorry, something went wrong! Drop us an email to hello@devternity.com");
		})
	
	this.step = 'BILLING';
	
	let self = this;
	$rootScope.$on("ValidDiscountApplied", (event, data) => {
		self.promo = data;
		self.recalculate();
	});
	$rootScope.$on("InvalidDiscountApplied", (event, data) => {
		self.promo = undefined;
		self.recalculate();
	});

	$rootScope.$on("AttendeeAdded", (event, attendee) => {
        if (attendee.workshop) {
            var workshopTitle = this.workshops
                .filter(w => { return w.product == attendee.workshop })
                .pop()
                .title;
            attendee['workshopTitle'] = workshopTitle;
        }
        
    	self.registration.attendees.push(attendee);
    	self.recalculate();
    	notification.show("✅ Attendee has been added")
	});	

    this.registration = {
    	companyBilling: false,
    	paymentMethod: "BANK",
    	attendees: [],
    	legal: {}
    }

    this.wipeCompanyBillingInfo = () => {
    	this.registration.legal = {};
    }

    this.changePaymentMethod = () => {
    	this.recalculate();
    }

    this.toBilling = () => {
    	this.step = 'BILLING';
    }

    this.toPayment = () => {

    	var firebaseApplication = {
    		discountCode: this.promo ? this.promo.code : undefined,
    		paymentMethod: this.registration.paymentMethod,
    		name: this.registration.name,
    		email: this.registration.email,
    		product: this.event.codename,
    		company: {
    			name: this.registration.legal.name,
    			vat: this.registration.legal.vat,
    			address: this.registration.legal.address
    		},
    		subtotal: this.subtotal,
    		total: this.total,
    		discount: this.discount,
    		fee: this.fee,
    		attendees: [],    		
    		slack: {
    			attachments: []
    		}
    	}

        this.registration.attendees.forEach(attendee => {

    		var tickets = [];
    		if (attendee.attendMain) {
    			tickets.push("MAIN_DAY")
    		}
    		if (attendee.workshop) {
    			tickets.push(attendee.workshop);
    		}
    		var firebaseAttendee = {
    			name: attendee.name,
    			email: attendee.email,
    			tickets: tickets
    		};

    		firebaseApplication.attendees.push(firebaseAttendee)
    	});

		$http.post('https://devternity-22e74.firebaseio.com/applications.json', firebaseApplication)
			.then(
				response => {
					this.step = "PAYMENT";
				},
				error => {
					notification.show("❌ Sorry, something went wrong! Drop us an email to hello@devternity.com")	
				},				
			);
    	
    }
    
    this.recalculate = () => {
    	
        if (!this.registration.attendees || !this.registration.attendees.length) {
            return;
        }

    	this.registration.attendees.forEach(attendee => {
    		var cost = 0;
    		var discount = 0;
    		if (attendee.attendMain) {
    			cost = cost + this.event.pricing.products[0].price;
    			if (this.promo && this.promo.mainDayAmount) {
					discount = discount + parseInt(this.promo.mainDayAmount);
    			}    			
    		}
    		if (attendee.workshop) {
    			cost = cost + this.event.pricing.products[1].price;
    			if (this.promo && this.promo.workshopAmount) {
					discount = discount + parseInt(this.promo.workshopAmount);
    			}    			    			
    		}
    		attendee['cost'] = cost;
    		attendee['discount'] = discount;
    	})
	    	
    	this.subtotal = this.registration.attendees
            .map(it => { return it.cost })
            .reduce((a, b) => { return a + b })

    	this.discount = this.registration.attendees
            .map(it => { return it.discount })
            .reduce((a, b) => { return a + b })

    	var discountedTotal = this.subtotal - this.discount;

		var fee = 0;
		if (this.registration.paymentMethod == "VISA") {
			fee = Math.round((discountedTotal * 3) / 100)
		}

		this.fee = fee;
    	this.total = discountedTotal + fee;
    }

    this.dropAttendee = row => {
    	this.registration.attendees.splice(row, 1);
    	this.recalculate();
    	notification.show("✅ Attendee has been removed")	
    }

    this.toTickets = () => {
    	this.noName = !this.registration.name;
    	this.noEmail = !this.registration.email;
    	this.noCompany = this.registration.companyBilling && !this.registration.legal.name;
    	this.noVat = this.registration.companyBilling && !this.registration.legal.vat;
    	this.noAddress = this.registration.companyBilling && !this.registration.legal.address;

    	if (this.noName || this.noEmail || this.noCompany || this.noVat || this.noAddress) {
    		return;
    	}
    	this.step = 'TICKETS';
    }
});
