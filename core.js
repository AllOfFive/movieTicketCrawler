const request = require('superagent');
const requestManager = require('./RequestManager/requestManager.js');
const Util = require('./Util.js');
/**
 * initialize configuration and runtime
 * @return {none} 
 */

init();
start();

var req_queue = [];
var handlers = [];
var isRunning = true;
var REQ_IDLE_TIME = 3         // idle time for each request (second)
function init(){
	// init handlers
	
}
/**
 * Main process
 * @return {none} main process
 */
function start(){
	let scheduledTime = REQ_IDLE_TIME;
	while(isRunning){
		// dispatch request
		while(req_queue.length!=0){
			setTimeout(sentReq(req_queue.shift(), processResult),scheduledTime);
			scheduledTime+=REQ_IDLE_TIME;
		}
	}
}

function sentReq(url, processResult){
	request
	  .get(url)
	  .end((err, data)=>{
		if(err){
			Util.logError(err, 'Error when receiving response');
			throw err;
		}else{
			processResult(data.text);
		}
	  });
}

function processResult(content){
	for (let i=0;i<handlers.length;i++){
		handlers[i](content, req_queue);
	}
}