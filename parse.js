let cheerio = require('cheerio');
let fs = require('fs');

fs.readFile('./out', function(err, data){
	if (err) throw err;
	let $ = cheerio.load(data);
	let movieList = $('.tab-movie-list').first().find('.movie-card-wrap');
		    movieList.each(function(){
			let infoSet = $(this).find('span');
			// console.log(infoSet);
			let title = infoSet.eq(0).text();
			let director = infoSet.eq(2).text().split('导演：')[1];
			let protagonist = infoSet.eq(3).text().split('主演：')[1];
			let duration = Number.parseInt(infoSet.eq(7).text().split('片长：')[1]);
			let type = infoSet.eq(4).text().split('类型：')[1];
			let score = Number.parseInt(infoSet.eq(1).text());
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
		});
			
});