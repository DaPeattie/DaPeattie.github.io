
 <!-- 
<div class="menuBar"> 
	<div class="menuButton" id="mainMenuButton"></div>
</div>

<div class="quarterCircleMenu menuHidden">
    <div class="menuBlock1">
        <div class="menuItem"></div>
        <div class="menuItem"></div>
        <div class="menuItem"></div>
        <div class="menuItem"></div>
    </div>


	<div class="menuBlock2"></div>
</div>

<div class="binaryClock">
	<div class="fourHigh" id="BCHoursTens">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        
    </div>
	<div class="fourHigh" id="BCHoursOnes">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        
    </div>
    <div class="fourHigh" id="BCMinutesTens">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        
    </div>
    <div class="fourHigh" id="BCMinutesOnes">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        
    </div>
    <div class="fourHigh" id="BCSecondsTens">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
    </div>
    <div class="fourHigh" id="BCSecondsOnes">
    	<div class="digit"></div>
    	<div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>

    </div>
    <div class="fourHigh" id="BCTenths">
    	<div class="digit"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>
        <div class="binaryBox"></div>

    </div>
</div>

</body>

<script src="scripts/jquery-3.1.1.min.js"></script>
<script>



$('.menuButton').click(menuBar_click);
function menuBar_click(e){
	
	if($('.menuHidden').length > 0){
		$('.quarterCircleMenu').removeClass('menuHidden');
	}
	else{
		$('.quarterCircleMenu').addClass('menuHidden');
	}
	
}

$(document).mouseup(document_mouseup);
function document_mouseup(e){
	
	if($(e.target).attr('id') != 'mainMenuButton'){
		$('.quarterCircleMenu').addClass('menuHidden');
	}
	
}

var loadTime = Date.now();// - (6  * 60 * 600000);
var timerObject = {};
setInterval(function(){
	var today = new Date(Date.now() - loadTime);
	var timeSinceLoad = Date.now() - loadTime;
	
	//var days = Math.floor(timeSinceLoad/(24 * 60 * 60000));
	//timeSinceLoad -= days  * 24 * 60 * 60000;
	
	var hoursTens =  Math.floor(timeSinceLoad/(60 * 600000));
	timeSinceLoad -= hoursTens  * 60 * 600000;
	
	var hoursOnes =  Math.floor(timeSinceLoad/(60 * 60000));
	timeSinceLoad -= hoursOnes  * 60 * 60000;
	
	var minutesTens = Math.floor(timeSinceLoad/ 600000);
	timeSinceLoad -= minutesTens  * 600000;
	
	var minutesOnes = Math.floor(timeSinceLoad/ 60000);
	timeSinceLoad -= minutesOnes  * 60000;
	
	var secondsTens = Math.floor(timeSinceLoad/ 10000);
	timeSinceLoad -= secondsTens  * 10000;
	
	var secondsOnes = Math.floor(timeSinceLoad/ 1000);
	timeSinceLoad -= secondsOnes  * 1000;
	
	var tenths = JSON.stringify(timeSinceLoad);
	
	if(tenths.length == '3'){
		tenths = parseInt(tenths[0]);	
	}
	else{
		tenths = 0;	
	}
	
	timerObject.hoursTens = hoursTens;
	timerObject.hoursOnes = hoursOnes;
	timerObject.minutesTens = minutesTens;
	timerObject.minutesOnes = minutesOnes;
	timerObject.secondsTens = secondsTens;
	timerObject.secondsOnes = secondsOnes;
	timerObject.tenths = tenths;
	
	
	
	var decimalTimes = [hoursTens,hoursOnes, minutesTens, minutesOnes, secondsTens, secondsOnes,tenths];
	var binaryTimes = [];
	
	for(i in decimalTimes){
		binaryTimes.push(padToFour(decimalTimes[i].toString(2))); 	
	}
	

	
	
	$('.binaryClock .fourHigh').each(function(index,element){

		$(element).children('.binaryBox').each(function(subIndex,subElement){
			$(element).find('.digit').html(decimalTimes[index])
			if(binaryTimes[index][subIndex] == '1'){
				$(subElement).css('background-color','purple');
			}
			else{
				$(subElement).css('background-color','White');
			}
			
			
			
		});
		
		
	});
	
	//console.log(days,hours,minutesTens,minutesOnes,secondsTens,secondsOnes,tenths);

	
}, 100);




function padToFour(number) {
  if (number<=9999) { number = ("000"+number).slice(-4); }
  return number;
}


</script>

-->
