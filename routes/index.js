var express = require('express');
var lotto_num = require('../helper/lotto_num');
var emailHelper = require('../helper/makeEmail');
var async = require('async');
var numlogDAO = require('../model/num_logDAO');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lotto' , function(req, res, next){
	var arr = lotto_num.getLottoNum();
	async.parallel([function(callback){
		numlogDAO.add_log(arr , callback);
	}],function(err, result){
		res.json({result : arr});
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
