var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var HouseSchema = new Schema({
  name: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
})

var Household = mongoose.model("Household", HouseSchema);
module.exports = Household;