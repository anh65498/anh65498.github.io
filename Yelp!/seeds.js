// run this to empty current database and "seed" database with some users

var mongoose = require("mongoose");
var Destination = require("./MongoDB_models/destination.js"),
    Comment   = require("./MongoDB_models/comment");


var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
  // Empty current YelpTravel_destinations database
  Destination.remove({}, (error) => {
    if (error)
      console.log("Error when clearing file in seeds.js: " + error)
    else {
      console.log("Database is cleared succesfully")
      // Remove all comment

      // Add some destinations to YelpTravel_destinations database from data list above
      for (var destination of data){
        Destination.create(destination, (error, retDest) => {
            if (error) console.log(error)
            else{
              console.log("Added a Destination.")
              // Create a comment
              Comment.create({
                content: "This place is great, but I wish there was Internet.",
                author: "Arthur"
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
