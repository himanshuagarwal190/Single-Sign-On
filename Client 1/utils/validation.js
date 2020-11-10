// Importing jwt package and secret
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.jwt_secret;

// Middleware function to check if user is logged in or not
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

module.exports = validateUser;