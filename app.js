// Script to set up server in Express
const port          = 8080
var express         = require("express"),
    app             = express()





// ===============
// PUBLIC ROUTES
// ===============
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
// SHOW FORMS: to create new a project, event, and mentor
app.get("/projects/new", (req, res) =>{
  res.render("new_project.ejs")
})

app.get("/events/new", (req, res) =>{
  res.render("new_event.ejs")
})

app.get("/mentors/new", (req, res) => {
  res.render("new_mentor.ejs")
})

// CREATE: take input from users and



app.listen(port, () => console.log(`Seeds Server is listening on port ${port}`))
