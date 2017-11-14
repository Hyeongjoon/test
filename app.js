var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//scheduler
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [6];
rule.hour = 13
rule.minute = 30;

//request
var request = require('request');
//http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=  로또 api 주소
var checkHelper = require('./helper/checkNum');
var mailHelper = require('./helper/makeEmail');
schedule.scheduleJob(rule, function(){
	request('http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=', function (error, response, body) {
		  var reqResult = JSON.parse(body);
		  var result = checkHelper.check([reqResult["drwtNo1"] , reqResult["drwtNo2"],reqResult["drwtNo3"]
		  ,reqResult["drwtNo4"],reqResult["drwtNo5"],reqResult["drwtNo6"]], reqResult["bnusNo"], reqResult["drwNo"]);
		  if(error!=null){
			  mailHelper.errorEmail(error);
		  } 
		});
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
