var express = require('express');
var router = express.Router();
var fs = require('fs')
var formidable = require('formidable');
var pythonShell = require('python-shell');
var mime = require('mime');
var async = require('async')

const options = {
		mode : 'text',
		pythonPath : '/usr/bin/python3.6',
		pythonOptions : [ '-u' ],
	};


router.get('/', function(req, res, next) {
	res.render('calScore',{title:'temp'})
})

router.post('/', function(req, res, next) {
	
	var form = new formidable.IncomingForm({
		uploadDir : '/home/ec2-user/lotto_app/', // don't forget the												// __dirname here
		keepExtensions : true
	});
	var text;
	form.on('fileBegin', function(name, file) {
		if (name == 'uploadfile') {
			file.path = '/home/ec2-user/lotto_app/scoredata.xlsx';
		} else {
			file.path = '/home/ec2-user/lotto_app/score.xlsx';
		}
	})
	form.on('end', function(fields, files) {
		async.series([ function(callback) {
			pythonShell.run('score.py', {}, function(err, results) {
				if (err)
					callback('first error', null)
				else {
					callback(null,results)
				}
			});
		}], function(err, result){
			if(err)
				res.status(500).json()
			else{
				res.json('http://www.lottofreenum.com/result_score.xlsx    를 주소창에 쳐주세요!');
			}
		})
	})
	form.parse(req)
});

module.exports = router;