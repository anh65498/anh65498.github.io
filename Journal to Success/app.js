const port        = 5000
var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),     // to parse client's form to JS object
    mongoose      = require("mongoose"),         // for database
    methodOverride = require("method-override"), // interchange Update <-> Post to protect user data and abid to REST
    expressSanitizer     = require("express-sanitizer")   // santizer user's input in form to prevent data corruption


// tell Express to look inside "public" directory for CSS files
app.use(express.static("public"))
// tell Express to use body parser to parse client's request's information (like form's input)
app.use(bodyParser.urlencoded({extended:true}));
// tell Express to use method-override to
app.use(methodOverride("_method"))
// Mount express-sanitizer middleware here
app.use(expressSanitizer());
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
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// Journal.create({
//   title: "Test",
//   todosToday: "Study Udemy",    // 3-5 items so you dont feel overwhelm
//   learn: "mongoose, REST",
// })

// RESTful Routes
// Landing page
app.get("/", (req, res) => {
  res.redirect("/journals")
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

app.get("/journals/benefits", (req, res) => {
  res.render("benefits.ejs")
})

// New Route: show new journal form
app.get("/journals/new", (req, res) => {
  res.render("new.ejs")
})

// Create Route: Add new journal to database then redirect to homepage
// is activated when user click "submit" in form
app.post("/journals", (req, res) => {
  // create new journal in database
  req.body.journal.note = req.sanitize(req.body.journal.note);    // remove any HTML <script> from user's input in journal[note]
  newJournal = req.body.journal
  Journal.create(newJournal, (error, retData) => {
    if (error)
      res.render("new.ejs")
    else
      res.redirect("/journals")
  })
})

// Show Route: Show info about one specific journal
app.get("/journals/:id", (req, res) => {
  Journal.findById(req.params.id, (error, foundResult) => {
    if (error)
      res.redirect("/journals")
    else
      res.render("show.ejs", {journal: foundResult})
  })
})

// Edit Route: Show form to edit info about one specific journal
app.get("/journals/:id/edit", (req, res) =>{
  Journal.findById(req.params.id, (error, foundResult) => {
    if (error)
      res.redirect("/journals")
    else
      res.render("edit.ejs", { journal : foundResult})
  })
})

// Update Route: When user click "submit" button in Edit page, this route is activated
// install method-override because with PUT method, add user's data is shown in URL.
// Use method-override package to convert POST method from the form to PUT to hide user's data
app.put("/journals/:id", (req, res) =>{
  req.body.journal.note = req.sanitize(req.body.journal.note);    // remove any HTML <script> from user's input in journal[note]
  Journal.findByIdAndUpdate(req.params.id, req.body.journal, (error, updatedJournal) =>{
    // params: id, newData from URL (masked by POST method in form but actually it shows in PUT method), callback function
    if (error)
      res.redirect("/journals")
    else
      res.redirect("/journals/" + req.params.id)
  })
})

// DELETE route: delete a journal
app.delete("/journals/:id", (req, res) =>{
  // destroy the journal
  Journal.findByIdAndRemove(req.params.id, (error) =>{
    if (error){
      console.log("Error deleting post: " + error)
      res.redirect("/journals")
    }
    else
      res.redirect("/journals")
  })

})
app.listen(port, () => console.log(`Journal App server is listening on port ${port}`))
