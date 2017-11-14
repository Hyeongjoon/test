var express = require('express');
var lotto_num = require('../helper/lotto_num');
var emailHelper = require('../helper/makeEmail');
var async = require('async');
var numlogDAO = require('../model/num_logDAO');
var historyDAO = require('../model/historyDAO');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	async.parallel([function(callback){
		historyDAO.get_all(callback);
	} , function(callback){
		historyDAO.get_last_week(callback);
	}] , function(err , results){
		if(err){
			res.send("내부 서버 오류입니다. 잠시후에 시도해주세요");
		} else{
			res.render('index', { all : results[0][0] , last_week : results[1][0] });
		}
	});
});

router.get('/lotto' , function(req, res, next){
	var arr = lotto_num.getLottoNum();
	async.parallel([function(callback){
		numlogDAO.add_log(arr , callback);
	}],function(err, result){
		if(err){
			res.json({result : false});
		} else{
			res.json({result : arr});
		}
	});
});

router.post('/send_email' , function(req, res, next){
	async.parallel([function(callback){
		emailHelper.makeEmail(req.body, callback);
	}] , function(err , result){
		if(err){
			res.json({result : false})
		}else{
			res.json({result : true})
		}
	});
});

module.exports = router;
