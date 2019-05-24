var express = require('express');
var nodehun = require('nodehun')
var spellcheck = require('nodehun-sentences')
var fs =require('fs')
var affbuf = fs.readFileSync('./assets/ko.aff');
var dictbuf = fs.readFileSync('./assets/ko.dic');
var dict = new nodehun(affbuf,dictbuf);;
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('checker',{ })
})

router.post('/', function(req, res, next){
	console.log(req.body)
	/*spellcheck(dict, text, function(err, typos) {
		
	})*/
})

module.exports = router;