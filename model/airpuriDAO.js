var base = require('./airpuri_baseDAO.js');
var mysql = require('mysql');

exports.insertOrder = function(inform,callback){
	var sqlQuery = 'insert into order_log set ?'
	base.insert(sqlQuery , inform, callback);
}