var express = require('express');
var lotto_num = require('../helper/lotto_num');
var emailHelper = require('../helper/makeEmail');
var async = require('async');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lotto' , function(req, res, next){
	res.json({result : lotto_num.getLottoNum()});
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
