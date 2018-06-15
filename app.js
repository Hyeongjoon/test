var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var temp = require('./routes/temp');
var contact = require('./routes/contact');

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

app.get('/*', function(req, res, next) {
	  if (req.headers.host.match(/^www/) === null ) {
	    res.redirect('http://www.' +req.headers.host + req.url);
	  } else {
	    next();     
	  }
})

app.use('/temp' , temp);
app.use('/contact' , contact);

app.use('/', index);
app.use('/users', users);

//firebase initialize
var admin = require("firebase-admin");

var serviceAccount = require("./helper/airpuri-1c6b7-firebase-adminsdk-c6bvx-763d32faa7.json");

admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://airpuri-1c6b7.firebaseio.com"
});

exports.admin = admin;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//scheduler
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [6];	//토요일 9시 30분 UTC 시간임
rule.hour = 14
rule.minute = 30;

//request
var request = require('request');
//http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=  로또 api 주소
var checkHelper = require('./helper/checkNum');
var mailHelper = require('./helper/makeEmail');
var async = require('async');
var cur_draw_DAO = require('./model/current_draw_no_DAO');

schedule.scheduleJob(rule, function(){
	async.parallel([function(callback){
		cur_draw_DAO.get_draw_num(callback);
	}] , function(err, results){
		var url = 'http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=' + (results[0][0]['no']-1);
		request(url, function (error, response, body) {
			  var reqResult = JSON.parse(body);
			  if(reqResult['returnValue']=='fail'){
				  mailHelper.errorEmail("api결과 에러나옴 ㅠㅠ 이유알아봐야함 이제 안날아감");
			  } else{
				  var result = checkHelper.check([reqResult["drwtNo1"] , reqResult["drwtNo2"],reqResult["drwtNo3"]
				  ,reqResult["drwtNo4"],reqResult["drwtNo5"],reqResult["drwtNo6"]], reqResult["bnusNo"], reqResult["drwNo"]);
				  if(error!=null){
					  mailHelper.errorEmail(error);
				  }  
			  }
			});
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
