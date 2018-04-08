var mongoose = require("mongoose"),
    Schema = mongoose.Schema


var ItemSchema = new Schema({
  title: String,
  description: String,
  category: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  image: String,
  value: Number,
  toKeep: Boolean,
  household: {
    type: Schema.Types.ObjectId,
    ref: "Household"
  }

})

var Item = mongoose.model("Item", ItemSchema)
module.exports = Item;