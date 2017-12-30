export class Filters {
	constructor(app) {
		app.filter('truncate', function() {
		  return function(txt, limit) {
		  	return new Truncated(txt, limit).toString();
		  }
		})
	}
}

class Truncated {
	txt: string
	limit: number
 	constructor(txt: string, limit: number) {
        this.txt = txt
        this.limit = limit
    }
	toString(): string {
		if (this.txt && this.txt.length > this.limit) {
			return this.txt.substr(0, this.limit - 3) + "..."
		}
		return this.txt
	}
}
