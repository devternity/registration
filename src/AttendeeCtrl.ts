export class AttendeeCtrl {

	name: string
	email: string
	workshop: any
	ticket: any
	addDisabled: boolean
	cost: number

    static $inject = ['$rootScope'];	

	constructor(private $rootScope) {
		this.reset();
		this.onChange();
	}

	add() {
		let tickets = [ 
			this.ticket.includesMainDay ? "Main Day Pass" : undefined, 
			this.workshop ? this.workshop.title : undefined 
		].filter(Boolean)

    	this.$rootScope.$emit("AttendeeAdded", {
    		name: this.name,
			email: this.email,
			cost: this.cost,
			tickets: tickets
    	});	    		
    	this.reset();
    	this.onChange();
	}

	onChange() {
		let ticketTypeNotSelected = !this.ticket
		let workshopNotSelected = this.ticket && this.ticket.includesWorkshop && !this.workshop
		this.cost = this.ticket && this.ticket.price
		this.addDisabled = !this.name || !this.email || ticketTypeNotSelected || workshopNotSelected
	}

	reset() {
		this.name = ''
		this.email = ''
		this.workshop = undefined
		this.ticket = undefined
	}

}