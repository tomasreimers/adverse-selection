function parseQuestions(txtData){
	var lines = txtData.split('\n');
	var questions = new Array();
	var currentSection = new Array();
	for (var i = 0; i < lines.length; i ++){
		// check for new section
		if (lines[i][0] == '#'){
			questions.push(currentSection);
			currentSection = []
			currentSection.push(lines[i].substring(1));
		}
		// check for new question
		else if (lines[i] == '' && lines[i + 2] != ''){
			var currentQuestion = new Array(lines[i + 1].trim(), lines[i + 2], lines[i + 3].trim());	
			currentSection.push(currentQuestion);
			i += 3;
		}
	}
	return questions;
}

function parseAnswers(txtData){
	//pass
}

// add fast trim method
String.prototype.trim = String.prototype.trim || function trim() { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };