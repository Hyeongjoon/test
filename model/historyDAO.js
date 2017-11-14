var base = require('./baseDAO.js');
var mysql = require('mysql');

exports.get_last_week = function(callback){
	var sql = "SELECT * from last_week_history";
	base.select(sql , callback);
}

exports.get_all = function(callback){
	var sql = "SELECT * from all_history";
	base.select(sql , callback);
}