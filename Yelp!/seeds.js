// run this to empty current database and "seed" database with some users

var mongoose = require("mongoose");
var Destination = require("./MongoDB_models/destination.js"),
    Comment   = require("./MongoDB_models/comment");


var data = [
  {
    // "_id" : ObjectId("5d32b4d0fd13e359f9d0c594"),
    "comments" : [ ],
    "name" : "Emerald's Bay",
    "state" : "Nevada", "country" : "United States of America",
    "image" : "./photos/emerald_bay.jpg",
    "description" : "Sparkling ocean water",
    "author":
        {
          "id" : ("5d32b4b2fd13e359f9d0c593"),
          "username": "zach"
        },
    "__v" : 0
  },
  {
    // "_id" : ObjectId("5d32b46cfd13e359f9d0c590"),
    "comments" : [ ],
    "name" : "Disneyland",
    "state" : "California", "country" : "United States of America",
    "image" : "./photos/disneyland.jpg",
    "description" : "Happiest place on Earth. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiu smod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute iruredolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    "author" : {
      "id" : ("5d32b454fd13e359f9d0c58f"),
      "username" : "neel"
    },
    "__v" : 0
  },
  {
    // "_id" : ObjectId("5d32b4a2fd13e359f9d0c592"),
    "comments" : [ ],
    "name" : "Santa Monica", "state" : "California",
    "country" : "United States of America",
    "image" : "./photos/santa_monica.jpg",
    "description" : "Hottest beach in LA. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    "author" : {
          "id" : ("5d32b48bfd13e359f9d0c591"),
          "username" : "anh"
        },
    "__v" : 0
  },
  {
    // "_id" : ObjectId("5d32b4e7fd13e359f9d0c595"),
    "comments" :[ ],
    "name" : "Cloud's Rest",
    "state" : "None",
    "country" :"United States of America",
    "image" : "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    "description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duisaute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    "author" :
      { "id" : ("5d32b4b2fd13e359f9d0c593"),
        "username" : "zach"
      },
    "__v" : 0
  }
]

function seedDB(){
  // Empty current YelpTravel_destinations database
  Destination.deleteMany({}, (error) => {
    if (error)
      console.log("Error when clearing file in seeds.js: " + error)
    else {
      console.log("Database is cleared succesfully")
      // Add some destinations to YelpTravel_destinations database from data list above
      for (var destination of data){
        Destination.create(destination, (error, retDest) => {
            if (error) console.log(error)
            else{
              console.log("Added a Destination.")
              // Create a comment
              Comment.create({
                content: "This place is great, but I wish there was Internet.",
                author: {
                  id: "5d32b4b2fd13e359f9d0c593",
                  username: "zach"
                }
              }, (error, retComment)=>{
                if (error) console.log("Error creating new comment in seeds.js: " + error)
                else {
                  retDest.comments.push(retComment)
                  retDest.save()
                  console.log("Create 1 new comment!")
                }
              })
            }
          })
        }
    }
  })




  // Comment.remove({}, function(err) {
  //     if(err){
  //         console.log(err);
  //     }
  //     console.log("removed comments!");
  //      //add a few campgrounds
  //     data.forEach(function(seed){
  //         Campground.create(seed, function(err, campground){
  //             if(err){
  //                 console.log(err)
  //             } else {
  //                 console.log("added a campground");
  //                 //create a comment
  //                 Comment.create(
  //                     {
  //                         text: "This place is great, but I wish there was internet",
  //                         author: "Homer"
  //                     }, function(err, comment){
  //                         if(err){
  //                             console.log(err);
  //                         } else {
  //                             campground.comments.push(comment);
  //                             campground.save();
  //                             console.log("Created new comment");
  //                         }
  //                     });
  //                   }
  //               });
  //           });
  //       });
  //   });
    //add a few comments
}

module.exports = seedDB;  // return this function to whatever variable calls require("seeds.js")
