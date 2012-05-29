var answers = new Array(); // stores answers

function loadAnswers(callback){
    // TODO: Load XML Files here
    answers = ["Keynes", "Laffer curve", "Demand curve shifts right", "Horizontal", "Demand curve shifts left"];
    callback("answers");
}

function answerToID(answer){
    return answers.indexOf(answer);
}
