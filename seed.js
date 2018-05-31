var db = require("./models")
var faker = require('faker')

var users_list = [
  {
    username: 'stephanie',
    password: '12345',
    households: [],
    items: []
  },
  {
    username: "steven",
    password: '12345',
    households: [],
    items: []
  }
]

var snowgillHouse = {
  name: "Snowgill",
  members: [],
  items: []
}

var items_list = [
  {
    title: "roller blades",
    description: 'black and grey',
    category: "sports",
    image: "nothing yet",
    value: 5,
    toKeep: false,
    owner: 'stephanie'
  },
  {
    title: "monstera plant",
    description: 'large and healthy',
    category: 'plant',
    image: 'nothing yet',
    value: 20,
    toKeep: false,
    owner: 'stephanie'
  },
  {
    title: 'hockey stick 1',
    description: 'white and black',
    category: 'sports',
    image: 'nothing yet',
    value: 100,
    toKeep: true,
    owner: 'steven'
  },
  {
    title: "hockey net",
    description: 'hockey net with white net and red posts',
    category: 'sports',
    image: 'nothing yet',
    value: 300,
    toKeep: true,
    owner: 'steven'
  }
]

function makeUsers(){
  return db.User.remove({}).then(function(){
    console.log("1 TRYING TO CREATE USERS <<<<")
    return db.User.create(users_list).then(function(newUsers){
      console.log("1 created", newUsers.length, 'users!' )
    })
  }).catch(function(error){
    console.log('error creating users!', error)
  })
}

function makeHouseholds() {
  return db.Household.remove({}).then(function(){
    console.log("2 TRYING TO CREATE HOUSEHOLD <<<");
    return new db.Household({
      name: snowgillHouse.name,
      members: snowgillHouse.members
    })
  }).then(function(ourHouse){
    console.log('2 our house name', ourHouse.name)
    return db.User.findOne({username: "stephanie"})
    .then(function(foundUser1){
      console.log("2 finding user1 for household:", foundUser1)
      foundUser1.households.push(ourHouse)
      return foundUser1.save().then(function(savedUser){
        console.log("TRYING TO SAVE HOUSEHOLD TO USER", savedUser)
        return ourHouse
      })
    })
  }).then(function(ourHouse){
    console.log('3 this is our house!', ourHouse);
    return db.User.findOne({username: 'steven'})
    .then(function(foundUser2){
      console.log('3 finding user for household:', foundUser2.username)
      foundUser2.households.push(ourHouse)
      return foundUser2.save().then(function(savedUser){
        console.log("TRYING TO SAVE HOUSE HOLD TO USER", savedUser);
        return ourHouse
      })
      console.log('3 house members', ourHouse.members);
    })
  }).then(function(ourHouse){
    console.log("4 ready to save house")
    return ourHouse.save().then(function(savedHouse){
      console.log('4 saved', savedHouse.name, "house")
    })
  })
}
function makeItems(){
  return db.Item.remove({}).then(function(){
    console.log('5 removed all items')
  }).then(async function(){
    for(let itemData of items_list){
      var item = new db.Item({
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        image: itemData.image,
        value: itemData.value,
        toKeep: itemData.toKeep
      })
      await db.User.findOne({username: itemData.owner}).then(function(foundUser){
        console.log("6A finding user for item", foundUser.username, "<<<<<<<<")
        item.owner = foundUser
      })
      await db.Household.findOne({name: "Snowgill"}).then(function(foundHouse){
        console.log("6B finding household for item", foundHouse.name)
        item.household = foundHouse
        console.log("6B owner and household!", item.owner, item.household)
      })
      await item.save().then(function(savedItem){
        console.log(savedItem)
        console.log("6C saved item", savedItem.title, savedItem.owner.username)
      })
    }
  })
}

async function seedDB(){
  await makeUsers();
  await makeHouseholds();
  await makeItems();
}

seedDB();