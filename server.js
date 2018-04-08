var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport').
    localStrategy = require('passport-local').Strategy
    db = require('./models')


app.get('/api/inventory', function(req, res){
  db.Item.find({})
  .populate({
    path: "owner",
    select: "username"
  })
  .exec(function(err, items){
    if(err){
      res.status(500).send(err)
    }
    res.json(items)
  })
})
app.get('/api/households', function(req, res){
  db.Household.find({})
  .populate('members')
  .exec(function(err, households){
    if(err){
      console.log('there was an error finding households')
    }
    res.json(households)
  })
})

app.get('/api/users', function(req, res){
  db.User.find({})
  .populate('households')
  .exec(function(err, users){
    if(err){
      console.log('there was an error finding users')
    }
    res.json(users)
  })

})

app.listen(process.env.PORT || 3000, function() {
  console.log("server started!!");
});
