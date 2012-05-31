// allowed game options
var timeOptions = new Array(5, 10, 15, 20, 25, 30);
var roundOptions = new Array(1, 5, 11, 15, 21, 25);
var categoryOptions = new Array("Externalities", "Supply and Demand", "Data", "Nobel Prizes");

// set game options
var time = timeOptions[1];
var rounds = roundOptions[4];
var deselectedCategories = new Array();

function createButtons(){
	// populate lists with buttons corresponding to game options
	for (i = 0; i < timeOptions.length; i ++){
		$("#timeSelectionBox ul").append("<li><a id='time" + timeOptions[i] + "' class='customRadio' href='#' onclick='setTime(" + timeOptions[i] + ")'>" + timeOptions[i] + " Seconds</a></li>");
	}
	for (i = 0; i < roundOptions.length; i ++){
		$("#roundsSelectionBox ul").append("<li><a id='round" + roundOptions[i] + "' class='customRadio' href='#' onclick='setRounds(" + roundOptions[i] + ")'>" + roundOptions[i] + " Seconds</a></li>");
	}
	for (i = 0; i < categoryOptions.length; i ++){
		$("#categorySelectionBox ul").append("<li><a id='category" + i + "' class='customCheckbox checked' href='#' onclick='toggleCategories(" + i + ")'>" + categoryOptions[i] + " Seconds</a></li>");
	}
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
	createButtons();
});