// *****************************
// ********* VARS **************
// *****************************

// general variables
var questionsLoaded = false;
var answersLoaded = false;
var soundLoaded = false;
var team1Score = 0;
var team2Score = 0;
var currentRound = 0;
var totalRounds = 5;
var questionSpeed = 100;
var currentQuestion;
var turnTime = 20;
var turnTimeLeft = 0;
var teamAlreadyFailed = 0; // 0: neither, 1: team 1, 2: team 2
var teamCurrentlyAnswering;
var currentlyGuessing = false;
var disabledCategories = new Array();

// handles
var nextLetterTimeoutHandle;
var turnTimerTimeoutHandle;

// load user variables with data
function initGameVariables(){
    var getVariables = getUrlVars();
	// check if all get variables exist
	if ("r" in getVariables  && "t" in getVariables  && "c" in getVariables){
		totalRounds = parseInt(getVariables["r"])
		turnTime = parseInt(getVariables["t"])
		// turn string of 0's and 1's into disabled categories array
		categoriesString = getVariables["c"]
		for (var i = 0; i < categoriesString.length; i ++){
			if (categoriesString[i] == '0'){
				disabledCategories.push(i);
			}
		}
	}
}

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
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
	if (whatLoaded == 'sound'){
		soundLoaded = true;
	}
	//if all loaded, start game
    if (questionsLoaded && answersLoaded && soundLoaded){
        startRound();
    }
}

function awardPoint(whichTeam){
	correctSound.play()
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
                  currentRound++;
		// clear round variables and displays
		$("#answerTextfield")[0].blur();
		$("#answerTextfield")[0].value = "";
		$("#answerTextfield")[0].disabled = true;
		currentQuestion = getNextQuestion();
		currentlyGuessing = false;
		teamAlreadyFailed = 0;
		toggleRounds();
        $("#buzz1 .buzzer, #buzz2 .buzzer").removeClass("inverted");
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
		beginSound.play()
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
	wrongSound.play()
    // modify rounds text and disable text field
	toggleRounds();
    $("#answerTextfield")[0].blur();
    $("#answerTextfield")[0].value = "";
    $("#answerTextfield")[0].disabled = true;
    $("#buzz1 .buzzer, #buzz2 .buzzer").removeClass("inverted");
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

$(document).keydown(function(event){
	//for buzz key presses
	if (!currentlyGuessing){
		code = event.keyCode;
		// buzz for correct code and prevent key from being entered in text field
		switch (code){
			case 65: //a
				event.preventDefault()
				buzz(1);
				break;
			case 76: //l
				event.preventDefault()
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
        // give the text field focus
        $("#answerTextfield")[0].disabled = false;
        $("#answerTextfield")[0].focus();
        // show which team is guessing
        var buzzerId = "#buzz" + whichTeam;
        $(buzzerId + " .buzzer").addClass("inverted");
        // start counting down
        turnTimeLeft = turnTime + 1;
        countdown();
		buzzSound.play()
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
	soundManager.onready(initSound);
});