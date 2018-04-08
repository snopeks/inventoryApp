var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema ({
  username: String,
  password: String,
  households: [
    {
      type: Schema.Types.ObjectId,
      ref: "Household"
    }
  ]
})

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", UserSchema);
module.exports = User;