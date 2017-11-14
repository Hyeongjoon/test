var base = require('./baseDAO.js');
var mysql = require('mysql');

exports.updateTemp = function(informArr, callback) {
	var sql = "UPDATE temp SET `5th` = " + mysql.escape(informArr[0])
			+ ", `4th` = " + mysql.escape(informArr[1]) + ", `3rd` = "
			+ mysql.escape(informArr[2]) + ", `2nd` = "
			+ mysql.escape(informArr[3]) + ", `1st` = "
			+ mysql.escape(informArr[4]) + ", `total_num` = "
			+ mysql.escape(informArr[5]);
	base.update(sql, callback);
}