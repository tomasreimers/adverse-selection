// allowed game options
var timeOptions = new Array(10, 15, 20, 25, 30, 35);
var roundOptions = new Array(1, 5, 11, 15, 21, 25, 100);
var categoryOptions = new Array();
var categoryCounts = new Array();

// set game options
var time = timeOptions[3];
var rounds = roundOptions[4];
var deselectedCategories = new Array();

function setCategories(){
	$.ajax("data/questions.txt", {
        complete: (function (txtData, status){
            finishSettingCategories(txtData);
        })
    });
}
//***************************************************************************************************************************************************************
function parseQuestions(txtData){
	var lines = txtData.replace(/(\r)/gm, "").split('\n');
	var questions = new Array();
	var currentSection = new Array();
	for (var i = 0; i < lines.length; i ++){
		// check for new section
		if (lines[i][0] == '#'){
			// don't add blank section if first line
			if (i != 0){
				questions.push(currentSection);
			}
			currentSection = []
			currentSection.push(lines[i].substring(1));
		}
		// check for new question
		else if (lines[i] == '' && lines[i + 2] != ''){
			var currentQuestion = new Array($.trim(lines[i + 1]), lines[i + 2], $.trim(lines[i + 3]));	
			currentSection.push(currentQuestion);
			i += 3;
		}
	}
	//push final section and return questions
	questions.push(currentSection);
	return questions;
}

function parseAnswers(txtData){
	var lines = txtData.replace(/(\r)/gm, "").split('\n');
	var answers = new Array();
	// add trimmed lines to answers array
	for (var i = 0; i < lines.length; i ++){
		answers.push($.trim(lines[i]));
	}
	return answers;
}
//***************************************************************************************************************************************************************

function finishSettingCategories(txtData){
	var questionSets = parseQuestions(txtData.responseText);
	// get question categories from array sets
	for (var i = 0; i < questionSets.length; i ++){
		categoryOptions.push(questionSets[i][0]);
		categoryCounts.push((questionSets[i].length - 1));
	}
	// now ready to display categories and other buttons
	createButtons();
}

function createButtons(){
	// populate lists with buttons corresponding to game options
	for (i = 0; i < timeOptions.length; i ++){
		$("#timeSelectionBox ul").append("<li><a id='time" + timeOptions[i] + "' class='customRadio' href='#' onclick='setTime(" + timeOptions[i] + ")'>" + timeOptions[i] + "</a></li>");
	}
	for (i = 0; i < roundOptions.length; i ++){
		$("#roundsSelectionBox ul").append("<li><a id='round" + roundOptions[i] + "' class='customRadio' href='#' onclick='setRounds(" + roundOptions[i] + ")'>" + roundOptions[i] + "</a></li>");
	}
	for (i = 0; i < categoryOptions.length; i ++){
		$("#categorySelectionBox ul").append("<li><a id='category" + i + "' class='customCheckbox checked' href='#' onclick='toggleCategories(" + i + ")'>" + categoryOptions[i] + "<span class='count'>" + categoryCounts[i] + " questions</span></a></li>");
	}
	// make sure body background is high enough
	var neededHeight = $("#leftHalf").height() + 10;
	$("body").css("min-height", neededHeight + "px");
	// select the default radio buttons
	selectRadio("time" + time);
	selectRadio("round" + rounds);
	// set the default start link url
	updateLink()
}

function setTime(selected){
	// change the time selection
	deselectRadio("time" + time);
	time = selected;
	selectRadio("time" + time);
	updateLink();
}

function setRounds(selected){
	// change the rounds selection
	deselectRadio("round" + rounds);
	rounds = selected;
	selectRadio("round" + rounds);
	updateLink();
}

function deselectRadio(radioID){
	$("#" + radioID).removeClass("selected");
}

function selectRadio(radioID){
	$("#" + radioID).addClass("selected");
}

function toggleCategories(toggled){
	// either check or uncheck a category and add or remove it from deselected array
	if ($.inArray(toggled, deselectedCategories) != -1){
		deselectedCategories.splice($.inArray(toggled, deselectedCategories), 1);
		$("#category" + toggled).addClass("checked");
	}
	else{
		deselectedCategories.push(toggled);
		$("#category" + toggled).removeClass("checked");
	}
	updateLink();
}

function updateLink(){
	// updates the start link url to match the new get variable string
	getString = createGetString();
	$("#start").attr("href", "game.html" + getString)
}

function createGetString(){
	timePortion = "?t=" + time;
	roundsPortion = "&r=" + rounds;
	categoriesPortion = "&c=";
	for (i = 0; i < categoryOptions.length; i ++){
		if ($.inArray(i, deselectedCategories) != -1){
			categoriesPortion += "0";
		}
		else{
			categoriesPortion += "1";
		}
	}
	return timePortion + roundsPortion + categoriesPortion;
}

$(document).ready(function (){
	// warn user if window size is too small
	if ($(window).width() < 840 || $(window).height() < 527){
		alert("Your browser window is too small to play Adverse Selection!\nTry resizing your window to a larger size or using another computer.\n\nYou can try to play, but it's doubtful that you'll have much fun...");
	}
	// set up page
	setCategories();
});