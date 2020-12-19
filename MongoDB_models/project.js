var mongoose = require("mongoose")
// var passportLocalMongoose = require("passport-local-mongoose")

var projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  cover_img: String,
  author: String,
  tools: String,
})

// mentorSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Project", projectSchema)
