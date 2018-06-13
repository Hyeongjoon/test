var base = require('./baseDAO.js');
var mysql = require('mysql');

exports.get_draw_num = function(callback){
	var sql = "select `no` from current_draw_no WHERE id = 1";
	base.select(sql , callback);
}
