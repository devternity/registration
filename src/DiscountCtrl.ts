import { notification } from './Notification'

export class DiscountCtrl {


    code: string;

    static $inject = ['$http', '$rootScope'];	

    constructor(private $http, private $rootScope) {}
	
    apply = () => {
	    var url = "https://devternity-22e74.firebaseio.com/coupons/" + this.code + ".json"
	    this.$http.get(url).then(_ => {
            var discount = _.data
            if (this.code.endsWith("18")) {
                discount = {
                    code: this.code,
                    mainDayAmount: "25",
                    workshopAmount: "25"
                }
            }
            if (discount) {
                notification.show('✅ Congratulations! The entered discount code is valid.');
                this.$rootScope.$emit("ValidDiscountApplied", discount);
    		} else {
                this.$rootScope.$emit("InvalidDiscountApplied", {});
                notification.show('❌ The entered discount code is not valid.');
	    	}
       });
	}
}
