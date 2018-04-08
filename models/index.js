var mongoose = require('mongoose')
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/home-inventory")

module.exports.User = require("./user")
module.exports.Item = require('./item')
module.exports.Household = require('./household')