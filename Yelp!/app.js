/* Main backend for our Yelp app */
const port        = 5000
var express       = require("express"),
    app           = express()
    bodyParser    = require("body-parser"),    // for Express's post method
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local")
    // DB Schema setup - define data types of DB
    Destination   = require("./MongoDB_models/destination.js"),
    Comment       = require("./MongoDB_models/comment.js")
    User          = require("./MongoDB_models/user.js")
    seedDB        = require("./seeds.js")    // clear all database and populate it with users. this file is at the same folder as app.js

// create Db inside mongoDB or use existing Db
mongoose.connect("mongodb://localhost/YelpTravel_destinations", { useNewUrlParser: true })
// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// clear Db and populate it with fake destinations. If uncomment, Might run into error "Cannot read property 'name' of null  error" then see at the end.
seedDB()

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

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next()
})  // whatever function is in use() will be called on every route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


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

// NEW Route: Show Form to add new destination to database
// isLoggedIn() is a middleware function that checked if user is logged in. If they are, render new.ejs. If not, redirect to /login
app.get("/destinations/new", isLoggedIn, (req, res) =>{
  res.render("new_destination.ejs")
})


// CREATE Route: Creating new destinations to Db, same URL as 'get' method cuz RESTFUL
// isLoggedIn() is a middleware function that checked if user is logged in. If they are, render new.ejs. If not, redirect to /login
app.post("/destinations", isLoggedIn, (req, res) => {
  // Test: when user hits submit button, server will see this as proof that routing works
  // res.send("You hit the post route!!")
  var newDest = {
          name: req.body.destName,
          state: req.body.state,
          country: req.body.country,
          image: req.body.img_url,
          description: req.body.description,
          author: {
            id: req.user._id,
            username: req.user.username
          }
        }

  // create a new destination in MongoDB
  Destination.create(newDest, (error, newlyCreated) => {
    if (error)  console.log("Error when updating database: " + error)
    else{
      // redirect back to /destinations page of 'get' request
      res.redirect("/destinations")
    }
  })
})

// SHOW route: show data and comments of 1 destination.
app.get("/destinations/:id", (req, res) => {
  // find the destination with provived ID
  // id in the URL is the Mongo's ID for each destination. When user click "More info", they send the id along with the click
  // use populate.exec() to translate the Comment's id to actual Comment in "Destination" db to display.
  // Inside foundDestination, instead of Comments' id, there're be actual comments
  Destination.findById(req.params.id).populate("comments").exec((error, foundDestination) =>{
    if (error)
      cosole.log("Error retrieving destination by ID from MongoDB. ")
    else
      res.render("show.ejs", {destination: foundDestination})    // render page with that destination
  })
})


// =============================================
//             COMMENT ROUTES
// =============================================
// NEW route: Show form to create a new comment attached to a destination post
app.get("/destinations/:id/comments/new", (req, res) =>{
  // find destination by id from db to pass destination's data to the form
  Destination.findById(req.params.id, (error, retDestination) => {
    if (error) console.log("Error getting destination by ID in comment route: " + error)
    else
      res.render("new_comment.ejs", {destination : retDestination})
  })
})

// CREATE route: Create a new comment then attach it to a destination post
app.post("/destinations/:id/comments", (req, res) =>{
  // lookup destination using ID
  Destination.findById(req.params.id, (error, foundDestination) =>{
    if (error) console.log("Error finding Destination in DB when creating new comment in DB")
    else {
      //create new comment
      Comment.create(req.body.comment, (error, newlyCreated) =>{
        if (error) console.log("Error adding new comment to database")
        else {
          // connect new comment to destination and save this change to DB
          foundDestination.comments.push(newlyCreated)
          foundDestination.save();
          // redirect to destination post
          res.redirect("/destinations/" + foundDestination._id)
        }
      })
    }
  })
})



// =============================================
//                  AUTH ROUTES
// =============================================

// show register form
app.get("/register", function(req, res){
   res.render("register.ejs");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/destinations");
        });
    });
});

// SHOW login form
app.get("/login", function(req, res){
   res.render("login.ejs");
});

// handling login logic
// Params: route, middleware, cbf
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/destinations",
        failureRedirect: "/login"
    }), function(req, res){
});


// Logout logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/destinations");
});

// isLoggedIn() is a middleware function that checked if user is logged in. If they are, render new.ejs. If not, redirect to /login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(port, () => console.log(`Yelp App server is listening on port ${port}`))

/*
If you run into the Cannot read property 'name' of null  error, it's because now that we have the seeds function in app.js,
 the destinations get deleted and recreated every time we start or restart the app.
This means that, although they look the same, each destination has a brand new id in the database.
If you want to avoid this error then you can either, comment out seedDB() in app.js
or just be sure to go back to the destination index page before going to any of the show pages.
*/
