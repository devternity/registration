import {notification} from './Notification'
import {_} from 'lodash'

import * as $ from 'jquery'

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
			$(element).removeClass('is-checked')
		} else {
			var element = document.querySelector(".mdl-checkbox-main-day");
			$(element).addClass('is-checked')
		}
	}

	reset() {
		this.attendMain = false
		this.name = ''
		this.email = ''
		this.workshop = ''
	}

}