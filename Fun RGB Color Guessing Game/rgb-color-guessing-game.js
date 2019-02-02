//JS FOR SIDE NAVBAR
//Credit: https://bootsnipp.com/snippets/featured/fancy-sidebar-navigation
$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

    function hamburger_cross() {

      if (isClosed == true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        //overlay.show();   //create a foggy mask on the page
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }

  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
});


//MECHANISM FOR GAME
//Easy mode has 3 squares of colors, hard mode has 6 squares of colors
var numSquares = 6
var maxNumberOfColors = 6 //to hide colors in easy mode
var minNumberOfColors = 3
var colors = []
var targetColor;
var rgbDisplay = document.getElementById("rgb-display")
var hintButton = document.getElementsByClassName("hint")
var tryAgainDisplay = document.getElementById("try-again-display")
var jumbotronDisplay = document.querySelector(".jumbotron")
var resetButton = document.getElementById("resetButton")
var modeButtons = document.querySelectorAll(".mode"); //easy and hard mode
var squares = document.querySelectorAll(".square")
var game = {}

game.newGame = function(){
  resetGame()
  setupModeButton();
  //setupHintButton();
  setupSquaresInteraction();
  //if user click reset button, generate new colors
  resetButton.addEventListener("click", function() {
    resetGame()
  })
}

game.newGame();

///////// Codes that were refactored
// //if user click Easy Button, only show 3 colors
// easyBtn.addEventListener("click", function() {
//   numSquares = 3
//   easyBtn.classList.add("selected")
//   hardBtn.classList.remove("selected")
//   //turn the last 3 colors' background to black
//   for (var i = numSquares; i < maxNumberOfColors; i++){
//     squares[i].style.display = "none";  //hide element without deleting
//   }
//   //change from 6 to 3 new colors
//   newGame()
// })
//
// hardBtn.addEventListener("click", function() {
//   numSquares = 6
//   hardBtn.classList.add("selected")
//   easyBtn.classList.remove("selected")
//   for (var i = minNumberOfColors; i < maxNumberOfColors; i++){
//     squares[i].style.display = "block";  //hide element without deleting
//   }
//   newGame()
// })



//setupModeButton()
//Purpose: setup CSS for mode buttons and reset the game when mode is changed
function setupModeButton() {
  for (var i = 0; i < modeButtons.length; i++) {
    //add event listeners to mode (easy, hard) buttons
    modeButtons[i].addEventListener("click", function() {
      //turn off selected class for all buttons
      for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].classList.remove("selected")
      }
      //turn on selected class on the click button
      this.classList.add("selected") //"this" refers to what we click on

      //change the number of square according to the mode button selected
      this.textContent.toLowerCase() === "easy" ? numSquares = 3 : numSquares = 6
      resetGame()
    })
  }
}

  //resetGame()
  //Purpose: set up a new game by figuring out how many squares to show, pick new colors, pick a new correct color, update page
  //Parameter: number of squares of randomized color on the screen
  function resetGame() {
    //generate random RGB colors
    colors = randomizeColors(numSquares);
    //pick a target color for the guessing
    targetColor = colors[Math.floor(Math.random() * colors.length)] //randomize number 0-255   //the correct color for the random RGB
    //change the rgb-display banner and reset button to match the new target color
    rgbDisplay.textContent = targetColor;
    resetButton.textContent = "New Game"
    tryAgainDisplay.textContent = ""
    jumbotronDisplay.style.background = "steelblue"

    for (var i = 0; i < squares.length; i++) {
      //display the correct number of squares depending on mode
      if (colors[i]) {
        squares[i].style.display = "block"
        squares[i].style.background = colors[i]
      } else {
        squares[i].style.display = "none"
      }

      console.log(squares[i])
    }
  }

  //randomizeColors(number):
  //Purpose: generate an array of number color
  function randomizeColors(number) {
    console.clear()
    var colors = []
    for (var i = 0; i < number; i++) {
      var r = Math.floor(Math.random() * 255 + 1)
      var b = Math.floor(Math.random() * 255 + 1)
      var g = Math.floor(Math.random() * 255 + 1)
      colors[i] = "rgb(" + r + ", " + b + ", " + g + ")"
      console.log(colors[i])
    }
    return colors
  }

  //setupSquaresInteraction()
  //Purpose: setup the events when each squares is clicked
  function setupSquaresInteraction() {
    for (var i = 0; i < squares.length; i++) {
      //add click listeners to each square
      squares[i].addEventListener("click", function() {
        //if the color of the square is correct
        if (this.style.backgroundColor == targetColor) {
          tryAgainDisplay.textContent = "Correct!"
          //change all the square to the correct color
          for (var i = 0; i < squares.length; i++) {
            squares[i].style.backgroundColor = targetColor;
          }
          jumbotronDisplay.style.backgroundColor = targetColor;
          resetButton.textContent = "Play Again?"
        }
        //if chosen wrong square is wrong, fade its background color to body's background colo
        else {
          this.style.backgroundColor = "black";
          tryAgainDisplay.textContent = "Try Again!"
        }
      })
    }
  }
