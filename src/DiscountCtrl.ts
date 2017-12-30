import {notification} from './Notification'

export class DiscountCtrl {


	code: string;

    static $inject = ['$http', '$rootScope'];	

	constructor(private $http, private $rootScope) {}

	apply = () => {
		var url = "https://devternity-22e74.firebaseio.com/coupons/" + this.code + ".json"
	    this.$http.get(url).then(_ => {    
	    	if (_.data) {
	    		notification.show('✅ Congratulations! The entered discount code is valid.');
				this.$rootScope.$emit("ValidDiscountApplied", _.data);	    		
	    	} else {
				this.$rootScope.$emit("InvalidDiscountApplied", {});	    		
				notification.show('❌ The entered discount code is not valid.');
	    	}
	    	
	    });	
	}

}