import {module} from 'angular'
import {ngCookies} from 'angular-cookies'
import * as moment from 'moment'
import * as UUID from 'uuidjs'

[module, ngCookies]

import {Filters} from './Filters'
import {DiscountCtrl} from './DiscountCtrl'
import {AttendeeCtrl} from "./AttendeeCtrl"
import {Event} from './Event'

let app = module('app', ['ngCookies'])

new Filters(app)

app.service('Event', Event)

app.controller('AttendeeCtrl', AttendeeCtrl)
app.controller('DiscountCtrl', DiscountCtrl);
app.controller('Attendify', function($http, $cookies, $rootScope, $location, Event) {

	this.showWarning = false

	let secret = $location.absUrl().indexOf("secretLink") > 0;
	
	Event.latest()
		.then(latestEvent => {
			let workshopsOnSale = latestEvent
					.program
					.filter(p => p.event == "workshops")[0]
					.schedule
					.filter(w => secret || !w.sold_out )
			this.workshops = workshopsOnSale;



			this.ticketsOnSale = latestEvent.pricing.packages
			this.event = latestEvent;
		})
		.catch(e => {
			console.error(e)
			this.showWarning = true
		})
	
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
    	self.registration.attendees.push(attendee);
    	self.recalculate();
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

    this.complete = () => {

		this.step = 'COMPLETE_CLICKED'

    	var firebaseApplication = {
        	referral: $cookies.get('referral'),
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
    		tickets: [],    		
    		slack: {
    			attachments: []
    		}
    	}

        this.registration.attendees.forEach(attendee => {
			attendee.tickets.forEach(ticket => {
    			let dayOffset = ticket.indexOf("Main") >= 0 ? 0 : 1
    			let startsAt = moment(this.event.date_iso).add(dayOffset, 'days')
    			firebaseApplication.tickets.push({
                    holder: {
                        name: attendee.name,
                        email: attendee.email
                    },                    
                    id: UUID.generate(),
                    event: ticket,
                    title: this.event.title, 
                    startsAt: startsAt.format('dddd Do MMM YYYY'),
                    startsAtHint: "Registration starts at 8:00",
                    location: this.event.venue_name,
                    locationHint: this.event.venue_address + ", " + this.event.city + ", " + this.event.country
                })
			})
    	});        

		$http.post('https://api.devternity.com/applications', firebaseApplication)
			.then(
				response => {
					this.step = "REGISTERED"
				},
				error => {
					this.step = "REGISTRATION_FAILED"
				},				
			);
    }
    
    this.recalculate = () => {
    	
        if (!this.registration.attendees || !this.registration.attendees.length) {
            return;
        }

    	this.registration.attendees.forEach(attendee => {
			let cost = attendee.cost;
			let discount = Math.floor(this.promo ? (cost * this.promo.percentage) / 100 : 0)
    		attendee['cost'] = cost;
    		attendee['discount'] = discount;
    	})
	    	
    	this.subtotal = this.registration.attendees
            .map(it => it.cost )
            .reduce((a, b) => a + b )

    	this.discount = this.registration.attendees
            .map(it => it.discount )
            .reduce((a, b) => a + b )

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
    }

});
