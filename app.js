// Script to set up server in Express
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),         // for database

    // DB Schema setup - define data types of DB
    Mentor          = require("./MongoDB_models/mentor.js"),
    Event           = require("./MongoDB_models/event.js"),
    Project         = require("./MongoDB_models/project.js")
    seedDB        = require("./seeds.js")

// create Db inside mongoDB or use existing Db
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Seeds_Women_Networking", { useNewUrlParser: true })
// tell Express to look inside "public" directory for CSS files
// app.use(express.static("public"))          // mine
app.use(express.static(__dirname + '/public')); // Rachel
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// clear Db and populate it with fake destinations. If uncomment, Might run into error "Cannot read property 'name' of null  error" then see at the end.
seedDB()


// ==========================================
// PUBLIC ROUTES
// ==========================================
// Landing page - Welcoming page (Done)
app.get("/", (req, res) => {
  res.render("landing.ejs")
})

// Event page - Show a list of events from MongoDB
app.get("/events", (req, res) => {
  Event.find({}, (error, results) => {
    if (error)
      console.log("Error when retrieving events from database: " + error)
    else
      res.render("events.ejs", {events : results})
  })
})

// Mentor page - Show mentors (Hall of Fame)
app.get("/mentors", (req, res) => {
    Mentor.find({}, (error, results) => {
    if (error)
      console.log("Error when retrieving projects from database: " + error)
    else
      res.render("mentors.ejs", {mentors : results})
  })
})

// Project page - Show projects
app.get("/projects", (req, res) => {
  Project.find({}, (error, results) => {
    if (error)
      console.log("Error when retrieving projects from database: " + error)
    else{
      res.render("projects.ejs", {projects : results})
    }
  })
})





// ==========================================
// USER ROUTES (only user can access these)
// ==========================================
// SHOW FORMS: to create a new project, event, and mentor
app.get("/projects/new", (req, res) =>{
  res.render("new_project.ejs")
})

app.get("/events/new", (req, res) =>{
  res.render("new_event.ejs")
})

app.get("/mentors/new", (req, res) => {
  res.render("new_mentor.ejs")
})


// CREATE: take input from FORMS and inject them to database
app.post("/mentors", (req, res) =>{
  // console.log(req);
  var newMentor = {
            name: req.body.mentor.name,
            skills: req.body.mentor.skills,
            experience: req.body.mentor.experience,
            company: req.body.mentor.company,
            projects: req.body.mentor.projects,
            cover_img: req.body.mentor.cover_img,
            // author: {
            //   id: req.user._id,
            //   username: req.user.username
            // }
          }
    // console.log(newMentor)
    // create a new mentor in "mentors" collection of MongoDB
    Mentor.create(newMentor, (error, newlyCreated) => {
      if (error)
        console.log("Error when updating mentor's database: " + error)
      else{
        // redirect back to FORM page of 'get' request
        // console.log(newMentor)
        res.redirect("/mentors")
      }
    })
} )

app.post("/events", (req, res) =>{
  // console.log(req);
  var newEvent = {
            name: req.body.event.name,
            date: req.body.event.date,
            time: req.body.event.time,
            location: req.body.event.location,
            description: req.body.event.description,
            // author: {
            //   id: req.user._id,
            //   username: req.user.username
            // }
          }
    // console.log(newMentor)
    // create a new event in "events" collection of MongoDB
    Event.create(newEvent, (error, newlyCreated) => {
      if (error)
        console.log("Error when updating event's database: " + error)
      else{
        // redirect back to FORM page of 'get' request
        // console.log(newMentor)
        res.redirect("/events")
      }
    })
} )

app.post("/projects", (req, res) =>{
  // console.log(req);
  var newProject = {
            name: req.body.project.name,
            description: req.body.project.description,
            cover_img: req.body.project.cover_img,
            author: req.body.project.author,
            tools: req.body.project.tools,
            // author: {
            //   id: req.user._id,
            //   username: req.user.username
            // }
          }
    // console.log(newMentor)
    // create a new mentor in "mentors" collection of MongoDB
    Project.create(newProject, (error, newlyCreated) => {
      if (error)
        console.log("Error when updating project's database: " + error)
      else{
        // redirect back to FORM page of 'get' request
        // console.log(newMentor)
        res.redirect("/projects")
      }
    })
} )

// For localhost
// const port          = 3000
// app.listen(port, () => console.log(`Seeds Server is listening on port ${port}`))

// For heroku
const port = process.env.PORT || 3000;
app.listen(port);
