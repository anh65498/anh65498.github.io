var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose)    // add methods of passportLocalMongoose to userSchema 

module.exports = mongoose.model("User", userSchema)
