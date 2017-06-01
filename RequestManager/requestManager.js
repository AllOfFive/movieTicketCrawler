module.exports = function RequestManager() {
	this.request_queue = [],
	this.request_idle_time = 0,
	this.add_request = function(link){
		console.log('add:'+link);
		this.request_queue.push(link);
	}
}