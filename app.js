// Script to set up server in Express
const port          = 8080
var express         = require("express"),
    app             = express()



// LANDING PAGE  - Done (show )
app.get("/", (req, res) => {
  res.render("landing.ejs")
})


app.listen(port, () => console.log(`Seeds Server is listening on port ${port}`))
