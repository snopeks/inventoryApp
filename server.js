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

  //Remove caching (WITHOUT THIS THE APP WON'T RUN LOCALLY)
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//home route
app.get('/', function(req, res){
  console.log(req.body);
  res.send("Welcome to the inventory api!");
})

//get all inventory
app.get('/api/inventory', function(req, res){
  console.log('here isreq.user', req.query.username)
  db.Item.find({})
  .populate({
    path: "owner",
    select: "username"
  })
  .populate({
    path: "household",
    select: "name"
  })
  .exec(function(err, items){
    if(err){
      res.status(500).send(err)
    }
    res.json(items)
  })
})
//add an item to user household
app.post('/api/inventory/', function(req, res){
  console.log('this is the user', req.user)
  const newItem = new Item({
    title: req.body.title, 
    description: req.body.desc,
    category: req.body.category,
    owner: req.user,
    image: req.body.image,
    value: req.body.value, 
    toKeep: req.body.keep,
    household: req.body.household
  })
  newItem.save(function(err, item){
    if(err){
      res.status(500).send(err)
    }
    res.send(newItem)
  })
})
//get all households and members
app.get('/api/households', function(req, res){
  db.Household.find({})
  .exec(function(err, households){
    if(err){
      console.log('there was an error finding households')
    }
    res.json(households)
  })
})

//create a new household and add house to current user
app.post('/api/households', function(req,res){
  console.log('this is req.body', req.body)
  console.log(req.body.name)
  const newHouse = new db.Household({
    name: req.body.name,
    items: []
  })
  db.User.findOne({username: req.body.username})
  .exec(function(err, foundUser){
    if(err){
     console.log('error finding user!')
    }
    console.log("here is found user!", foundUser)
    foundUser.households.push(newHouse)
    foundUser.save().then(function(savedUser){
      console.log("saving household to user!")
      return; 
    })
  })
  newHouse.save(function(err, household){
    if(err){
      console.log("error saving new household")
    }
    res.send(household)
  })
})
//get all users
app.get('/api/users', function(req, res){
  db.User.find({})
  .populate({path: 'households', select: "name"})
  .exec(function(err, users){
    if(err){
      console.log('there was an error finding users')
      res.send("error!", {error: err})
    }
    res.json(users)
  })

})
//get one user based on username
app.get('/api/users/:username', function(req, res){
  console.log(req.params.username)
  db.User.find({username: req.params.username})
  .populate({
    path: "households",
    select: "name"
  })
  .exec(function(err, user){
    if(err){
      console.log('there was an error getting your user!')
      re.send("error!", {error: err})
    }
    res.json(user)
  })
})


//Login users
app.post('/login',
  passport.authenticate('local'),
  function(req, res){
    console.log("in the login fn");
    // console.log("THIS IS THE USER OBJECT", req.user);
    res.status(200).send(req.user);
});
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
  console.log(`server started!`);
});
