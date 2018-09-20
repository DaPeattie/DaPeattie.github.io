




var app = new Vue({
	el: '#app',
	data: {
		gameID : 'Unknown', 	// a 4 letter random ID eg KWJS
		gameState: 'pregame', 	// pregame || playerSelect || playing || gameOver
		teamTurn:	'Blue',		// Blue || Red
		playerType: '',			// blue || red || spymaster
		host: false,			// true || false
		spymasterCount: 0,
		score: {Blue:9,Red:8},	// remaining tiles of that color on the board
		winner: false,			// false || red || blue
		words: [],				// list of words in order of appearance on board
		boardLayout: [],		// list of tile states in order of appearance on board
		clicked : {},			// {tildID:true} -> when a tile is clicked
  	},
 	methods: {
		wordClick: function (e) {
		  revealTile(e);
		},
		player: function (playerType){
			
			if(playerType == 'spyMaster'){
				becomeSpyMaster();
			}
			else{
				becomePlayer();
			}
			app.playerType = playerType;
			app.gameState = 'playing';
		},
		endTurn: function(){
			//send data to firebase telling them whos turn it is.
			console.log('End Turn attempted!');
			endTurn();
		},
		nextGame: function(){
			app.gameState = 'playerSelect';
			nextGame();
		},
		newGame:function(){
			newGame();
		},
	}
	
	
});

// 4 * 6 = 24 options
var boardOptions = [
	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam', //9 blue
	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',				//8 red
	'assassin',																									//1 assassin
	'neutral','neutral','neutral','neutral','neutral','neutral'];												//6 neutral



