var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport').
    localStrategy = require('passport-local').Strategy
    db = require('./models')


app.get('/api/inventory', function(req, res){
  res.json({data: "all inventory"})
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server started!!");
});
