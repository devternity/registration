import {notification} from './Notification'

export class AttendeeCtrl {

	name: string
	email: string
	attendMain: boolean
	addDisabled: boolean
	workshop: any

    static $inject = ['$rootScope'];	

	constructor(private $rootScope) {
		this.reset();
		this.onChange();
	}

	add() {
    	this.$rootScope.$emit("AttendeeAdded", {
    		name: this.name,
    		email: this.email,
    		attendMain: this.attendMain,
    		workshop: this.workshop
    	});	    		
    	this.reset();
    	this.onChange();
	}

	onChange() {
		var attendanceNotSelected = !this.attendMain && !this.workshop;
		this.addDisabled = !this.name || !this.email || attendanceNotSelected;

		if (!this.attendMain) {
			var element = document.querySelector(".mdl-checkbox-main-day");
			element.classList.remove('is-checked')
		} else {
			var element = document.querySelector(".mdl-checkbox-main-day");
			element.classList.add('is-checked')
		}

		if (!this.workshop) {
			let elements = document.querySelectorAll(".workshop .mdl-radio");
			for (var i = 0; i < elements.length; i++) {
				elements[i].classList.remove('is-checked');
			}			
			if (elements.length) {
				var element = document.querySelector(".workshop .mdl-radio[for='false']");				
				element.classList.add('is-checked')			
			}

		}
	}

	reset() {
		this.attendMain = false
		this.name = ''
		this.email = ''
		this.workshop = false
	}

}