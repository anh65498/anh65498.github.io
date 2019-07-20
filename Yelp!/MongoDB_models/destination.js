var mongoose = require("mongoose")
var destinationSchema = new mongoose.Schema({
  name: String,
  state: String,
  country: String,
  image: String,
  description: String,
  author: {       // only author of the post can edit/remove it
    id: {   // id of user in "users" collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, // each comment is a reference to
      ref: "Comment"                        // Comment schema
    }
  ]
})
module.exports = mongoose.model("Destination", destinationSchema)    // create a new collection called destination in YelpTravel_destinations database
