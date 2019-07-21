// run this to empty current database and "seed" database with some users

var mongoose = require("mongoose");
var Mentor = require("./MongoDB_models/mentor.js"),
    Event   = require("./MongoDB_models/event.js"),
    Project   = require("./MongoDB_models/project.js");

var mentorData = [
  {
    // "_id" : ObjectId("5d32b4d0fd13e359f9d0c594"),
    "name" : "Gwen",
    "skills" : "Business Strategy & Planning, Product Management",
    "experience" : "Product Manager",
    "projects" : "Business strategy planning meeting, improve the features on current projects",
    "company" : "Twilio",
    "cover_img" : "./photos/gwen.jpg"
  },
  {
    // "_id" : ObjectId("5d32b46cfd13e359f9d0c590"),
    "name" : "Grace",
    "skills" : "Java, Python, HTML, CSS",
    "experience" : "Software Engineer",
    "projects" : "Various projects in full-stack, front-end, and back-end",
    "company" : "Venmo",
    "cover_img" : "./photos/grace.jpg"
  },
  {
    // "_id" : ObjectId("5d32b4a2fd13e359f9d0c592"),
    "name" : "Lucy",
    "skills" : "Data Mining, Machine Learning",
    "experience" : "Applied Data Scientist",
    "projects" : "Research projects in deep learning and computer vision",
    "company" : "Amazon",
    "cover_img" : "./photos/lucy.jpg"
  },
  {
    // "_id" : ObjectId("5d32b4e7fd13e359f9d0c595"),
    "name" : "Vivian",
    "skills" : "React, Angular",
    "experience" : "Software Engineer",
    "projects" : "Large scale web applications",
    "company" : "HERE",
    "cover_img" : "./photos/vivian.jpg"
  }
]

var eventData = [
  {
    // "_id" : ObjectId("5d32b4d0fd13e359f9d0c594"),
    "name" : "Spectra Hackathon",
    "date" : "2019-07-20",
    "time" : "08:30:00",
    "location" : "Make School, 555 Post St, San Francisco, CA 94102"
  },
  {
    // "_id" : ObjectId("5d32b46cfd13e359f9d0c590"),
    "name" : "Twilio Customer & Developer Conference",
    "date" : "2019-08-06",
    "time" : "09:00:00",
    "location" : "Moscone West, 800 Howard Street, San Francisco, CA 94107"
  },
  {
    // "_id" : ObjectId("5d32b4a2fd13e359f9d0c592"),
    "name" : "GopherCon",
    "date" : "2019-07-24",
    "time" : "07:30:00",
    "location" : "Marriott Marquis San Diego Marina, California"
  },
  {
    // "_id" : ObjectId("5d32b4e7fd13e359f9d0c595"),
    "name" : "Now at Work global event series",
    "date" : "2019-10-08",
    "time" : "08:00:00",
    "location" : "Beanfield Centre, Toronto, Canada"
  }
]

var projectData = [
  {
    // "_id" : ObjectId("5d32b4d0fd13e359f9d0c594"),
    "name" : "Data Analysis and Machine Learning Projects",
    "description" : "Collection of teaching materials, code, and data for my data analysis and machine learning projects.",
    "tools" : "Python, Jupyter Notebook",
    "cover-img" : "./photos/ml.jpg",
    "author" : "Jenny"
  },
  {
    // "_id" : ObjectId("5d32b46cfd13e359f9d0c590"),
    "name" : "React Projects",
    "description" : "Web applications and websites designed with React",
    "tools" : "React",
    "cover-img" : "./photos/react.jpg",
    "author" : "Nicole"
  },
  {
    // "_id" : ObjectId("5d32b4a2fd13e359f9d0c592"),
    "name" : "AI Projects",
    "description" : "Artificial Intelligence projects, documentation and code",
    "tools" : "Python",
    "cover-img" : "./photos/ai.jpg",
    "author" : "Will"
  },
  {
    // "_id" : ObjectId("5d32b4e7fd13e359f9d0c595"),
    "name" : "iOS Projects",
    "description" : "Class projects about iOS development and interface design",
    "tools" : "Swift",
    "cover-img" : "./photos/swift.jpg",
    "author" : "Annie"
  }
]

function seedDB(){
  // Empty current database
  Mentor.deleteMany({}, (error) => {
    if (error)
      console.log("Error when clearing file in seeds.js: " + error)
    else {
      console.log("Database is cleared succesfully")
      // Add some destinations to database from data list above
      for (var mentor of mentorData){
        Mentor.create(mentor, (error, retDest) => {
            if (error) console.log(error)
            else{
              console.log("Added a Mentor.")
            }
          })
        }
    }
  })

    Event.deleteMany({}, (error) => {
        if (error)
          console.log("Error when clearing file in seeds.js: " + error)
        else {
          console.log("Database is cleared succesfully")
          // Add some destinations to database from data list above
          for (var e of eventData){
            Event.create(e, (error, retDest) => {
                if (error) console.log(error)
                else{
                  console.log("Added an Event.")
                }
              })
            }
        }
      })

Project.deleteMany({}, (error) => {
    if (error)
      console.log("Error when clearing file in seeds.js: " + error)
    else {
      console.log("Database is cleared succesfully")
      // Add some destinations to database from data list above
      for (var project of projectData){
        Mentor.create(project, (error, retDest) => {
            if (error) console.log(error)
            else{
              console.log("Added a Project.")
              // console.log(project)
            }
          })
        }
    }
  })

}
module.exports = seedDB;  // return this function to whatever variable calls require("seeds.js")
