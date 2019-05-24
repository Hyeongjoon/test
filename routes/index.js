var express = require('express');
var lotto_num = require('../helper/lotto_num');
var emailHelper = require('../helper/makeEmail');
var async = require('async');
var numlogDAO = require('../model/num_logDAO');
var historyDAO = require('../model/historyDAO');
var fs = require('fs')
var formidable = require('formidable');
var pythonShell = require('python-shell');

const options = {
	mode : 'text',
	pythonPath : '/usr/bin/python3.6',
	pythonOptions : [ '-u' ],
};

var router = express.Router();

/* GET home page. */
router
		.get(
				'/',
				function(req, res, next) {
					async
							.parallel(
									[ function(callback) {
										historyDAO.get_all(callback);
									}, function(callback) {
										historyDAO.get_last_week(callback);
									} ],
									function(err, results) {
										if (err) {
											res
													.send("占쎄땀�겫占� 占쎄퐣甕곤옙 占쎌궎�몴�꼷�뿯占쎈빍占쎈뼄. 占쎌삛占쎈뻻占쎌뜎占쎈퓠 占쎈뻻占쎈즲占쎈퉸雅뚯눘苑�占쎌뒄");
										} else {
											res.render('index', {
												all : results[0][0],
												last_week : results[1][0]
											});
										}
									});
				});

router.get('/lotto', function(req, res, next) {
	var arr = lotto_num.getLottoNum();
	async.parallel([ function(callback) {
		numlogDAO.add_log(arr, callback);
	} ], function(err, result) {
		if (err) {
			res.json({
				result : false
			});
		} else {
			res.json({
				result : arr
			});
		}
	});
});

router.post('/send_email', function(req, res, next) {
	async.parallel([ function(callback) {
		emailHelper.makeEmail(req.body, callback);
	} ], function(err, result) {
		if (err) {
			res.json({
				result : false
			})
		} else {
			res.json({
				result : true
			})
		}
	});
});

router.get('/temp', function(req, res, next) {
	res.render('temp', {
		title : 'temp'
	});
});

router.get('/temp1', function(req, res, next) {
	res.render('index-1', {
		title : 'temp'
	});
});

router.get('/apriori', function(req, res, next) {
	res.render('apriori', {
		title : 'temp'
	});
})

router.post('/apriori', function(req, res, next) {
	var form = new formidable.IncomingForm({
		uploadDir : '/home/ec2-user/lotto_app/', // don't forget the
													// __dirname here
		keepExtensions : true
	});
	var text;
	form.on('fileBegin', function(name, file) {
		if (name == 'uploadfile') {
			file.path = '/home/ec2-user/lotto_app/data.xlsx';
		} else {
			file.path = '/home/ec2-user/lotto_app/exception.xlsx';
		}
	})
	form.on('field', function(name, field) {
		text = field
	})
	form.on('end', function(fields, files) {
		async.series([ function(callback) {
			pythonShell.run('init.py', null, function(err) {
				if (err)
					callback('first error', null)
				else {
					callback(null,null)
				}
			});
		}, function(callback){
			pythonShell.run('apriori.py', {args:[text]}, function(err, results) {
				if (err)
					callback('first error', null)
				else {
					callback(null,results)
				}
			});
		}
		], function(err, result){
			if(err)
				res.status(500).json()
			else{
				res.json(result[1])
			}
		})
	})
	form.parse(req)
})

router.get('/check', function(req, res, next){
	res.render('check', {
		title : 'temp'
	});
});

router.post('/check', function(req, res, next){
	var form = new formidable.IncomingForm({
		uploadDir : '/home/ec2-user/lotto_app/', // don't forget the
													// __dirname here
		keepExtensions : true
	});
	var text;
	form.on('fileBegin', function(name, file) {
		if (name == 'uploadfile') {
			file.path = '/home/ec2-user/lotto_app/data1.xlsx';
		} else {
			file.path = '/home/ec2-user/lotto_app/exception1.xlsx';
		}
	})
	form.on('field', function(name, field) {
		text = field
	})
	form.on('end', function(fields, files) {
		async.series([ function(callback) {
			pythonShell.run('init1.py', {args:[text]}, function(err) {
				if (err)
					callback('first error', null)
				else {
					callback(null,null)
				}
			});
		}, function(callback){
			pythonShell.run('test1.py', {args:[text]}, function(err, results) {
				if (err)
					callback('first error', null)
				else {
					callback(null,results)
				}
			});
		}
		], function(err, result){
			if(err)
				res.status(500).json()
			else{
				res.json(result[1])
			}
		})
	})
	form.parse(req)
});

module.exports = router;
