export class Event {

	static $inject = ['$http'];	

	constructor(private $http) {}

	latest() {
    	return this.$http.get('http://devternity.com/rix/2017/js/event.js').then(_ => {    
      		return _.data[0];
    	});
	}

}