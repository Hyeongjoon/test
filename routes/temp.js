var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");
 
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


module.exports = router;