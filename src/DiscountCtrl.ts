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
            "_GURU": 10,
            "MEGA_": 20,
            "AWSM_": 10,
            "_TEAM": 10,
            "_50OFF": 50,
            "_MEMBERS": 10,
            "_COFFEE": 4,
            "_21": 10,
            "10_NOW": 10
        }

        let allCodes = Object.keys(discounts)

        let enteredCode = this.code
        let [matchedCode] = allCodes.filter(aCode => (enteredCode || "").indexOf(aCode) >= 0)
        
        this.warn = !matchedCode
        this.oki = !!matchedCode

        if (matchedCode) {
            this.$rootScope.$emit("ValidDiscountApplied", { code: enteredCode, percentage: discounts[matchedCode] });
        } else {
            this.$rootScope.$emit("InvalidDiscountApplied", undefined);
        }
	}
}
