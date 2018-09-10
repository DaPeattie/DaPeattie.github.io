// song title shows up
	// players tap their phones to the rhythm
	//last 10 taps are taken as input
	//scoreboard
	//song title shows again and song starts playing and BPM is shown
	// players names are show and light up along with their recorded taps showing bpm as they go
	//scores show up based on how close the player was to the BPM of the song
	
	//bonus rounds, double time bpm, half time bpm, every 2nd beat, every 3rd beat (hard),
	
	var app = new Vue({
	  el: '#app',
	  data: {
		gameID:'',
		countdown: 0,
		players:[],
		currentRoundData:{},
		myPlayer: '',
		songName:'',
		songArtist:'',
		roundNum:'',
		tapMaker:'Unknown',
		state:'Pregame',
		bpm:0,
		host:'Unknown',
		roundsToPlay:4,
	  
	  }
	});

	var seconds = 1000;
	var host = false;
	var availableSongs = 11;
	var taps = [];
	
	var songsRef = {};
	var roundOrder = [];
	var roundsToPlay = 4;
	
	
	var tester = '';
	
	firebase.database().ref('songs').once('value').then(function(snapshot) {
		songsRef = snapshot.val();
	});
	
	
	$('#joinGameBtn').click(joinGameBtn_click);
	function joinGameBtn_click(e){
		var inputValue = $('#joinGameID').val().toUpperCase();
		
		if(inputValue.length < 4){return false;}
		
		firebase.database().ref('games/' + inputValue).once('value').then(function(snapshot) {
			const userData = snapshot.val();
			if (userData){ 
			  joinGame(inputValue);
			}
			else{
				console.log('No game called ' + inputValue);	
			}
		});

	}
	
	
	//player name must have at least one character
	$('#playerName').on('input',playerName_input);
	function playerName_input(e){
		if( $('#playerName').val().length > 0){
			$('#setPlayerName').prop('disabled','');
		}
	}
	
	//sets the players name and send it to the database
	$('#setPlayerName').click(setPlayerName_click);
	function setPlayerName_click(e){
		$('#setPlayerNameDiv').addClass('d-none');
		var playerName = $('#playerName').val();
		app.myPlayer = playerName;
	
		if(host){
			firebase.database().ref('games/' + app.gameID ).update({
				'host' : playerName,
			});	
		
			$('#startGameBtn').removeClass('d-none');
			
		}
		
		
		var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/players/' + playerName).update({
			'host' : host,
	  	});	
		
		$('#countDownIndicator').removeClass('d-none');
	}
	
	
	$('#newGameBtn').click(newGame);
	function newGame(e){
		
		
		var gameID = newID();
		var songSequence = [];
		
		while(songSequence.length < roundsToPlay){
			var randomNumber = Math.floor(Math.random() * availableSongs);
			
			if(songSequence.indexOf(randomNumber) == -1){
				songSequence.push(randomNumber);
			}
		}
		
		

		firebase.database().ref('games/' + gameID).set({
			state: 'starting',
			'round': 0,
			host: 'UnKnown',
			sequence:songSequence,
	  	});	
		
		host = true;
		joinGame(gameID);
	}
	
	
	
	$('#tapButton').on('touchstart',tapButton_click);
	$('#tapButton').on('mousedown',tapButton_click);
	function tapButton_click(e){
		taps.push(Date.now());
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
	
	
	
	function joinGame(gameID){
		
		$('#preGame').hide('slow', function(){ $target.remove(); });
		
		var gameInfo = firebase.database().ref('games/' + gameID);
		gameInfo.on('value', function(snapshot) {
			
			gameInfo = snapshot.val();
			app.gameID = gameID;
			app.host = gameInfo.host;
			app.players = [];
			
			
			//add the players names for all to see
			for(player in gameInfo.players){
				app.players.push(player);
				
				//one round each if more 3 or more players
				if(app.players.length >= 3){
					roundsToPlay = 	app.players.length;
					app.roundsToPlay = 	app.players.length;
				}

			}
			
			
			//if the round number is -1, end the game (only once, hopefully)
			if(gameInfo['round'] == -1 && app.roundNum != -1 ){
				app.roundNum = -1;
				endGame();	
			}


			//if the game number has changed and the game isnt over, start the next round
			if(gameInfo['round'] > 0 && app.roundNum != gameInfo['round'] ){
				$('#countDownIndicator').addClass('d-none');
				$('#app ul').addClass('d-none');
				beginRound(gameInfo);
				

			}
			
			if(gameInfo.state == 'playing' & app.state != 'playing'){
				app.state = 'playing';
				
				$('#tapButton').removeClass('invisible');
				startRoundCountdown(gameInfo);
				console.log('playing state triggered');
			}
			
			$('#app').removeClass('d-none');
		});

		
	}
	
	
	
	
	$('#startGameBtn').on('touchstart mousedown', startGame);
	function startGame(e){
		
		if(host){
			
			for(var i = 0; i < roundsToPlay; i++){
				var playerName = app.players[i%app.players.length];
				roundOrder.push(playerName);
			}
			
			console.log(roundOrder);
			
			firebase.database().ref('games/' + app.gameID).update({
				state:'waiting',
				'round': 1,
				'roundOrder':roundOrder,
			});				
		}
		
		
		
		$('#startGameBtn').addClass('d-none');
	}
	
	
	
	$('#submitTaps').on('touchstart mousedown', submitTaps);
	function submitTaps(e){
		$('#tapActions').addClass('invisible');
		$('#tapButton').addClass('invisible');
		if(app.tapMaker != app.myPlayer){ return;}
		
		timeBetweenTaps = normalizeTaps(taps);
		
		
		taps = [];
		
		
			firebase.database().ref('games/' + app.gameID +'/roundData/' + app.roundNum ).update({
				'rhythm' : timeBetweenTaps,
			});	
			
			firebase.database().ref('games/' + app.gameID).update({
				state:'playing',
			});
	}
	
	function normalizeTaps(tapArray){
		
		var normalizedTaps = []
		var firstTap = tapArray[0];
		for(var i in tapArray){

			normalizedTaps.push(tapArray[i] - firstTap);

		}
		var timeBetweenTaps = [0];
		for( var i in normalizedTaps){
			if(i > 0){
				timeBetweenTaps.push( normalizedTaps[i] - normalizedTaps[i-1]);	
			}	
		}
		
		return timeBetweenTaps;
		
		
	}
	
	
	$('#resetTaps').on('touchstart mousedown', resetTaps);
	function resetTaps(e){
		taps = [];
	}
	
	
	function beginRound(gameInfo){
		taps = [];
		app.roundNum =  gameInfo['round'];
		
		if(app.myPlayer != ''){
			$('#roundInfomationDiv').removeClass('d-none');
		}
		
		var currentTapMaker = gameInfo.roundOrder[app.roundNum - 1];
	
		app.tapMaker = currentTapMaker;
		
		
		
		if(currentTapMaker === app.myPlayer){
			//show tapper
			$('#tapButton').removeClass('invisible');
			//show submit
			$('#tapActions').removeClass('invisible');
				
		}
		/*
		var roundSeconds = 30 * seconds;
		var roundEndTime = Date.now() + roundSeconds;
		
		var countdown = setInterval(function(){
			var progressThroughRound = (1 - (roundEndTime - Date.now())/roundSeconds) * 100 ;
			$('#roundInfomationDiv').find('.progress-bar').css('width', progressThroughRound + '%');
		
			if(progressThroughRound >= 100){
				clearInterval(countdown);	
				endRound(gameInfo);
			}
		},50);
		*/
		
	}
	
	
	function startRoundCountdown(gameInfo){
		
		var roundSeconds = 30 * seconds;
		var roundEndTime = Date.now() + roundSeconds;
		
		var countdown = setInterval(function(){
			var progressThroughRound = (1 - (roundEndTime - Date.now())/roundSeconds) * 100 ;
			$('#roundInfomationDiv').find('.progress-bar').css('width', progressThroughRound + '%');
		
			if(progressThroughRound >= 100){
				clearInterval(countdown);	
				endRound(gameInfo);
			}
		},50);
		
	}
	
	function endRound(gameInfo){
		$('#roundInfomationDiv').addClass('d-none');
		$('#roundFinishDiv').removeClass('d-none');
		$('#roundInfomationDiv').find('.progress-bar').css('width', '0%');
		
		
		
		var currentRound = app.roundNum ;
		var beatToMatch = gameInfo.roundData[currentRound].rhythm;
		
		var lastBeatTaps = normalizeTaps(taps.slice( - beatToMatch.length));
		var missMatched = 0;
		
		
		
		for(var i in beatToMatch){
			
			//skip the first beat, because it always matches perfectly ( its just 0 and 0)
			if(beatToMatch[i] == 0){
				continue;	
			}
			
			var diff = 	Math.abs(beatToMatch[i] - lastBeatTaps[i]);
			
			missMatchPercent = (1 - (diff/beatToMatch[i])) * 100;	
			missMatched  +=  missMatchPercent;
			console.log(	beatToMatch[i], lastBeatTaps[i], diff, missMatchPercent + '%');
		}
		//sum all scores and divide by length of scores
		var score = missMatched/(beatToMatch.length - 1);
		score = score.toFixed(2);
		console.log(score);
		
		console.log(beatToMatch,lastBeatTaps,missMatched);
		
		var scoreRef = firebase.database().ref('games/' + app.gameID + '/roundData/' + app.roundNum); 
		scoreRef.on('value',function(snapshot){
			app.currentRoundData = snapshot.val();
		});
		
		//game info being called multiple times
		
		/*
		// + app.myPlayer +'/scores');
		var scoreRef = firebase.database().ref('games/' + app.gameID + '/players/'); 
		scoreRef.on('value',function(snapshot){

		
					
				var roundEndTime = Date.now() + 20 * seconds;
			
				
				//app.playerData = snapshot.val();
				
				
				for (playerName in playerData){
					
					if(	playerData[playerName].hasOwnProperty('scores') && playerData[playerName]['scores'].hasOwnProperty(currentRound)) {
						var thisBPM = playerData[playerName]['scores'][currentRound]['BPM'];
						var thisScore = playerData[playerName]['scores'][currentRound]['score'];
						thisBPM = thisBPM.toFixed(1);
						//$('#roundFinishDiv').find('	[data-player='+playerName+']').html(playerName + ' - ' + thisBPM + ' BPM'); 
						$('#roundFinishDiv').find('	[data-player='+playerName+']').html( thisBPM + ' BPM for ' + thisScore + ' points!'); 
						$('#roundFinishDiv').find('	[data-player='+playerName+']').css('width', thisScore * 0.75 + '%');
					}
				}
				
				
				var endRoundTimer = setInterval(function(){
						
						
						if(Date.now() > roundEndTime){
							if(app.roundNum != currentRound){return;}
							clearInterval(endRoundTimer);
							$('#roundFinishDiv').addClass('d-none');
							
							if(host){ 
								if(roundsToPlay > app.roundNum){
									firebase.database().ref('games/' + app.gameID).update({
										'round':app.roundNum +1,
									});
								}
								else{
									firebase.database().ref('games/' + app.gameID).update({
										'round':-1,
									});
								}
							}
						}
				},500);
				
		});
		
	
		var myScore = 1000;
		if(lastTenTaps.length >= 2){
			var diff =  lastTenTaps[lastTenTaps.length -1] - lastTenTaps[0];
			var averageTap = diff/lastTenTaps.length;
			BPM = 60000/averageTap;	
			myScore = Math.abs((app.bpm/BPM * 100) - 100).toFixed(0);	
		}
		
		
		
		if(myScore == 0){
			myScore = 100;	
		}
		else{
			//how many points per percentage you lose
			var scaleFactor = 5;
			myScore = 90 - (scaleFactor * myScore);	
			myScore = Math.max(0,myScore);
		}
		*/
		
		//var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/players/' + app.myPlayer +'/scores/' + currentRound).update({
		var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/roundData/' + currentRound   +'/scores/' + app.myPlayer ).update({
			 'score':score,
	  	});	
		
		
		var roundEndTime = Date.now() + 20 * seconds;
		var endRoundTimer = setInterval(function(){
					
					
					if(Date.now() > roundEndTime){
						clearInterval(endRoundTimer);
						
						
						$('#roundFinishDiv').addClass('d-none');
						
						if(app.roundNum != currentRound){return;}
						
						if(host){ 
							if(roundsToPlay > app.roundNum){
								firebase.database().ref('games/' + app.gameID).update({
									'round':app.roundNum +1,
								});
							}
							else{
								firebase.database().ref('games/' + app.gameID).update({
									'round':-1,
								});
							}
						}
						
					}
			},500);
		
			
	}
	
	
	function endGame(gameInfo){
		
		console.log("Game Complete");	
		
	}



