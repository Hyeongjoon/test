var email = require('nodemailer');

var emailConfig = {
		
		};


    // create reusable transporter object using the default SMTP transport
    let emailTransport = email.createTransport({
    	host : 'smtp.gmail.com' ,
		port :465,
		secure : true,
		auth : {
				user : 'sendwitchdev@gmail.com',
				pass : '7557523m'
			}
    });

var mailOption = {
		from : '',
		to : 'anicc@naver.com',
		subject : '',
		html : ''
}


exports.makeEmail = function(inform , callback){
	mailOption.from = '"' + inform.name;
	mailOption.subject = '[ARI] ' +inform.subject;
	mailOption.html = inform.content + '<br \><br \> - '+ inform.name+ '님 '+ inform.email+'에서 온 메일';
	emailTransport.sendMail(mailOption , function(err , info){
		if(err){
			callback(err , null);
		} else{
			callback(null , true);
		}
	});
}

exports.errorEmail = function(error){
	var mailOptionTemp = {
			from : 'wkdwns00@gmail.com',
			to : 'wkdwns00@gmail.com',
			subject : '로또앱 오류났당',
			html : ''
	}
	mailOptionTemp.html = error;
	emailTransport.sendMail(mailOptionTemp, function(err , info){

	});
}