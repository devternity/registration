export class Event {

	static $inject = ['$http'];	

	constructor(private $http) {}

	latest() {
			const unique = Math.round(Math.random() * 10);
    	return this.$http.get('https://devternity.com/js/event.js?=' + unique).then(_ => {
      		return _.data[0];
    	});
	}

}