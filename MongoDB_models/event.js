var mongoose = require("mongoose")
// var passportLocalMongoose = require("passport-local-mongoose")

var eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  location: String,
  description: String,
  RSVS: [String]
})

// mentorSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Event", eventSchema)
