var base = require('./baseDAO.js');
var mysql = require('mysql');

exports.add_log = function(numArr , callback){
	var sql = "call set_draw(?,?,?,?,?,?)";
	base.procedure(sql , numArr, callback);
}