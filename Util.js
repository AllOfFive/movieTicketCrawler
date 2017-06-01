const fs = require('fs');

/**
 * Simple logger implementation
 * @param {object} err error throwed by program
 * @param {string} msg error description by programmer
 * @param {boolean} quiet if this flag specified, the logger will not output shit into console
 */
module.exports.logError = function(err, msg, quiet=false){
	let content = "";
	content += ('-----------------------------------------------\n');
	msg = (msg == undefined ? "~ msg ..." : msg);
	content += ('[time ] '+new Date().toString()+'\n');
	content += ('[error] '+msg+'\n');
	if(err) content += err.toString();
	content += ('-----------------------------------------------\n');
	writeLog(content);
	if (!quiet) console.log(content);
}

module.exports.logInfo = function(msg, quiet=false){
	let content = "[info ] "+new Date().toString()+'\n';
	content += msg;
	writeLog(content);
	if (!quiet) console.log(content);
}

function writeLog(content){
	let fd = fs.openSync('./logs', 'a');
	fs.writeSync(fd, content);
}