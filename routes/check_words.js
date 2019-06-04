var express = require('express');
var fs =require('fs')
var formidable = require('formidable');
var pythonShell = require('python-shell');
var router = express.Router();
var async = require('async');

const options = {
	mode : 'text',
	pythonPath : '/usr/bin/python3.6',
	pythonOptions : [ '-u' ],
};

router.get('/', function(req, res, next){
	res.render('check_words',{ })
})

router.post('/', function(req, res, next){
	console.log("여기옴?")
	var form = new formidable.IncomingForm({
		uploadDir : '/home/ec2-user/lotto_app/', // don't forget the
													// __dirname here
		keepExtensions : true
	});
	var text;
	var text1;
	form.on('fileBegin', function(name, file) {
		if (name == 'uploadfile') {
			file.path = '/home/ec2-user/lotto_app/words_data.xlsx';
		} else {
			file.path = '/home/ec2-user/lotto_app/words_exception.xlsx';
		}
	})
	form.on('field', function(name, field) {
		if(name=='text'){
			text = field
		} else{
			text1 = field
		}
	})
	form.on('end', function(fields, files) {
		async.series([ function(callback) {
			console.log("여기옴?1")
			pythonShell.run('check_words.py', {args:[text]}, function(err) {
				if (err){
					console.log(err)
					callback('first error', null)
				}
				else {
					console.log(111)
					callback(null,null)
				}
			});
		}, function(callback){
			pythonShell.run('find_words.py', {args:[text1]}, function(err, results) {
				console.log(222)
				if (err){
					console.log(err)
					callback('first error', null)
				}
				else {
					console.log(333)
					callback(null,results)
				}
			});
		}
		], function(err, result){
			if(err){
				console.log(err)
				res.status(500).json()
			}
			else{
				console.log(result[1])
				res.json(result[1])
			}
		})
	})
	form.parse(req)
})

module.exports = router;