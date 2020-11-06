const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cookieParser());
var port = process.env.PORT || 5000;
jwt_secret = process.env.JWT_SECRET;
server_url = process.env.SERVER_URL;

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
    res.send('<h1>Client Server 2</h1><br><a href="/login">Log In</a>')
})

app.get('/login', (req, res)=>{
    res.redirect(server_url)
})

app.get('/auth', (req, res)=>{
    var token = req.query.token;
    res.cookie('token', token);
    res.redirect('/home')
})

app.get('/home', validateUser, (req, res)=>{
    res.send('<h1>Signed into Client Server 2</h1>')
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})