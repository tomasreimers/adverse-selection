// *****************************
// ********* VARS **************
// *****************************

// general variables
var questionsLoaded = false;
var answersLoaded = false;
var team1Score = 0;
var team2Score = 0;
var currentRound = 1;
var totalRounds = 1;
var questionSpeed = 100;
var currentQuestion;
var turnTime = 20;
var turnTimeLeft = 0;
var teamAlreadyFailed = 0; // 0: neither, 1: team 1, 2: team 2
var teamCurrentlyAnswering;
var currentlyGuessing = false;

// handles
var nextLetterTimeoutHandle;
var turnTimerTimeoutHandle;

// load user variables with data
function initGameVariables(){
    // TODO: actually load variables
}

// *****************************
// ********* Game Cycle ********
// *****************************

function beginGame(whatLoaded){
    // check if all assets are loaded
    if (whatLoaded == 'questions'){
        questionsLoaded = true;
    }
    if (whatLoaded == 'answers'){
        answersLoaded = true;
        // load answers to autocomplete
        $("#answerTextfield").quickselect({
            data : answers,
            onItemSelect: makeGuess
        });
    }
	//if all loaded, start game
    if (questionsLoaded && answersLoaded){
        startRound();
    }
}

function awardPoint(whichTeam){
    if (whichTeam == 1){
        team1Score++;
    }
    else{
        team2Score++;
    }
    // render score
    $("#team1").children(".score").html(team1Score.toString());
    $("#team2").children(".score").html(team2Score.toString());
    // next round
    startRound();
}

function startRound(){
    // Check if game is done
	var neededScore = Math.ceil(totalRounds / 2)
	if (team1Score == neededScore){
		endGame(1);
	}
	else if (team2Score == neededScore){
		endGame(2);
	}
	// Not done, so continue on to next round
	else{
		// clear round variables and displays
		$("#answerTextfield")[0].blur();
		$("#answerTextfield")[0].value = "";
		$("#answerTextfield")[0].disabled = true;
		currentQuestion = getNextQuestion();
		currentlyGuessing = false;
		teamAlreadyFailed = 0;
		toggleRounds();
		// set displayed question and supplemental image
		$("#questionText").html("");
		if (currentQuestion[2] != 0){
			image = "resources/img/supplements/" + currentQuestion[2] + ".jpg";
			$("#supplementalImage").attr("src", image);
			$("#questionSupplement").show()
		}
		else{
			$("#questionSupplement").hide()
		}
		nextLetterTimeoutHandle = setTimeout("revealLetter()", questionSpeed);
	}
}

function revealLetter(){
    var currentLength = ($("#questionText").html()).length;
    $("#questionText").html(currentQuestion[1].substr(0,(currentLength + 1)));
    // check if more letters to reveal
    if ((currentLength + 1) < currentQuestion[1].length){
        nextLetterTimeoutHandle = setTimeout("revealLetter()", questionSpeed);
    }
    else{
        // if only one team left (i.e. other's guess was wrong), they must go
        if (teamAlreadyFailed == 1){
            buzz(2);
        }
        else if (teamAlreadyFailed == 2){
            buzz(1);
        }
    }
}

function countdown(){
	// reduce time left and display remaining time
    turnTimeLeft--;
    toggleClock();
    // check if no time is left
    if (turnTimeLeft > 0){
        turnTimerTimeoutHandle = setTimeout("countdown()", 1000);
    }
    else{
        outOfTime();
    }
}

function outOfTime(){
    // modify rounds text and disable text field
	toggleRounds();
    $("#answerTextfield")[0].blur();
    $("#answerTextfield")[0].value = "";
    $("#answerTextfield")[0].disabled = true;
    // see if other team has already lost, or if they need a shot
    if (teamAlreadyFailed == 0){
        teamAlreadyFailed = teamCurrentlyAnswering;
        currentlyGuessing = false;
        revealLetter();
    }
    else {
        // both teams lost, next round
        startRound();
    }
}

function toggleClock(){
    $("#roundText").html("Seconds Left");
    $("#roundContent").html(turnTimeLeft.toString());
}

function toggleRounds(){
    $("#roundText").html("Round");
    $("#roundContent").html(currentRound.toString() + " of " + totalRounds.toString());
}

function endGame(winningTeam){
	// Remove text field
	$("#answerTextfield")[0].blur();
	$("#answer").hide();
	// Show winner
	$("#winBox").show();
	$("#winner").html("Team " + winningTeam + " wins!");
}

function newGame(){
	location.reload();
}

// *****************************
// ********* Interaction *******
// *****************************

$(document).keypress(function(event){
	//for buzz key presses
	if (!currentlyGuessing){
		code = event.charCode;
		switch (code){
			case 97: //a
				buzz(1);
				break;
			case 108: //l
				buzz(2)
				break;
		}
	}
});

function buzz(whichTeam){
    if ((whichTeam != teamAlreadyFailed) && !currentlyGuessing){
        // stop revealing letters
        clearTimeout(nextLetterTimeoutHandle);
        // update status
        currentlyGuessing = true;
        teamCurrentlyAnswering = whichTeam;
        // give the text field focus and delete any extra chars from buzzing
        $("#answerTextfield")[0].disabled = false;
		$("#answerTextfield")[0].value = "";
        $("#answerTextfield")[0].focus();
        // start counting down
        turnTimeLeft = turnTime + 1;
        countdown();
    }
}

function makeGuess(){
    // stop the timer
    clearTimeout(turnTimerTimeoutHandle);
    // get guess information and check if correct
    var guess = $("#answerTextfield")[0].value;
    var guessId = answerToID(guess);
    if (currentQuestion[0] == guessId){
        awardPoint(teamCurrentlyAnswering);
    }
    else{
        outOfTime();
    }
}

// *****************************
// ********* Init Gameplay *****
// *****************************

$(document).ready(function (){
    initGameVariables();
    loadQuestions(beginGame);
    loadAnswers(beginGame);
});