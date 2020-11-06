const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var port = process.env.PORT || 3000;

var users = {'xyz@gmail.com': {name: 'xyz',
              password: 'a726e1f78aef10b87e1cab277aaf24bca91b00d5b4911fad2ee794a3441b7748'}};
jwt_secret = process.env.JWT_SECRET;
sha256_secret = process.env.SHA256_SECRET;

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

app.get('/', (req, res)=>{
    res.send('<h1>SSO Server</h1><br><a href="/login">Log In</a>')
})

app.get('/home', validateUser, (req, res)=>{
    res.send('<h1>Signed into SSO Server</h1>')
})

app.get('/login', validateLogin, (req, res)=>{
    if(req.query.continue){
        res.render('login', {cont: req.query.continue});
    }
    else{
        res.render('login', {cont: '/home'});
    }
})

app.post('/auth', (req, res)=>{
    if (users[req.body.email]){
        var pwd = sha256(req.body.password + sha256_secret);
	console.log(pwd)
        //correct password
        if (pwd == users[req.body.email].password){
            var token = jwt.sign({name: users[req.body.email].name, email: req.body.email}, jwt_secret);
            // create jwt as a cookie
            res.cookie('token', token, {httpOnly: true});
            // redirect to client with token
            res.redirect(req.query.continue + '?token=' + token);
        }
        //wrong password
        else{
            console.log('wrong password')
            res.redirect('/login?continue=' + req.query.continue);
        }
    }
    //wrong email
    else{
        console.log('wrong email')
        res.redirect('/login?continue=' + req.query.continue);
    }
})

app.listen(port, ()=>{
    console.log(`Server started on Port ${port}`)
})