var questions = new Array(); // stores: [answer id, question, image number]
var deck = new Array(); // stores: shuffled question indexes

function loadQuestions(callback){
    // TODO: Load XML Files here
    questions = [[2, "Which way will the demand curve shift if demand increases?", 0], [1, "What is the name of this curve?", 1], [0, "Economist that advocated for investment spending", 0]];
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