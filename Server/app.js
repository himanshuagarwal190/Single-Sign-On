// Importing packages
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importing from utils folder
const {validateLogin, validateUser} = require('./utils/validation.js');
var users = require('./utils/users')

//Intialization
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var port = process.env.PORT || 3000;

//Secret Keys
jwt_secret = process.env.JWT_SECRET;
sha256_secret = process.env.SHA256_SECRET;

// '/' route
app.get('/', (req, res)=>{
    res.send('<h1>SSO Server</h1><br><a href="/login">Log In</a>')
})

// '/home' route
app.get('/home', validateUser, (req, res)=>{
    res.send('<h1>Signed into SSO Server</h1>')
})

// '/login' route
app.get('/login', validateLogin, (req, res)=>{
    //if there is client url in continue param
    if(req.query.continue){
        res.render('login', {cont: req.query.continue});
    }
    //if there is no client url in continue param
    else{
        res.render('login', {cont: '/home'});
    }
})

// '/auth' route for checking user credentials entered and creating jwt token
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

// Starting Server
app.listen(port, ()=>{
    console.log(`Server started on Port ${port}`)
})