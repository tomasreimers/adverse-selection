var answers = new Array(); // stores answers

function loadAnswers(callback){
    $.ajax("resources/answers/answers.xml", {
        complete: (function (JQXML, status){
            finishLoadingAnswers(JQXML, callback);
        })
    });    
}

function finishLoadingAnswers(JQXML, callback){
    var XMLDoc = JQXML.responseXML;
    answers = PlistParser.parse(XMLDoc);
    callback("answers");
}

function answerToID(answer){
    return answers.indexOf(answer);
}
