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
	$.ajax("resources/questions/questions.xml", {
        complete: (function (JQXML, status){
            finishSettingCategories(JQXML);
        })
    });
}

function finishSettingCategories(JQXML){
	var XMLDoc = JQXML.responseXML;
	var questionSets = PlistParser.parse(XMLDoc);
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
	setCategories();
});