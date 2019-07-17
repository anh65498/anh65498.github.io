const port        = 5000
var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose")

// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// create Db inside mongoDB or use existing Db
mongoose.connect("mongodb://localhost/Journal_to_Success", { useNewUrlParser: true })
// DB Schema setup - define data types of DB
var journalSchema = new mongoose.Schema({
  dateCreated: {type: Date, default: Date.now},
  completedTasks: String,    // 3-5 items so you dont feel overwhelm
  event: String,
  note: String,
  learn: String,
  emotion: String,
  celebration: String,  //  write down the 3 major wins of the day, every single day.
  goalTomorrow: String,   // self, work, relationship,
  habit: String,
  habitStreak: Number,
})
var Journal = mongoose.model("Journal", journalSchema)  // create a new collection called journals in Journal_to_Success database

// Journal.create({
//   title: "Test",
//   todosToday: "Study Udemy",    // 3-5 items so you dont feel overwhelm
//   learn: "mongoose, REST",
// })

// RESTful Routes
// Landing page
app.get("/", (req, res) => {
  res.render("landing-page.ejs")
})

// Index Route
app.get("/journals", (req, res) => {
  Journal.find({}, (error, retJournals) =>{   // return journals from Db
    if (error)
      console.log("Error opening the index page: " + error)
    else
      res.render("index.ejs", {journals : retJournals})
  })
})

// New Route: show new journal form
app.get("/journals/new", (req, res) => {
  res.render("new.ejs")
})

// Create Route: Add new journal to database then redirect to homepage
// is activated when user click "submit" in form
app.post("/journals", (req, res) => {
  // create new journal
  newJournal = req.body.journal
  Journal.create(newJournal, (error, retData) => {
    if (error)
      res.render("new.ejs")
    else
      res.redirect("/journals")
  })
})

app.listen(port, () => console.log(`Journal App server is listening on port ${port}`))
