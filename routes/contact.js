var express = require('express');
var router = express.Router();
var emailHelper = require('../helper/air_mail');
var async = require('async');

 
router.get('/', function(req, res, next){
	res.render('contact', {});
});

router.post('/send_mail' , function(req, res, next){
	async.parallel([function(callback){
		emailHelper.makeEmail(req.body, callback);
	}] , function(err , result){
		if(err){
			res.status(500).json({result : false})
		}else{
			res.json({result : true})
		}
	});
});

module.exports = router;