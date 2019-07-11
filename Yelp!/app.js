/* Main backend for our Yelp app */
const port        = 5000
var express       = require("express")
var bodyParser    = require("body-parser")    // for Express's post method
var app           = express()
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

// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// HOMEPAGE
app.get("/", (req, res) => {
  res.render("landing.ejs")
})

app.get("/destinations", (req, res) => {
  res.render("destinations.ejs", {destinations : destinations})
})

// Creating new destinations, same URL as 'get' method cuz REST
app.post("/destinations", (req, res) => {
  // Test: when user hits submit button, server will see this as proof that routing works
  // res.send("You hit the post route!!")
  // get data from form and add to destinations array
  var newDest = {
          name: req.body.destName,
          state: req.body.state,
          img: req.body.img_url}
  destinations.push(newDest)
  // redirect back to /destinations page of 'get' request
  res.redirect("/destinations")
})

// Show Form to add new destination to database
app.get("/destinations/new", (req, res) =>{
  res.render("new.ejs")
})
app.listen(port, () => console.log(`Yelp App server is listening on port ${port}`))
