var ProgressBar = require('progress');

var bar = new ProgressBar('Processing [:bar] :percent', { total: 200 });
var timer = setInterval(function () {
  bar.tick(10);
  if (bar.complete) {
    console.log('\ncomplete\n');
    console.log(bar);
    clearInterval(timer);
  }
}, 100);