soundManager.waitForWindowLoad = true;
soundManager.url = "resources/swf/";

// initialize sounds
var beginSound 
var buzzSound;
var correctSound
var wrongSound

//set up sounds
function initSound(){
	beginSound = soundManager.createSound({
		id: 'begin',
		url: 'resources/sound/begin.mp3'
	});
	buzzSound = soundManager.createSound({
		id: 'buzz',
		url: 'resources/sound/buzz.mp3'
	});
	correctSound = soundManager.createSound({
		id: 'correct',
		url: 'resources/sound/correct.mp3'
	});
	wrongSound = soundManager.createSound({
		id: 'wrong',
		url: 'resources/sound/wrong.mp3'
	});
	beginGame("sound");
}