const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
let content = fs.readFileSync('./city_raw.htm');
const $ = cheerio.load(content);

let json_string = '';
json_string += '[';
$('.M-cityList a').each(function(){
	let cur = $(this);
	let city = cur.text().trim();
	let code = cur.attr('data-id');
	json_string += ('{"city": "'+city+'","code":'+code+'},');
});
json_string += ']';

// let filePath = path.resolve(__dirname, 'city_code.json');
// console.log(filePath);
fs.writeFile('city_code.json', json_string, ()=>{console.log('parse finish')});