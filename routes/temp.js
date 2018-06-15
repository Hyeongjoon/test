var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

const request = require('request-promise');

const requestMeUrl = 'https://kapi.kakao.com/v1/user/me?secure_resource=true';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index-airpuri', {});
});

router.get('/contact', function(req, res, next){
	res.render('contact', {});
});

router.post('/sign-up' , function(req, res, next){
	if(req.body.pw_confirm==req.body.pw){
	    admin.auth().createUser({
	    	  email: req.body.email,
	    	  password: req.body.pw,
	    	  displayName: req.body.nickname,
	    	  disabled: false
	    	}).then(function(userRecord) {
	    	    // See the UserRecord reference doc for the contents of userRecord.
	    	    res.json({result : 'success'});
	    	  })
	    	  .catch(function(error) {
	    		  if(error['errorInfo']['code']=='auth/email-already-exists'){
	    			  res.json({result : 'duplicate'});
	    		  } else{
	    			  res.status(500).json({});  
	    		  }
	    	  });
	} else{
		res.status(403).json({});
	}
});

router.get('/use' , function(req, res, next){
	res.render('use', {});
});

router.get('/individual' , function(req, res, next){
	res.render('individual', {});
});

router.get('/auth', function(req,res,next){
	res.render('naverLoginRedirect', {});
})

router.post('/naver_login', function(req, res, next){
	const userId=`naver:${req.body.id}`;
	return naverUpdateOrCreateUser(userId,req.body['email']).then((userRecord)=>{
		if(userRecord == 'email-already-exists'){
    		res.json({result:'duplicate'})
    	} else{
    		admin.auth().createCustomToken(userRecord.uid, {provider: 'NAVER'}).then(function(token){
    			res.json({result:'success' , token : token});
    		}).catch(function(error){
    			res.status(500).json({message: '내부 서버 오류입니다.'});
    		});
    	}
	}).catch(function(err){
		res.status(500).json({message: '내부 서버 오류입니다.'});
	});
});

router.post('/kakao_login' , function(req, res, next){
	requestMyInfo(req.body.access_token).then((response) => {
		    const body = JSON.parse(response)
		    const userId = `kakao:${body.id}`;
		    if (!userId) {
		        res.status(404).json({message: 'There was no user with the given access token.'});
		      }
		    var displayName = null;
		    var profile_image = null;
		    if (body.properties) {
		    	displayName  = body.properties.nickname;
		    	profile_image = body.properties.profile_image;
		      }
		    return updateOrCreateUser(userId, body.kaccount_email, displayName  , profile_image);
		    }).then((userRecord)=> {
		    	if(userRecord == 'email-already-exists'){
		    		res.json({result:'duplicate'})
		    	} else{
		    		admin.auth().createCustomToken(userRecord.uid, {provider: 'KAKAO'}).then(function(token){
		    			res.json({result:'success' , token : token});
		    		}).catch(function(error){
		    			res.status(500).json({message: '내부 서버 오류입니다.'});
		    		});
		    	}
		    })
});
//네이버 아이디로 firebase 등록하기
function naverUpdateOrCreateUser(userId, email) {
	  var updateParams = {
	    provider: 'NAVER',
	    displayName: email.substring(0,email.lastIndexOf('@'))
	  };
	  return admin.auth().updateUser(userId, updateParams)
	  .catch((error) => {
	    if (error.code === 'auth/user-not-found') {
	      updateParams['uid'] = userId;
	      if (email) {
	        updateParams['email'] = email;
	      }
	      console.log(updateParams);
	      return admin.auth().createUser(updateParams).catch((error)=>{
	    	  console.log(error);
	    	  if(error.code==='auth/email-already-exists'){
	    		  return 'email-already-exists';
	    	  }
	    	  throw error;
	      });
	    }
	    throw error;
	  });
	};


//카카오 서버에 내 정보 요청하기
function requestMyInfo(kakaoToken) {
	  return request({
	    method: 'GET',
	    headers: {'Authorization': 'Bearer ' + kakaoToken},
	    url: requestMeUrl,
	  });
	};
	function updateOrCreateUser(userId, email, displayName, photoURL) {
		  var updateParams = {
		    provider: 'KAKAO',
		    displayName: displayName,
		    emailVerified: true
		  };
		  if (displayName) {
		    updateParams['displayName'] = displayName;
		  } else {
		    updateParams['displayName'] = email;
		  }
		  if (photoURL) {
		    updateParams['photoURL'] = photoURL;
		  }
		  return admin.auth().updateUser(userId, updateParams)
		  .catch((error) => {
		    if (error.code === 'auth/user-not-found') {
		      updateParams['uid'] = userId;
		      if (email) {
		        updateParams['email'] = email;
		      }
		      return admin.auth().createUser(updateParams).catch((error)=>{
		    	  if(error.code==='auth/email-already-exists'){
		    		  return 'email-already-exists';
		    	  }
		    	  throw error;
		      });
		    }
		    throw error;
		  });
		};
	
	
module.exports = router;