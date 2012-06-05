var questions = new Array(); // stores: [answer id, question, image number]
var deck = new Array(); // stores: shuffled question indexes

function loadQuestions(callback){
    // TODO: Load XML Files here
	$.ajax("data/questions.txt", {
        complete: (function (txtData, status){
            finishLoadingQuestions(txtData, callback);
        })
    });
}

function finishLoadingQuestions(txtData, callback){
    var questionSets = parseQuestions(txtData.responseText);
	// create questions from only active categories
	for (var i = 0; i < questionSets.length; i ++){
		if ($.inArray(i, disabledCategories) == -1){
			questionSets[i].shift() //remove title of category
			questions = questions.concat(questionSets[i]);
		}
	}
    // shuffle questions
    makeDeck();
    callback("questions");
}

function makeDeck(){
    questionLengthPlusOne = questions.length;
    for (var i = 0; i < questionLengthPlusOne; i++){
        randomNumber = Math.floor(Math.random() * questionLengthPlusOne);
        deck.splice(randomNumber, 0, i)
    }
}

function getNextQuestion(){
    // if no question to get, create questions
    if (deck.length == 0){
        makeDeck();
    }
    // otherwise, get next question
    var nextCard = deck.pop();
    return questions[nextCard];
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