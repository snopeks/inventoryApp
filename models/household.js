var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var HouseSchema = new Schema({
  name: String,
  items: [
    {
      type: Schema.Types.ObjectId, 
      ref: "Item"
    }
  ]
})

var Household = mongoose.model("Household", HouseSchema);
module.exports = Household;