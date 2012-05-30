var answers = new Array(); // stores answers

function loadAnswers(callback){
    $.ajax("resources/answers/answer.xml", {
        complete: finishLoadingAnswers
    });    
}

function finishLoadingAnswers(JQXML, callback){
    var XMLString = JQXML.responseText;
    var JSONString = PlistParser.parse(XMLString);
    answers = jQuery.parseJSON(JSONString);
    callback("answers");
}

function answerToID(answer){
    return answers.indexOf(answer);
}
