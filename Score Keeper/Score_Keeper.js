var p1Button = document.querySelector("button")
var p2Button = document.querySelectorAll("button")[1]
var resetButton = document.getElementById("resetButton")
var p1Score = 0;		//keep the score of player 1
var p2Score = 0;	  //keep the score of player 1
var maxScore = 5;
var p1ScoreDisplay = document.getElementById("p1ScoreDisplay")
var p2ScoreDisplay = document.getElementById("p2ScoreDisplay")
var maxScoreDisplay = document.getElementById("maxScoreDisplay")
var resetButton = document.querySelectorAll("button")[2]
var scoreboard = document.getElementById("scoreboard")
var gameOver = false


p1Button.addEventListener("click", function(){
  if(!gameOver){
     p1Score++
     p1ScoreDisplay.textContent = p1Score.toString()
     if (p1Score == maxScore){
       p1ScoreDisplay.classList.add("winner-Score")
       displayWinner("Player 1")
       gameOver = true;
     }
   }})

p2Button.addEventListener("click", function(){
  if(!gameOver){
     p2Score++
     p2ScoreDisplay.textContent = p2Score.toString();
     if (p2Score == maxScore){
       gameOver = true;
       p2ScoreDisplay.classList.add("winner-Score")
       displayWinner("Player 2")
     }
}})

//gameOver()
//take care of game over when resest button is clicked
//set both players' scores to 0, scoreboard, remove green class, set gameover is false
resetButton.addEventListener("click", function(){
  reset();
})

function reset(){
 scoreboard.innerHTML = "<span id='p1ScoreDisplay'>0</span> to <span id='p2ScoreDisplay'>0</span>"
 p1Score = 0;		//keep the score of player 1
 p2Score = 0;	  //keep the score of player 1
 gameOver = false;

 //if we use innerHTML, we gotta set p1ScoreDisplay and p2ScoreDisplay JS objects again
 //because the old objects are null/replaced now
 p1ScoreDisplay = document.getElementById("p1ScoreDisplay")
 p2ScoreDisplay = document.getElementById("p2ScoreDisplay")
}

  function displayWinner(winner){
    var winnerAnnounce = document.getElementById("displayWinner")
    winnerAnnounce.textContent = winner + " wins!"
    winnerAnnounce.classList.add("winner")
  }

//change max score to win via <input>
document.querySelector("input").addEventListener("change", function(){	//change: when there's a change (click, enter)
 var x = document.getElementById("maxNumber").value;
 maxScoreDisplay = document.getElementById("maxScoreDisplay")
 maxScoreDisplay.textContent = parseInt(x, 10);
 maxScore = x

})
