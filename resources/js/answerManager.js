var answers = new Array(); // stores answers

function loadAnswers(callback){
    // TODO: Load XML Files here
    answers = ["Keynes", "Laffer curve", "Demand curve shifts right", "Horizontal"];
    // activate callback when done
    callback("answers");
}

function answer2id(answer){
    return answers.indexOf(answer);
}
