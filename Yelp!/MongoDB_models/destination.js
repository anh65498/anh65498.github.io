var mongoose = require("mongoose")
var destinationSchema = new mongoose.Schema({
  name: String,
  state: String,
  country: String,
  image: String,
  description: String,
})
module.exports = mongoose.model("Destination", destinationSchema)    // create a new collection called destination in YelpTravel_destinations database
