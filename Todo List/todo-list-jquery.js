// Purpose: check off/uncheck specific task by clicking on the task
// The code below doesn't work if we add new tasks, because we can only add evenListener to elements that already exist and the newTask doesn't
// $(".todos li").on("click", function() {
//     $(this).toggleClass("completed");
// })
// Use this instead. ul always exists
$("ul").on("click", "li", function() {
  $(this).toggleClass("completed");
})

//when user click on trashcan, delete the task
$("ul").on("click", ".fa-trash-alt", function(event) {
  //fadeout the task before removing it completely from todo list
  $(this).parent().parent().fadeOut(500, function() {
    $(this).remove(); //this == this.parent().parent() from the line above
  });
  //$(".fa-trash-alt").parent().parent().remove();  //remove all tasks in 1 click

  // Since span trashcan is inside ul inside div inside body, click on it wil trigger all the elements above.
  // Hence, toggle the completed class of <li>
  // To prevent that, add parameter "event" and use stopPropagation()
  event.stopPropagation();
});

// When user enter in the <input> box, grab those input and create a new task in todo list
$("input[type='text']").keypress(function(event) {
  //when user hit "Enter" - keycode is 13
  if (event.which === 13) {
    // extract the input value
    var newTaskText = $(this).val();
    if (newTaskText !== "") {
      //if the todos only contains 1 empty task, overwrite it
      if ($(".todos").html() === "<li></li>") {
        alert("hi")
        $("this").text("<li>" + newTaskText + "<span><i class='fas fa-trash-alt'></i></span></li>");
      } else {
        // create a new <li> and add to <ul>
        $("#todo ul").append("<li>" + newTaskText + "<span><i class='fas fa-trash-alt'></i></span></li>");
        // clear the input field
        $(this).val("");
      }
    }
  }
})

//if user press "Clear" button, clear all the tasks
$(".clear").on("click", function() {
  //remove all the current task
  $(".todos li").remove();
  //add an empty task
  $(".todos ul").append("<li></li>");

})

//if user click on the pencil icon, hide/unhide the input
$(".fa-pencil-alt").on("click", function(){
  $("input[type='text']").fadeToggle("slow", "swing");
})
// jQuery method: On() vs Click()
// They behave the same, but
// click()only add listeners for existing elements
// on() add listeners to existing and potential future elements
