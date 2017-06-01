const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let cheerio = require('cheerio');

let movieInfoSchema = new Schema({
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

module.exports = function(data){
	let db = mongoose.connect('mongodb://localhost/taopiaopiao');
	let Movie = db.model('Movie', movieInfoSchema);
	const $ = cheerio.load(data.text);
	let movieList = $('.tab-movie-list').first().find('.movie-card-wrap');
		    movieList.each(function(){
			let infoSet = $(this).find('span');
			let title = infoSet.eq(0).text();
			console.log(title);
			let director = infoSet.eq(2).text().split('导演：')[1];
			let protagonist = infoSet.eq(3).text().split('主演：')[1];
			let duration = Number.parseInt(infoSet.eq(7).text().split('片长：')[1]);
			duration = Number.isNaN(duration) ? -1 : duration;
			let type = infoSet.eq(4).text().split('类型：')[1];
			let score = Number.parseInt(infoSet.eq(1).text());
			score = Number.isNaN(score) ? -1 : score;
			let language = infoSet.eq(6).text().split('语言：')[1];
			let region = infoSet.eq(5).text().split('地区：')[1];
			let link = $(this).find('a.movie-card').attr('href');

			let item = {
				title: title,
				director: director,
				protagonist: protagonist,
				duration: duration,
				type: type,
				score: score,
				language: language,
				region: region,
				link: link
			};
			console.log(item);
			new Movie(item).save((err)=>{
				if (err){
					throw err;
				}else{
					console.log('[info]: data saved: '+item.title);
				}
			});
		});
}