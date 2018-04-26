var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./models')

// configure body parser for req.body data
app.use(bodyParser.urlencoded({ extended: true, }));

//config auth middleware
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey', // change this!
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  // //Remove caching
  // res.setHeader('Cache-Control', 'no-cache');
  // next();
});

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
//Signup Route and auth user at the same time
app.post('/signup', function (req, res) {
 console.log(req.body.username, req.body.password);
 db.User.register(new db.User({ username: req.body.username }), req.body.password,
    function (err, newUser) {
      if(err){
        console.log(err);
        res.status(404).send(err)
      }
      passport.authenticate('local')(req, res, function() {
        console.log(newUser)
        res.send(newUser);
      });
    })
});



app.listen(process.env.PORT || 3000, function() {
  console.log("server started!!");
});
