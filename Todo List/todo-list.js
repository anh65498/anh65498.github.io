var ulElements = document.getElementsByClassName("todos");
var input = document.querySelector("#newTask");
var container = document.querySelector("div");
var lists = document.querySelectorAll("li");
var spans = document.getElementsByTagName("span");
var pencil = document.querySelector("#pencil");
var saveBtn = document.querySelector(".save");
var clearBtn = document.querySelector(".clear");
var tipsBtn = document.querySelector(".tipBtn");
var closeBtn = document.querySelector(".closeBtn");
var overlay = document.getElementById("overlay")

//When user enter a new task
// input.addEventListener("keypress", function(keyPressed){
//   if(keyPressed.which === 13){
//     //create list and span when Enter is pressed
//     var li = document.createElement("li");    //task
//     var span = document.createElement("span"); //span for trashcan
//     var icon = document.createElement("i");   //trashcan
//
//     var newTask = this.value;     //whatever the user type in
//     // this.value = " ";
//     icon.classList.add('fas', 'fa-trash-alt');  //add two classes to <i>
//     span.append(icon);
//     ul.appendChild(li).append(span,newTask);
//
//     crossOutTaskListener();
//   }
// });

//if the user click on a trashcan icon, it's deleted
function crossOutTaskListener(){
  for (let span of spans){
    span.addEventListener("click", function(){
      span.parentElement.remove();
      event.stopPropagation();
    });
  }
}

// event listener to linethrough list if clicked
ulElements.addEventListener("click", function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  },false
);


//save todolist state so user can access it later
saveBtn.addEventListener('click',function(){
  localStorage.setItem('todoList',ul.innerHTML );

});

//clear all todo when clear button is clicked
clearBtn.addEventListener('click', function(){
  ul.innerHTML= "";
  localStorage.removeItem('todoList',ul.innerHTML );
});

//display overlay when tips btn is clicked
tipsBtn.addEventListener("click",function(){
   overlay.style.height = "100%";
});

//close overlay when close btn is clicked
closeBtn.addEventListener("click",function(e){
  e.preventDefault;
  overlay.style.height = "0";

})

//delete todo
deleteTodo();

//load Todo
loadTodo();
