var mongoose = require("mongoose")
// var passportLocalMongoose = require("passport-local-mongoose")

var mentorSchema = new mongoose.Schema({
  name: String,
  skills: String,
  experience: String,
  company: String,
  projects: String,
  cover_img: String,
})

// mentorSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Mentor", mentorSchema)
