var questions; // stores questions and answer's ID
var deck; // stores shuffled indexes of questions to provide the user with a random sequence of questions

function loadQuestions(callback){
    // TODO: Load XML Files here
    callback("questions");
}

function getNextQuestion(){
    // TODO: Get next question id from deck and provide back an array of the next question (question, answer ID)
    return ["Which way will the demand curve shift if demand increases?", 1];
}