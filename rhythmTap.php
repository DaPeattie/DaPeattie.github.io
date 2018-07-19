

<!DOCTYPE html>

<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Website</title>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<link href="images/icons/icon128.png" rel="icon" sizes="128x128"/>
<link rel="stylesheet"  type="text/css" href="css/main.css" />




</head>
<body>


<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
  <!-- Navbar content -->
	<ul class="navbar-nav ">
        <li class="nav-item ">
          <a class="nav-link" href="/test">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">Code<span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="photography">Photography</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="contact">Contact</a>
        </li>
	</ul>
</nav>

<div id="preGame">
    <button  type="button" class="btn btn-success btn-lg btn-block" id="newGameBtn">New Game</button>
    <br>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Game ID" aria-label="Game ID" aria-describedby="basic-addon2" id="joinGameID" maxlength="4" >
      <div class="input-group-append">
        <button class="btn btn-primary btn-lg btn-block" type="button" id="joinGameBtn">Join Game</button>
      </div>
    </div>
</div>


<div id="app" class="d-none">
	<h6 class="text-center">Game ID : {{ gameID }}</h6>
    
  	
    
    
    <div id="setPlayerNameDiv" class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Enter Your Name" aria-label="Enter Your Name" aria-describedby="basic-addon2" id="playerName"  >
      <div class="input-group-append">
        <button class="btn btn-primary btn-lg btn-block" type="button" id="setPlayerName" disabled>Set</button>
      </div>
    </div>
    
    
    <h1 id="countDownIndicator" class="text-center d-none" >{{ countdown }}</h1>
    
    <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="player in players">
          {{ player }}
        </li>
    </ul>
    
    
    <div id="roundInfomationDiv" class="d-none">
    	<h1 class="text-center" >Round {{ roundNum }}</h1>
        <h6 class="text-center">Tap to the BPM of</h6>
        <h2 class="text-center">{{songName}}</h6>
        <h4 class="text-center">{{songArtist}}</h6>
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="transition:width 0.05s ease;"></div>
        </div>
        <br>
        <button id="tapButton" type="button" class="btn btn-secondary btn-lg btn-block" style="height: 350px;">Tap</button>
    </div>
    
    
    <div id="roundFinishDiv" class="d-none">
    	<h1 class="text-center" >Round {{ roundNum }} Results</h1>
        <h2 class="text-center">{{songName}}</h6>
        <h4 class="text-center">has {{bpm}} BPM</h6>
        
    	<div v-for="player in players">
        	<div class="progress" style="height:30px">
            	<label class="progress-label" style="font-size: large;">{{player}}:</label>
            	<div class="progress-bar text-nowrap text-dark" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"  v-bind:data-player="player"></div>
            </div>
    	</div>
        
    </div>
    
</div>


<script src="https://www.gstatic.com/firebasejs/5.2.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA2gCUoIGy-1P-WXG1yUrlbSs5vUQgfMKo",
    authDomain: "rhythmtap-5e11f.firebaseapp.com",
    databaseURL: "https://rhythmtap-5e11f.firebaseio.com",
    projectId: "rhythmtap-5e11f",
    storageBucket: "rhythmtap-5e11f.appspot.com",
    messagingSenderId: "719154254496"
  };
  firebase.initializeApp(config);
</script>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<!-- development version, includes helpful console warnings -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<!-- Google Analytics -->

<script>

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
		myPlayer: '',
		songName:'',
		songArtist:'',
		roundNum:'',
		bpm:0,
	  
	  }
	});

	var seconds = 1000;
	var host = false;
	var availableSongs = 11;
	var taps = [];
	
	var songsRef = {};
	var roundsToPlay = 5;
	
	
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
		//var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/players/playerName').update(playerName);
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
			startTime : Date.now() + 5 * seconds,
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
			
			app.players = [];
			for(player in gameInfo.players){
				app.players.push(player);
			}
			
			
			
			if(gameInfo['round'] == -1){
				endGame();	
			}
			if(gameInfo['round'] > 0 && app.roundNum != gameInfo['round'] ){
				$('#app ul').addClass('d-none');
				beginRound(gameInfo);
			}
			
			$('#app').removeClass('d-none');
		});
		
		var countdown = setInterval(function(){
			
			var startingIn = Math.round((gameInfo.startTime - Date.now())/1000);
			
			app.countdown = 'Game Starts in ' + startingIn;
	
			
			
			//when the countdown ends
			if( startingIn < 1){
				app.countdown = 'Game Starts in ' + 0;
				clearInterval(countdown);
				startGame(gameID);					
			}
			
		},500);
		
	}
	
	
	
	
	
	function startGame(gameID){
		
		if(host){
			firebase.database().ref('games/' + gameID).update({
				state:'playing',
				'round': 1,
			});				
		}
		
		$('#countDownIndicator').addClass('d-none');

	}
	
	function beginRound(gameInfo){
		taps = [];
		app.roundNum =  gameInfo['round'];
		if(app.myPlayer != ''){
			$('#roundInfomationDiv').removeClass('d-none');
		}
		
		var currentSong = songsRef[gameInfo.sequence[app.roundNum - 1]];
		
		app.songName = currentSong.title;
		app.songArtist = currentSong.artist;
		app.bpm = currentSong.bpm;
		
		var roundSeconds = 3 * seconds;
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
		
		var lastTenTaps = taps.slice(1).slice(-10);
		var currentRound = app.roundNum ;
		var BPM = 0;
		
		
		
		var scoreRef = firebase.database().ref('games/' + app.gameID + '/players/'); // + app.myPlayer +'/scores');
		scoreRef.on('value',function(snapshot){

		
					
				var roundEndTime = Date.now() + 3000;
			
				var playerData  = snapshot.val();
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
		
		//var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/players/playerName').update(playerName);
		var pushPlayerKey = firebase.database().ref('games/' + app.gameID + '/players/' + app.myPlayer +'/scores/' + currentRound).update({
			 'BPM' : BPM,
			 'score':myScore,
	  	});	
		
	
			
	}
	
	
	function endGame(gameInfo){
		
		console.log("Game Complete");	
		
	}


/*
	//this is how to add songs
	firebase.database().ref('songs').update({
		
			0: {	title:"God's Plan",
					artist:'Drake',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			1: {	title:'No Tears Left To Cry',
					artist:'Ariana Grande',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			2: {	title:'Psycho',
					artist:'Post Malone',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			3: {	title:'This Is America',
					artist:'Childish Gambino',
					bpm:'95',
					youtube:'www.youtube.com'},
										
			4: {	title:'Gangnam Style',
					artist:'Psy',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			5: {	title:"Girl's Like You",
					artist:'Maroon 5 feat. Cardi B',
					bpm:'95',
					youtube:'www.youtube.com'},
			
								
			6: {	title:'Better Now',
					artist:'Post Malone',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			7: {	title:'One Kiss',
					artist:'Calvin Harris and Dua Lipa',
					bpm:'95',
					youtube:'www.youtube.com'},
			
								
			8: {	title:'Youngblood',
					artist:'5 Seconds of Summer',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			9: {	title:'Lovely',
					artist:'Billie Eilish and Khalid',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			10: {	title:'Jackie Chan',
					artist:'Tiesto, Dzeko, Preme, Post Malone',
					bpm:'95',
					youtube:'www.youtube.com'},
					
			11: {	title:'Nevermind',
					artist:'Dennis Lloyd',
					bpm:'95',
					youtube:'www.youtube.com'},
			
			
	  	});	


*/

</script>
<!-- End Google Analytics -->
</body>
</html>