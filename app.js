const cheerio = require('cheerio');
const superagent = require('superagent');
const Util = require('./Util.js');
const Handlers = require('./contentHandler.js');
const fs = require('fs');
const path = require('path');
const dataHome = require('./env.js').DATA_DIR;
let HOME_URL = 'https://dianying.taobao.com/showList.htm?spm=a1z21.30466.header.4.SwjzUI&n_s=new';
let total_idle_time = 0;

init();
run();

function run(){
	superagent
	  .get(HOME_URL)
	  .end((err, data)=>{
	  	if (err) Util.logger(err, 'Error occur when return from request');
	  	let $ = cheerio.load(data.text);
		let movieList = $('.tab-movie-list').eq(0).find('.movie-card-wrap');
		let  = movieList.each(function(){
			// set interval here to slow down
			let current = $(this);
			let title = current.find('.movie-card-name span').eq(0).text()+'';
			let href = current.find('a.movie-card').attr('href')+'';
			// Handlers.saveHtml(title_href);
			processContent(title, href);
		});
		
	  });
}

function init(){
	let data_path = path.resolve(__dirname, 'data');
	let dataDirExists = fs.existsSync(data_path);
	if (!dataDirExists) {
		fs.mkdirSync(data_path);
	}
}

function simulation(){
	let base_url = 'https://dianying.taobao.com/showDetailSchedule.htm?';
	let data = fs.readFileSync('./output.html');
	let $ = cheerio.load(data);
	let detailsByDayAndCinema = [];
	let today = getToday();
	// Util.logInfo($('.select-tags').eq(1).text());
	$('.select-tags').eq(1).find('a').each(function(){
		let idAndCinema = $(this).attr('data-param').match(/showId=[0-9]+&cinemaId=[0-9]+/)[0];
		let url = base_url + idAndCinema + '&date=' + today;
		detailsByDayAndCinema.push(url);
	});
	processDetail(detailsByDayAndCinema);
	
}

function processContent(title, href){
	let moviePath = path.resolve(dataHome, title);
	let movieId = href.match(/showId=[0-9]+/)[0];
	let exist = fs.existsSync(moviePath);
	let base_url = 'https://dianying.taobao.com/showDetailSchedule.htm?';
	if (!exist){
		fs.mkdirSync(moviePath);	
	}
	let req_idle_time_ms = Math.random()*2000 + 2000;
	total_idle_time += req_idle_time_ms;
	setTimeout(()=>{
		Util.logInfo('[req]: '+href);
		superagent
		.get(href)
		.end((err, data)=>{
			if (err){
				Util.logError(err);
				throw err;
			}
			let content = data.text;
			let titlePath = path.resolve(moviePath, 'index.html');
			saveFile(titlePath, content);
			let detail_href = href.replace('showDetail','showDetailSchedule');
			Util.logInfo('[request detail]: '+movieId);
			superagent
				.get(detail_href)
				.end((err, data)=>{
					
					if(err) {
						Util.logError(err);
						throw err;
					}
					Util.logInfo('[parse detail]: '+movieId);
					let $ = cheerio.load(data.text);
					// saveFile('/Users/duanzhengmou/Super_Frontend/movieTicketCrawler/output.html',data);
					let detailsByDayAndCinema = [];
					let today = getToday();
					$('.select-tags').eq(1).find('a').each(function(){
						let idAndCinema = $(this).attr('data-param').match(/showId=[0-9]+&cinemaId=[0-9]+/)[0];
						let url = base_url + idAndCinema + '&date=' + today;
						detailsByDayAndCinema.push({
							url: url, 
							date: today, 
							cinema:$(this).text(),
							curPath: moviePath
						});
					});
					Util.logInfo('[process detail]: '+movieId);
					processDetail(detailsByDayAndCinema);
				});
			
		});
	},total_idle_time);
}
/**
 * handle all the detail request of a movie
 * @param  {array} urls all the detail url to be request
 * @return {none}
 */
function processDetail(urls){
	let idle_total = 0;
	Util.logInfo('[sub] process detail (cinema and date)');

	for (let i=0;i<urls.length;i++){

		idle_total += Math.random() * 2000 + 2000;
		let cur = urls[i];
		let movieId = cur.url.match(/showId=[0-9]+/)[0].split('=')[1];
		console.log(cur);
		let cinemaPath = path.resolve(cur.curPath,cur.cinema);
		Util.logInfo('[check]: '+cinemaPath);
		let existCinema = fs.existsSync(cinemaPath);
		if (!existCinema){
			Util.logInfo('[~~] cinema mkdir: '+cinemaPath);
			fs.mkdirSync(cinemaPath);
		}else{
			Util.logInfo('[!!] cinema dir exist');
		}
		let datePath = path.resolve(cinemaPath, cur.date);
		Util.logInfo('[check]: '+datePath);
		let existDate = fs.existsSync(datePath);
		if (!existDate){
			Util.logInfo('[~~] Date: mkdir: '+datePath);
			fs.mkdirSync(datePath);
		}else{
			Util.logInfo('[!!] Date dir exist');
		}
		Util.logInfo('[set] set all detail tasks for a movie: '+movieId);
		setTimeout(()=>{
			let href = cur.url;
			Util.logInfo('[detail] launch detail request');
			Util.logInfo('[detail] ==>'+href)
			superagent
				.get(href)
				.end((err, data)=>{
					if (err) {
						Util.logError(err);
						throw err;
					}
					Util.logInfo('[saving] ↓↓↓ saving detail content into local fs');
					saveFile(path.resolve(datePath,'index.html'), data.text);
				});
		}, idle_total);
	}
}
function saveFile(path, content){
	fs.writeFile(path, content, function(err){
		Util.logInfo('SAVING DATA');
		if (err) {
			Util.logError(err);
			throw err;
		}
	});
}

/**
 * return the dates of next 3 day
 * @return {[type]} [description]
 */
function getRecentDate(){

}
/**
 * get the string value of today
 * which is in format of 'yyyy-MM-dd'
 * if the digit of month or date less than 2
 * '0' will be the prefix
 * ie 2017-3-1 --> 2017-03-01
 * @return {[type]} [description]
 */
function getToday(){
	let now = new Date();
	let month = now.getMonth()<9 ? '0'+(now.getMonth()+1) : (now.getMonth()+1);
	let day = now.getDate()<10 ? '0'+now.getDate() : now.getDate();
	return now.getFullYear()+'-'+month+'-'+day;
}