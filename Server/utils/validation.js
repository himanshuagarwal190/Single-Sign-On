const jwt_secret = process.env.jwt_secret
const jwt = require('jsonwebtoken');

// Function to check if user is already logged in or not at login route.
function validateLogin(req, res, next){
    jwt.verify(req.cookies.token, jwt_secret, function(err, decoded) {
		if(err){
			next();
		}
		else{
            //if continue parameter is present redirect to client server
            if(req.query.continue){
                var token = req.cookies.token
                res.redirect(req.query.continue + '?token=' + token)
            }
            //if continue parameter is empty redirect to sso homepage
			else{
                res.redirect('/home')
            }
		}
	  });
}

//Function to check if user logged in or not at home route.
//Use this middleware to protect all your secret routes.
function validateUser(req, res, next){
    jwt.verify(req.cookies.token, jwt_secret, function(err, decoded) {
		if(err){
			res.redirect('/login')
		}
		else{
            next();
		}
	  });
}

module.exports = {validateLogin, validateUser}