function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//generate a random 4 letter string
function newID(length) {

	if (length == undefined){length = 4;}
	
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for (var i = 0; i < length; i++){
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function endTurn(e){
	
	if(app.playerType === app.teamTurn){
		var swapTo = 'Blue';
		if(app.playerType === 'Blue'){
			swapTo = 'Red'
		}
		
		
		//push the team turn 
		firebase.database().ref('games/' + app.gameID ).update({
			teamTurn:swapTo
		});
		
	}
}


function revealTile(e){
	
	//its not your turn or the game is over!
	if(app.playerType != app.teamTurn || app.winner){ return; }
	
	//if its already been revealed or maybe the click is on the table
	if(!$(e.target).hasClass('hiddenState')){return;}
	
	//reveal the color on local board before sending to cloud
	$(e.target).removeClass('hiddenState');

	
	//push click to cloud
	var dataPosition = $(e.target).attr('data-position');
	var objectToPush = {};
	objectToPush[dataPosition] = true;
	
	
	//if you clicked on a tile that is not your own, end your turn
	var tileRevealed = app.boardLayout[dataPosition];
	var teamColor = app.playerType.toLocaleLowerCase();
	if(tileRevealed.indexOf(teamColor) < 0 &&  tileRevealed != 'assassin'){
	   endTurn();
	}
	
	
	firebase.database().ref('games/' + app.gameID + '/clicked').update(objectToPush);
}


//start a new game with a unique id and join that game
function newGame(e){
	//set a unique Game Id
	app.gameID =  newID();
	//set self as host
	app.host = true;
	//trigger next game
	nextGame();
	//join game created
	joinGame(app.gameID);
}



//main play function
function joinGame(gameID){


	//add Game id to app 
	app.gameID = gameID;


	//initilze the game with a 'once' call to the database
	initBoard();

	//update the clicks each time a new click is made.
	firebase.database().ref('games/' + gameID + '/clicked').on('value', function(snapshot) {
		var clicks = snapshot.val();
		app.clicked = clicks; 
		updateClicks();

	});
	
	//update which teams turn it is 
	firebase.database().ref('games/' + gameID + '/teamTurn').on('value', function(snapshot) {
		var teamTurn = snapshot.val();
		app.teamTurn = teamTurn; 
	});

	//init the board on new game
	firebase.database().ref('games/' + gameID + '/gameTimeStamp').on('value', function(snapshot) {
		//var gameInfo = snapshot.val();
		initBoard();
	});

	//set the app state to playing, revealing the board
	app.gameState = 'playerSelect';
}


//join game with a valid ID
$('#joinGameBtn').click(joinGameBtn_click);
function joinGameBtn_click(e){
	var inputValue = $('#joinGameID').val().toUpperCase();

	if(inputValue.length < 4){return false;}

	firebase.database().ref('games/' + inputValue).once('value').then(function(snapshot) {
		const gameData = snapshot.val();
		if (gameData){ 
		  joinGame(inputValue);
		}
		else{
			console.log('No game called ' + inputValue);	
		}
	});
}


//trigger next game, only can be done by host

function nextGame(e){



	var boardLayout = shuffle(boardOptions);
	var wordsLayout = [];

	for(var i = 0 ; i < boardOptions.length ; i++){
		var wordsLength = dict.length - 1;
		var randomNumber = Math.round(Math.random() * wordsLength);
		while( wordsLayout.indexOf(dict[randomNumber]) >= 0){
			randomNumber = Math.round(Math.random() * wordsLength);
		}
		wordsLayout.push(dict[randomNumber]);
	}

	firebase.database().ref('games/' + app.gameID).set({
		state: 'playing',
		boardLayout: boardLayout,
		words: wordsLayout,
		clicked: {},
		gameTimeStamp: Date.now(),
		teamTurn:'Blue',
	});	

	/*
	//var oldID = app.gameID;
	//app.gameID = newID();
	if(oldID != 'Unknown'){
		//firebase.database().ref('games/' + app.gameID).remove();
	}
	*/

}


//inital setup of a new board
function initBoard(gameInfo){

	//table division targets
	var $boardTDs = $('#app td');


	//reset playing board
	$('td').attr('class', '');
	$('.spyTicks').remove();
	$('.playing table').hide();
	
	//once the board is ready, allow player selection
	app.gameState = 'playerSelect';
	app.winner = false;

	//initilize the board once for a new game
	firebase.database().ref('games/' + app.gameID).once('value').then(function(snapshot) {

		gameInfo = snapshot.val();
		app.boardLayout = gameInfo.boardLayout;
		app.words = gameInfo.words;
		app.clicked = gameInfo.clicked;
		app.spymasterCount = gameInfo.spymasterCount;

		//allocate the tds to their team colors
		for (i in app.boardLayout){
			$boardTDs.eq(i).addClass('hiddenState');
			$boardTDs.eq(i).addClass(app.boardLayout[i]);
		}


		//update the clicks if this is a rejoin or a late joiner
		updateClicks();	
	});	


	
}

//updates the state of the board from the app.data<-cloud data
function updateClicks(){
	var $boardTDs = $('#app td');
	
	
	
	for( var position in app.clicked){

		//stops the state from being hidden - revealing its true identity 
		$boardTDs.eq(position).removeClass('hiddenState');

		//add a tick if you are the spymaster so its obvious a tile has been clicked
		//adds a hidden tick to the player screen
		var checkStringShow = '<i class="material-icons md-36 spyTicks" >done_outline</i>';
		var checkStringHide = '<i class="material-icons md-36 spyTicks" style="display:none">done_outline</i>';
		
		//only add the i once
		if($boardTDs.eq(position).find('i').length == 0){
			if(app.playerType === 'spyMaster'){
				$boardTDs.eq(position).append(checkStringShow);
			}
			else{
				$boardTDs.eq(position).append(checkStringHide);
			}	
		}

	}
	
	//check to see if the game has ended
	checkBoard();


}

//set scores and check board status 
function checkBoard(){
	
	
	var visibleRed = 0;
	var visibleBlue = 0;
	
	for( var position in app.clicked){
		
		
		//instant loss for team who clicks assassin
		if(app.boardLayout[position] === 'assassin'){
			if(app.teamTurn == 'Blue'){
				app.winner = 'Red';
			}
			if(app.teamTurn == 'Red'){
				app.winner = 'Blue';
			}
			//app.gameState = 'gameOver';
			return;
		}
		
		//count visible reds/blues to display remaining score
		if(app.boardLayout[position] === 'redTeam'){
			visibleRed ++ ;
		}
		if(app.boardLayout[position] === 'blueTeam'){
			visibleBlue ++;
			
		}
		
	}
	
	app.score.Red = 8 - visibleRed;
	app.score.Blue = 9 - visibleBlue;


	if(app.score.Red === 0 ){
		//app.gameState = 'gameOver';
		app.winner = 'Red';
	}
	if(app.score.Blue === 0){
		//app.gameState = 'gameOver';
		app.winner = 'Blue';
	}

	
	
	
}



function becomeSpyMaster(e){
	//store player type in app.
	app.playerType = 'spymaster';

	//doesnt allow spy to interact with board
	$('.playing table').css('pointer-events','none');

	//shows extra spy information
	$('.hiddenState').removeClass('hiddenState');
	$('.spyTicks').show();


}



function becomePlayer(e){
	//store player type in app.
	app.playerType = 'player';

	//remove spy information and allows the board to be clicked
	$('.spyTicks').hide();
	$('.playing table').css('pointer-events','auto');


	//allocate the tds to their team colors
	var $boardTDs = $('#app td');
	for (i in app.boardLayout){
		$boardTDs.eq(i).addClass('hiddenState');
		$boardTDs.eq(i).addClass(app.boardLayout[i]);
	}


	//update the clicks if this is a rejoin or a late joiner
	updateClicks();	


}


$('.hiddenBeforeLoad').removeClass('hiddenBeforeLoad');
