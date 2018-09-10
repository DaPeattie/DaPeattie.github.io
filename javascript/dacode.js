function randomIntFromInterval(min,max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}

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
	
	function newID(length) {
		
		if (length == undefined){length = 4;}
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	  
		for (var i = 0; i < length; i++){
		  text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	
	
	var boardOptions = [
		'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',	'blueTeam',
		'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',	'redTeam',
		'assassin',
		'neutral','neutral','neutral','neutral','neutral','neutral','neutral'];
	
	
	
	
	var app = new Vue({
		el: '#app',
	  	data: {
			gameState: 'pregame',
			host: false,
			boardLayout: boardOptions,
			gameID : 'Unknown',
			clicked : {},
			playerType: 'player',
			spymasterCount: 0, 
			words: 
			[
				1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
			]
	  }
	});
	

	
	
	
	$('td').on('click', revealTile);
	function revealTile(e){
		$(this).removeClass('hiddenState');
		
		//push to cloud
		var dataPosition = $(this).attr('data-position');
		var objectToPush = {};
		objectToPush[dataPosition] = true;
		console.log(objectToPush);
		firebase.database().ref('games/' + app.gameID + '/clicked').update(objectToPush);
	}
	
	

	$('#newGameBtn').click(newGame);
	function newGame(e){
		
		//set a unique Game Id
		app.gameID =  newID();
		//set self as host
		app.host = true;
		//trigger next game
		nextGame();
		//join game created
		joinGame(app.gameID );
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
		
		//init the board on new game
		firebase.database().ref('games/' + gameID + '/gameTimeStamp').on('value', function(snapshot) {
			gameInfo = snapshot.val();
			initBoard();
		});
		
		
		
		
		//set the app state to playing, revealing the board
		app.gameState = 'playing';
		$('.playing').show();
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
	$('#nextGame').on('click',nextGame);
	function nextGame(e){
		
		
		
		var boardLayout = shuffle(boardOptions);
		var wordsLayout = [];
	
		for(var i = 0 ; i < 25 ; i++){
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

		var $boardTDs = $('#app td');
		
		
		//reset playing board
		$('td').attr('class', '');
		$('.spyTicks').remove();
		$('#playerView').show();
		$('#spyView').show();
		$('.playing table').hide();
		$('#nextGame').hide();
		
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
			if($boardTDs.eq(position).find('i').length == 0){
				if(app.playerType === 'spymaster'){
					$boardTDs.eq(position).append(checkStringShow);
				}
				else{
					$boardTDs.eq(position).append(checkStringHide);
				}	
			}
			
			
			
		}
	}
	
	
	$('#spyView').on('click',becomeSpyMaster);
	function becomeSpyMaster(e){
		//store player type in app.
		app.playerType = 'spymaster';
		
		//doesnt allow spy to interact with board
		$('.playing table').css('pointer-events','none');
		
		//shows extra spy information
		$('.hiddenState').removeClass('hiddenState');
		$('.spyTicks').show();
		
		//shows board and hides player options
		$('.playing table').show();
		$('#playerView').hide();
		$('#spyView').hide();
		
		//shows the nextGame button if you are the host.
		if(app.host){
			$('#nextGame').show();
		}
	}
	
	
	$('#playerView').on('click',becomePlayer);
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
		
		//shows board and hides player options
		$('#playerView').hide();
		$('#spyView').hide();
		$('.playing table').show();
		
		//shows the nextGame button if you are the host.
		if(app.host){
			$('#nextGame').show();
		}
		
	}