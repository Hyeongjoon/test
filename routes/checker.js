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
	var text = req.body.text
	console.log(req.body)
	spellcheck(dict, text, function(err, typos) {
		if(err){
			res.status(500).json()
		} else{
			res.json(typos)
		}
	})
})

module.exports = router;