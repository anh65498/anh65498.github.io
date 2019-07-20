// Script to set up server in Express
const port          = 8080
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),         // for database
    // DB Schema setup - define data types of DB
    Mentor          = require("./MongoDB_models/mentor.js")

// create Db inside mongoDB or use existing Db
mongoose.connect("mongodb://localhost/Seeds_Women_Networking", { useNewUrlParser: true })
// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// clear Db and populate it with fake destinations. If uncomment, Might run into error "Cannot read property 'name' of null  error" then see at the end.
// seedDB()


// ==========================================
// PUBLIC ROUTES
// ==========================================
// Landing page - Welcoming page (Done)
app.get("/", (req, res) => {
  res.render("landing.ejs")
})

// Event page - Show a list of events
app.get("/events", (req, res) => {
  res.render("events.ejs")
})

// Mentor page - Show mentors (Hall of Fame)
app.get("/mentors", (req, res) => {
  res.render ("mentors.ejs")
})

// Project page - Show projects
app.get("/projects", (req, res) => {
  res.render("projects.ejs")
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


app.listen(port, () => console.log(`Seeds Server is listening on port ${port}`))
