export class DiscountCtrl {

    code: string
    warn = false
    oki = false

    static $inject = ['$rootScope']	

    constructor(private $rootScope) {}
	
    apply = () => {
        let discounts = {
            "SPONSORED": 100,
            "_19": 10
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
