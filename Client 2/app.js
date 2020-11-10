// Importing packages
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importing from utils folder
const validateUser = require('./utils/validation');

// Initialization
const app = express();
app.use(cookieParser());
var port = process.env.PORT || 5000;
server_url = process.env.SERVER_URL;

// '/' route
app.get('/', (req, res)=>{
    res.send('<h1>Client Server 2</h1><br><a href="/login">Log In</a>')
})

// '/login' route
app.get('/login', (req, res)=>{
    res.redirect(server_url)
})

// '/auth' route, creates a cookie at client side with the jwt token recieved from server
app.get('/auth', (req, res)=>{
    var token = req.query.token;
    res.cookie('token', token);
    res.redirect('/home')
})

// '/home' route
app.get('/home', validateUser, (req, res)=>{
    res.send('<h1>Signed into Client Server 2</h1>')
})

// Start Server
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})