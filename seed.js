var db = require("./models")

var user1 = {
    username: 'stephanie',
    password: '12345'
  }

var items_list = [
  {
    title: "roller blades",
    description: 'black and grey',
    category: "sports",
    image: "nothing yet",
    value: 5,
    toKeep: false
  },
  {
    title: "monstera plant",
    description: 'large and healthy',
    category: 'plant',
    image: 'nothing yet',
    value: 20,
    toKeep: false
  }
]

db.User.remove({}, function(err, users){
  console.log('removed all users!');
  db.User.create(user1, function(err, newUser){
    if(err){
      console.log('error creating user!')
      return;
    }
    console.log("created", newUser.username, '!' )
  })

  db.Item.remove({}, function(err){
    console.log('removed all items')
    items_list.forEach(function(itemData){
      var item = new db.Item({
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        image: itemData.image,
        value: itemData.value,
        toKeep: itemData.toKeep
      })
      db.User.findOne({username: 'stephanie'}, function(err, foundUser){
        console.log("found user", foundUser.username)
        if (err){
          return console.log("ERROR FINDING USER!", err)
        }
        item.owner = foundUser
        item.save(function(err, savedItem){
          if(err){
            return console.log('error saving item!', err)
          }
          console.log("saved item", item.title)
        })
      })
    })
  })
})
