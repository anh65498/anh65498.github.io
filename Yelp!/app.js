/* Main backend for our Yelp app */
const port = 5000
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),    // for Express's post method
  methodOverride = require("method-override"), // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  // DB Schema setup - define data types of DB
  Destination = require("./MongoDB_models/destination.js"),
  Comment = require("./MongoDB_models/comment.js"),
  User = require("./MongoDB_models/user.js"),
  seedDB = require("./seeds.js")    // clear all database and populate it with users. this file is at the same folder as app.js

// create Db inside mongoDB or use existing Db
// mongoose.connect("mongodb://localhost/YelpTravel_destinations", { useNewUrlParser: true })   // old code
mongoose.connect("mongodb+srv://anh65498:horny5(Waugh@cluster-5h8vr1w3.s3q75.mongodb.net/heroku_5h8vr1w3?retryWrites=true&w=majority", { useNewUrlParser: true }) // new code to migrate to Cloud Atlas
mongoose.set('useFindAndModify', false);    // fix deprecation
// tell Express to look inside "public" directory for CSS files
app.use(express.static(__dirname + "/public"))    // __dirname is the directory app.css is located
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
// clear Db and populate it with fake destinations. If uncomment, Might run into error "Cannot read property 'name' of null  error" then see at the end.
seedDB()


// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "I am super competitive in beer pong!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());           // reading the session, encode and decode data from session (method of passportLocalMongoose)
passport.deserializeUser(User.deserializeUser());       // reading the session, encode and decode data from session (method of passportLocalMongoose)
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;      // whatever variable comes after res.locals will be available inside ejs file in the all routes.
  next()                                  // Next is the code block that in the routes
})  // whatever function is in use() will be called on every route, because every route has navbar and we want to show username on it when user logs in



// HOMEPAGE
app.get("/", (req, res) => {
  res.render("landing.ejs")
})

// INDEX Route: Get all campgrounds from Db and display them
app.get("/destinations", (req, res) => {
  Destination.find({}, (error, retDestinations) => {
    if (error)
      console.log("Error when retrieving destinations from database: " + error)
    else
      res.render("destinations.ejs", { destinations: retDestinations })
  })
})

// NEW Route: Show Form to add new destination to database
// isLoggedIn() is a middleware function that checked if user is logged in. If they are, render new.ejs. If not, redirect to /login
app.get("/destinations/new", isLoggedIn, (req, res) => {
  res.render("new_destination.ejs")
})


// CREATE Route: Create new destination to Db from NEW form, same URL as 'get' method cuz RESTFUL
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
    if (error) console.log("Error when updating database: " + error)
    else {
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
  Destination.findById(req.params.id).populate("comments").exec((error, foundDestination) => {
    if (error)
      cosole.log("Error retrieving destination by ID from MongoDB. ")
    else
      res.render("show.ejs", { destination: foundDestination })    // render page with that destination
  })
})

// EDIT route: Show form to edit destination posts.
// Thanks to method-override, we can override this get method with
// Only allow user who create the destination post to see the form
app.get("/destinations/:id/edit", checkPostOwnership, (req, res) => {
  Destination.findById(req.params.id, (error, retDestination) => {
    res.render("destinations_edit.ejs", { destination: retDestination })
  })
})

// UPDATE route: Take the changes from edit form and update the destination post in database
app.put("/destinations/:id", checkPostOwnership, (req, res) => {
  // var updates = {
  //     name: req.body.destName,
  //     state: req.body.state,
  //     country: req.body.country,
  //     image: req.body.img_url,
  //     description: req.body.description,
  //     author: {
  //       id: req.user._id,
  //       username: req.user.username
  //     }
  // }
  // Instead of that, change the names in edit form. Example: from name="destName" to name="destination[name]"
  Destination.findByIdAndUpdate(req.params.id, req.body.destination, (error, updatedDest) => {
    if (error) res.redirect("/destinations")
    else {
      res.redirect("/destinations/" + req.params.id)
    }
  })
})

// DESTROY route: delete destination post (triggered by "Delete" button on show page)
app.delete("/destinations/:id", checkPostOwnership, (req, res) => {
  Destination.findByIdAndRemove(req.params.id, (error, destinationRemoved) => {
    if (error) res.redirect("/")
    else {
      Comment.deleteMany({ _id: { $in: destinationRemoved.comments } }, (error) => {
        if (error) console.log(error)
        else
          res.redirect("/destinations/")
      })

    }
  })
})


