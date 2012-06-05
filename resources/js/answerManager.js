var answers = new Array(); // stores answers

function loadAnswers(callback){
    $.ajax("data/answers.txt", {
        complete: (function (txtData, status){
            finishLoadingAnswers(txtData, callback);
        })
    });    
}

function finishLoadingAnswers(txtData, callback){
    answers = parseAnswers(txtData.responseText);
    callback("answers");
}

function answerToID(answer){
    return answers.indexOf(answer);
}

function IDToAnswer(ID){
	return answers[ID];
}