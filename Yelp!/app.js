/* Main backend for our Yelp app */
const port        = 5000
var express       = require("express"),
    bodyParser    = require("body-parser"),    // for Express's post method
    mongoose      = require("mongoose")

var app           = express()
// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
 // create Db inside mongoDB or use existing Db
mongoose.connect("mongodb://localhost/YelpTravel_destinations", { useNewUrlParser: true })
// DB Schema setup - define data types of DB
var destinationSchema = new mongoose.Schema({
  name: String,
  state: String,
  country: String,
  image: String,
  description: String
})
var Destination = mongoose.model("Destination", destinationSchema)    // create a new collection called destination in YelpTravel_destinations database

// Destination.create({
//   name: "Emerald Bay State Park",
//   state: "California", image: "photos/emerald_bay.jpg",
//   country: "United States of America",
//   description: "Breathtaking bay surrounded by forest and hills. Kayak on the deep blue water and observe the sparkling ocean from the little island at the middle of the Bay."
// }, function(err, dest) {
//   if (err)
//     console.log("Error adding new destination to Database: " + err)
//   else
//     console.log("New destination was added to Database: " + dest)
// })

var destinations = [
      { name: "Emerald Bay State Park", state: "California", img: "photos/emerald_bay.jpg"},
      { name: "Disneyland", state:"California", img: "photos/disneyland.jpg"},
      { name: "Santa Monica Beach", state:"California", img: "photos/santa_monica.jpg"},   // array of objects
      { name: "Emerald Bay State Park", state: "California", img: "photos/emerald_bay.jpg"},
      { name: "Santa Monica Beach", state:"California", img: "photos/santa_monica.jpg"},   // array of objects
      { name: "Disneyland", state:"California", img: "photos/disneyland.jpg"},
      { name: "Santa Monica Beach", state:"California", img: "photos/santa_monica.jpg"},   // array of objects
      { name: "Emerald Bay State Park", state: "California", img: "photos/emerald_bay.jpg"},
      { name: "Disneyland", state:"California", img: "photos/disneyland.jpg"},
      { name: "Santa Monica Beach", state:"California", img: "photos/santa_monica.jpg"}]   // array of objects

// HOMEPAGE
app.get("/", (req, res) => {
  res.render("landing.ejs")
})

// INDEX Route: Get all campgrounds from Db and display them
app.get("/destinations", (req, res) => {
  Destination.find({}, (error, results) => {
    if (error)
      console.log("Error when retrieving destinations from database: " + error)
    else
      res.render("destinations.ejs", {destinations : results})
  })
})

// CREATE Route: Creating new destinations to Db, same URL as 'get' method cuz RESTFUL
app.post("/destinations", (req, res) => {
  // Test: when user hits submit button, server will see this as proof that routing works
  // res.send("You hit the post route!!")
  var newDest = {
          name: req.body.destName,
          state: req.body.state,
          country: req.body.country,
          image: req.body.img_url,
          description: req.body.description}

  // create a new destination in MongoDB
  Destination.create(newDest, (error, newlyCreated) => {
    if (error)
      console.log("Error when updating database: " + error)
    else{
      // redirect back to /destinations page of 'get' request
      res.redirect("/destinations")
    }
  })

})

// NEW Route: Show Form to add new destination to database
app.get("/destinations/new", (req, res) =>{
  res.render("new.ejs")
})

// SHOW route: show information of 1 destination
app.get("/destinations/:id", (req, res) => {
  // find the destination with provived ID
  // id in the URL is the Mongo's ID for each destination. When user click "More info", they send the id along with the click
  Destination.findById(req.params.id, (error, foundResult) =>{
    if (error)
      console.log("Error retrieving destination by ID from MongoDB. ")
    else
      res.render("show.ejs", {destination: foundResult})    // render page with that destination
  })


})
app.listen(port, () => console.log(`Yelp App server is listening on port ${port}`))