// =============================================
//             COMMENT ROUTES
// =============================================
// COMMENT NEW route: Show form to create a new comment attached to a destination post
app.get("/destinations/:id/comments/new", isLoggedIn, (req, res) => {
  // find destination by id from db to pass destination's data to the form
  Destination.findById(req.params.id, (error, retDestination) => {
    if (error) console.log("Error getting destination by ID in comment route: " + error)
    else
      res.render("comment_new.ejs", { destination: retDestination })
  })
})

// COMMENT CREATE route: Create a new comment then attach it to a destination post
// Need to be protected from people sending post request via POSTMAN by isLoggedIn()
app.post("/destinations/:id/comments", isLoggedIn, (req, res) => {
  // lookup destination using ID
  Destination.findById(req.params.id, (error, foundDestination) => {
    if (error) console.log("Error finding Destination in DB when creating new comment in DB")
    else {
      //create new comment
      Comment.create(req.body.comment, (error, newlyCreated) => {
        if (error) console.log("Error adding new comment to database")
        else {
          // console.log(newlyCreated)      // { _id: 5d3cca1a17b446055dbb215b, content: 'fdfs', __v: 0 }
          // console.log(req.user)   // { _id: 5d32b48bfd13e359f9d0c591, username: 'anh', __v: 0 }
          // add current user's username (req.user.username) and id to comment
          newlyCreated.author.id = req.user._id;    // Comment.author.id because of our Comment's schema
          newlyCreated.author.username = req.user.username;
          //save comment in DB
          newlyCreated.save();
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

// COMMENT EDIT route: Show edit form to edit comment
app.get("/destinations/:id/comments/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (error, foundComment) => {
    if (error) res.redirect("back")
    else {
      res.render("comment_edit.ejs", { destination_id: req.params.id, comment: foundComment })
    }
  })
})

// COMMENT UPDATE route: Take data from edit comment form and update comment in DB
app.put("/destinations/:id/comments/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
    if (error) res.redirect("back")
    else
      res.redirect("/destinations/" + req.params.id)
  })
})

// COMMENT DELETE: delete comment
app.delete("/destinations/:id/comments/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (error, deletedComment) => {
    if (error) res.redirect("back")
    else {
      // delete comment from Destination Db
      Destination.findByIdAndUpdate(req.params.id,
        {
          $pull: { comments: req.params.comment_id }      // https://docs.mongodb.com/manual/reference/operator/update/pull/#up._S_pull
        }, (error, retDestination) => {
          if (error) console.log(error)
          else
            res.redirect("/destinations/" + req.params.id)
        })
    }
  })
})

// =============================================
//                  AUTH ROUTES
// =============================================

// show register form
app.get("/register", function (req, res) {
  res.render("register.ejs");
});

//handle sign up logic
app.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register.ejs");
    }
    passport.authenticate("local")(req, res, function () {    // local is the  strategy
      res.redirect("/destinations");
    });
  });
});

// NEW Route: Show login form for user to log in
app.get("/login", function (req, res) {
  res.render("login.ejs");
});

// handling login logic
// Params: route, middleware, cbf
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/destinations",     // if user log in succesfully, redirect to /destinations
    failureRedirect: "/login"
  }), function (req, res) {
  });


// Logout logic route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/destinations");
});

// =============================================
//                  MIDDLEWARE
// =============================================

// isLoggedIn() is a middleware function that checks if user is logged in.
// If they are, continue with the code after it is called. If not, redirect to /login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// checkPostOwnership() is a middleware function that checks if user owns the post or not
// If he/she is, continue with the code after it is called. If not, redirect
function checkPostOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Destination.findById(req.params.id, (error, retDestination) => {
      if (error) return res.redirect("back")
      else {
        if (retDestination.author.id.equals(req.user._id))    // does user own campgrounds?
          next()
        else
          res.redirect("back")  // take user back to previous page they were on
      }
    })
  } else {
    res.redirect("/login");     // take user back to previous page they were on
  }
}

// checkCommentOwnership() is a middleware function that checks if user owns the comment or not
// If he/she is, continue with the code after it is called. If not, redirect
function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (error, retComment) => {
      if (error) return res.redirect("back")
      else {
        if (retComment.author.id.equals(req.user._id))    // does user own campgrounds?
          next()
        else
          res.redirect("back")  // take user back to previous page they were on
      }
    })
  } else {
    res.redirect("/login");     // take user back to previous page they were on
  }
}


app.listen(port, () => console.log(`Yelp App server is listening on port ${port}`))

/*
If you run into the Cannot read property 'name' of null  error, it's because now that we have the seeds function in app.js,
 the destinations get deleted and recreated every time we start or restart the app.
This means that, although they look the same, each destination has a brand new id in the database.
If you want to avoid this error then you can either, comment out seedDB() in app.js
or just be sure to go back to the destination index page before going to any of the show pages.
*/
