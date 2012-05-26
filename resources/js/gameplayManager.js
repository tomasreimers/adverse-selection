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
    }
    // begin game if all assets loaded
    if (questionsLoaded && answersLoaded){
        // create game loop
        startRound();
    }
}
function startRound(){
    currentQuestion = getNextQuestion();
    currentlyGuessing = false;
    teamAlreadyFailed = 0;
    toggleRounds();
    $("#questionText").html("");
    nextLetterTimeoutHandle = setTimeout("revealLetter()", questionSpeed);
}
function revealLetter(){
    // reveals next letter
    var currentLength = ($("#questionText").html()).length;
    $("#questionText").html(currentQuestion[0].substr(0,(currentLength + 1)));
    // check if more letters to reveal
    if ((currentLength + 1) < currentQuestion[0].length){
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
        setTimeout("countdown()", 1000);
    }
    else{
        outOfTime();
    }
}
function outOfTime(){
    toggleRounds();
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

function buzz(whichTeam){
    // make sure that team didn't already fail
    if ((whichTeam != teamAlreadyFailed) && !currentlyGuessing){
        // update status
        currentlyGuessing = true;
        // stop revealing letters
        clearTimeout(nextLetterTimeoutHandle);
        // establish which team is answer
        teamCurrentlyAnswering = whichTeam;
        // start counting down
        turnTimeLeft = turnTime + 1;
        countdown();
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