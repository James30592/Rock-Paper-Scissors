// Current player score.
var score = 0;

// PLayer and house choices.
var playerChoice = "";
var houseChoice = "";
var scoreChange = 0;


// Run the choices part once a choice is made.
$(".total-choice-button").on("click", function() {

  // Get player choice.
  if ($(this).hasClass("paper")) {
    playerChoice = "paper";
  } else if ($(this).hasClass("scissors")) {
    playerChoice = "scissors";
  }
  else if ($(this).hasClass("rock")) {
    playerChoice = "rock";
  }

  // Fully hide the choices area, also hide so can transition.
  $(".choices-area").addClass("hidden");
});


// Show the Chosen part once choices section is hidden.
$(".choices-area").on("transitionEnd webkitTransitionEnd", function(event) {
  // Only do this if Choices area is hidden now, don't want to catch the other way when it's unhidden as game is reset.
  if ($(".choices-area").hasClass("hidden") && (event.originalEvent.propertyName === "opacity")) {
    $(".choices-area").addClass("fully-hidden");

    // Set the player chosen icon and border to the choice.
    $(".player-chosen").addClass(playerChoice);
    $(".player-chosen-img").attr("src", "images/icon-" + playerChoice + ".svg");

    // Placeholder results area for mobile only.
    $(".results-container-mbl").removeClass("mbl-results-stage-start");
    $(".results-container-mbl").addClass("mbl-results-stage-mid");

    // Fully unhide the chosen area.
    $(".chosen-area").removeClass("fully-hidden");
    setTimeout(function() {$(".chosen-area").removeClass("hidden");}, 0);
  }
});


// Run the Chosen part once the Chosen area has transition to not hidden.
$(".chosen-area").on("transitionEnd webkitTransitionEnd", function(event) {
  // only do if its the parent chosen area, don't want to do this when the house-chosen image unhides.
  if ($(event.target).is(".chosen-area")) {
    // Only do this if Chosen area is unhidden now, don't want to catch the other way when it's hidden as game is reset.
    if (!$(".chosen-area").hasClass("hidden") && (event.originalEvent.propertyName === "opacity")) {
      // Get the house's choice.
      houseChoice = getHouseChoice();
      $(".house-chosen").addClass(houseChoice);
      var houseChosenTimer2 = "";

      // Wait 1s then show the house's choice.
      setTimeout(function() {
        $(".house-pre-chosen").addClass("fully-hidden");
        $(".house-chosen-img").attr("src", "images/icon-" + houseChoice + ".svg");
        $(".house-chosen").removeClass("fully-hidden");
        setTimeout(function () {$(".house-chosen").removeClass("hidden")}, 0);
      }, 1000);

      // Wait another 1s then show results.
      setTimeout(function() {
        // Get the result.
        scoreChange = getScoreChange(playerChoice, houseChoice);
        var resultWords = getResultWords(scoreChange);
        // Update the score.
        score = score + scoreChange;
        $(".score-val").text(score);
        $(".result-heading").text(resultWords);

        // Resize the play again button to be the same width as the results heading above.
        let resultHeadingDsktp = Math.max($(".result-heading-dsktp").width(), 100);
        $(".play-again-dsktp").width(resultHeadingDsktp);
        let resultHeadingMbl = Math.max($(".result-heading-mbl").width(), 100);
        $(".play-again-mbl").width(resultHeadingMbl);

        // Show the results area.
        // For mobile.
        $(".results-container-mbl").removeClass("mbl-results-stage-mid");
        $(".results-container-mbl").addClass("mbl-results-stage-end");
        // For desktop.
        $(".results-container-dsktp").removeClass("dsktp-results-stage-start");
        $(".results-container-dsktp").addClass("dsktp-results-stage-end");
        // Show the radial gradient win effect for winning player / house.
        $(".score" + scoreChange + "-grad").removeClass("fully-hidden")
        setTimeout(function () {$(".score" + scoreChange + "-grad").removeClass("hidden")}, 0);
      }, 2000);

    } else if (event.originalEvent.propertyName === "opacity") {
      // Otherwise, when hiding the Chosen area once the Play Again button is pressed.
      $(".chosen-area").addClass("fully-hidden");

      // Reset the player and house borders.
      $(".player-chosen").removeClass(playerChoice);
      $(".house-chosen").removeClass(houseChoice);

      // Remove the radial gradient win effect for winning player / house.
      $(".score" + scoreChange + "-grad").addClass("fully-hidden");
      $(".score" + scoreChange + "-grad").addClass("hidden");

      // Set the mobile results back to the start stage.
      $(".results-container-mbl").removeClass("mbl-results-stage-end");
      $(".results-container-mbl").addClass("mbl-results-stage-start");
      // Set the desktop results back to the start stage.
      $(".results-container-dsktp").removeClass("dsktp-results-stage-end");
      $(".results-container-dsktp").addClass("dsktp-results-stage-start");

      // Unhide the house pre-chosen image.
      $(".house-pre-chosen").removeClass("fully-hidden");
      // Hide the chosen house image.
      $(".house-chosen").addClass("fully-hidden");
      $(".house-chosen").addClass("hidden");

      // Show the choices area.
      $(".choices-area").removeClass("fully-hidden");
      setTimeout(function() {$(".choices-area").removeClass("hidden");}, 0);
    }
  }
});


// Reset the game area when Play Again button is clicked.
$(".play-again-btn").on("click", function() {

  // Hide the chosen area.
  setTimeout(function() {$(".chosen-area").addClass("hidden");}, 0);

});


// Returns random house choice; rock paper or scissors.
function getHouseChoice() {
  // Random number of 0, 1 or 2.
  var randChoiceNum = Math.floor(Math.random() * 3)
  var randChoice = "";
  switch (randChoiceNum) {
    case 0:
      randChoice = "paper";
      break;
    case 1:
      randChoice = "scissors";
      break;
    case 2:
      randChoice = "rock";
      break;
  }
  return randChoice;
}


// Returns -1, 0 or 1 for the players score change dependent on player and house choices.
function getScoreChange(player, house) {
  var scoreDiff = 0;

  // Update scoreDiff depending on player and house choices.
  switch (player) {
    case "paper":
      if (house === "paper") {
        scoreDiff = 0;
      } else if (house === "scissors") {
        scoreDiff = -1;
      } else {
        scoreDiff = 1;
      }
      break;
    case "scissors":
      if (house === "paper") {
        scoreDiff = 1;
      } else if (house === "scissors") {
        scoreDiff = 0;
      } else {
        scoreDiff = -1;
      }
      break;
    case "rock":
      if (house === "paper") {
        scoreDiff = -1;
      } else if (house === "scissors") {
        scoreDiff = 1;
      } else {
        scoreDiff = 0;
      }
      break;
  }
  return scoreDiff;
}


// Get the score word from the score change number.
function getResultWords(scoreChange) {
  switch (scoreChange) {
    case -1:
      return "YOU LOSE";
    case 0:
      return "DRAW";
    case 1:
      return "YOU WIN";
  }
}

// Show / hide the Rules modal on Rules / Rules Close button clicks.
$(".rules-btn").on("click", function() {
  $(".rules-modal").removeClass("hidden");
});

$(".close-rules-btn").on("click", function() {
  $(".rules-modal").addClass("hidden");
});
