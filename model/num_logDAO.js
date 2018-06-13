var base = require('./baseDAO.js');
var mysql = require('mysql');

exports.add_log = function(numArr , callback){
	var sql = "call set_draw(?,?,?,?,?,?)";
	base.procedure(sql , numArr, callback);
}

exports.get_log = function(drawNo , callback){
	var sql = "select `no1`, `no2`, `no3`, `no4`, `no5`, `no6` from num_log WHERE `drawno` = " + mysql.escape(drawNo);
	console.log(sql);
	base.select(sql , callback);
}