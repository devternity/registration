class Notification {

	show(message: string) {
		let notification = document.querySelector('.mdl-js-snackbar');
		notification['MaterialSnackbar'].showSnackbar({message: message});		
	}

}

export let notification = new Notification();