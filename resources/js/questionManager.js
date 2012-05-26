var questions = new Array(); // stores questions and answer's ID
var deck = new Array(); // stores shuffled indexes of questions to provide the user with a random sequence of questions

function loadQuestions(callback){
    // TODO: Load XML Files here
    questions = [["Which way will the demand curve shift if demand increases?", 2], ["Which way will the demand curve shift if demand decreases?", 1], ["Economist that advocated for investment spending", 0]];
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
    // make sure there is another question to get
    if (deck.length == 0){
        // shuffle a new deck
        makeDeck();
    }
    // get next card
    var nextCard = deck.pop();
    return questions[nextCard];
}