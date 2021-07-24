export class DiscountCtrl {

    code: string
    warn = false
    oki = false

    static $inject = ['$rootScope']	

    constructor(private $rootScope) {}
	
    apply = () => {
        let discounts = {
            "SPONSORED": 100,
            "_ROCKS": 10,
            "_LEVELUP": 10,
            "AWSM_": 10,
            "_TEAM": 10,
            "_COFFEE": 4,
	    "_21": 10		
        }

        let allCodes = Object.keys(discounts)

        let enteredCode = this.code
        let [matchedCode] = allCodes.filter(aCode => (enteredCode || "").indexOf(aCode) >= 0)
        
        this.warn = !matchedCode
        this.oki = !!matchedCode

        if (matchedCode) {
            this.$rootScope.$emit("ValidDiscountApplied", { code: matchedCode, percentage: discounts[matchedCode] });
        } else {
            this.$rootScope.$emit("InvalidDiscountApplied", undefined);
        }
	}
}
