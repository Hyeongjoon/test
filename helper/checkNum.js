var async = require('async');
var numDAO = require('../model/num_logDAO');
var tempDAO = require('../model/tempDAO');
var mailHelper = require('../helper/makeEmail');

exports.check = function(winArr , bonusNum , drawNo){
	 async.waterfall([function(callback){
		  numDAO.get_log(drawNo, callback);
	  } , function(args1 , callback){
		  var lastWeek = [0,0,0,0,0,0];			//5등, 4등, 3등, 2등, 1등, 뽑힌개수  
		  for(var i = 0 ; i <args1.length; i++){
			  var count = 0;
			  for(var k = 1 ; k < 7 ; k++){
				  for(var j = 0 ; j< 6; j++){
					  if(args1[i]["no"+k] == winArr[j]){
						  ++count;
						  break;
					  }
				  }
			  }
			  switch(count) {
			  		case 3:{
			  			++lastWeek[0];
			  			break;
			  		} case 4:{
			  			++lastWeek[1];
			  			break;
			  		} case 5:{
			  			var secondCheck = false;		//2등인지 아닌지 체크하기위한 변수
			  			for(var k = 1 ; k<7 ; k++){
			  				if(args1[i]["no"+k]==bonusNum){
			  					secondCheck = true;
			  					break;
			  				}
			  			}
			  			if(!secondCheck){
			  				++lastWeek[2];					//3등이면
			  			} else{
			  				++lastWeek[3];					//2등이면
			  			}
			  			break;
			  		} case 6:{
			  			++lastWeek[4];
			  			break;
			  		}
			  }
			  ++lastWeek[5];
		  }
		  console.log(lastWeek);
		  tempDAO.updateTemp(lastWeek , callback);
	  }], function(err , results){
		  if(err){
			  mailHelper.errorEmail(err);
		  } else{
			  mailHelper.errorEmail("잘 들어갔당");
		  }
	  });
};