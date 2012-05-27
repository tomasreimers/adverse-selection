// *****************************
// ********* VARS **************
// *****************************

// necessary variables
var questionsLoaded = false;
var answersLoaded = false;
var team1Score = 0;
var team2Score = 0;
var currentRound = 0;
var totalRounds = 0;
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
// load variables with data
function initGameVariables(){
    // TODO: actually load variables
}
// *****************************
// ********* Game Cycle ********
// *****************************
// makes sure all assets are loaded
function beginGame(whatLoaded){
    // remember what's loaded
    if (whatLoaded == 'questions'){
        questionsLoaded = true;
    }
    if (whatLoaded == 'answers'){
        answersLoaded = true;
        // load answer to autocomplete
        $("#answerTextfield").quickselect({
            data : answers,
            onItemSelect: makeGuess
        });
    }
    // begin game if all assets loaded
    if (questionsLoaded && answersLoaded){
        // create game loop
        startRound();
    }
}
function awardPoint(whichTeam){
    // give point
    if (whichTeam == 1){
        team1Score++;
    }
    else {
        team2Score++;
    }
    // render score
    $("#team1").children(".score").html(team1Score.toString());
    $("#team2").children(".score").html(team2Score.toString());
    // next round
    startRound();
}
function startRound(){
    // TODO: Make sure a round should actually be started (i.e. current round < total round)
    $("#answerTextfield")[0].blur();
    $("#answerTextfield")[0].value = "";
    $("#answerTextfield")[0].disabled = true;
    currentQuestion = getNextQuestion();
    currentlyGuessing = false;
    teamAlreadyFailed = 0;
    toggleRounds();
	//set displayed question and supplemental image
    $("#questionText").html("");
	if (currentQuestion[2] != 0){
		image = "resources/img/supplements/" + currentQuestion[2] + ".jpg";
	}
	else{
		image = "resources/img/nograph.png";
	}
	$("#supplementalImage").attr("src", image);
    nextLetterTimeoutHandle = setTimeout("revealLetter()", questionSpeed);
}
function revealLetter(){
    // reveals next letter
    var currentLength = ($("#questionText").html()).length;
    $("#questionText").html(currentQuestion[1].substr(0,(currentLength + 1)));
    // check if more letters to reveal
    if ((currentLength + 1) < currentQuestion[1].length){
        nextLetterTimeoutHandle = setTimeout("revealLetter()", questionSpeed);
    }
    else {
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
    // calculate time left
    turnTimeLeft--;
    // render clock
    toggleClock();
    // check if we need to call again later or call out of time
    if (turnTimeLeft > 0){
        turnTimerTimeoutHandle = setTimeout("countdown()", 1000);
    }
    else{
        outOfTime();
    }
}
function outOfTime(){
    toggleRounds();
    // disable text field
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
// *****************************
// ********* interaction *******
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
    // make sure that team didn't already fail
    if ((whichTeam != teamAlreadyFailed) && !currentlyGuessing){
        // stop revealing letters
        clearTimeout(nextLetterTimeoutHandle);
        // update status
        currentlyGuessing = true;
        // establish which team is answering
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
    // get guess
    var guess = $("#answerTextfield")[0].value;
    // get id for guess
    var guessId = answer2id(guess);
    // test if correct
    if (currentQuestion[0] == guessId){
        awardPoint(teamCurrentlyAnswering);
    }
    else {
        // same response as out of time
        outOfTime();
    }
}

// *****************************
// ********* Init **************
// *****************************
// begin gameplay by loading questions and answers
$(document).ready(function (){
    initGameVariables();
    loadQuestions(beginGame);
    loadAnswers(beginGame);
});