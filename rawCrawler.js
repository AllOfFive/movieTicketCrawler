const fs = require('fs');
const superagent = require('superagent');
const mongoose = require('mongoose');
const util = require('./Util.js');
var db = mongoose.connect('mongodb://localhost/taopiaopiao');

let movieInfoSchema = new mongoose.Schema({
	title: String,
	director: String,
	protagonist: String,
	duration: Number,
	type: String,
	score: Number,
	language: String,
	region: String,
	link: String
});

let Movie = db.model('Movie', movieInfoSchema);
run();
function run(){
	Movie.find({}, function(err, data){
		if (err) throw err;
		data.map((cur)=>{console.log(cur.title+" "+cur.link)});
	});

	console.log('finish');
	
}
util.Logger(null, "fail to save");

console.log('Finish');
mongoose.connection.close();