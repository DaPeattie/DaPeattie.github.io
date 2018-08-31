// JavaScript Document
console.log('hello from canvas.js');

//$('#mainCanvas')


var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var hWidth = canvas.width/2;
var hHeight = canvas.height/2;
ctx.translate(hWidth,hHeight);

var globalIntervalId = 0;
var numStars = 250;
var stars = [];
var frameRate = 60;
var updateSpeed = 1000/frameRate;

var speed = 1.03 ;
var zSpeed = 1.0135;


for(var i = 0; i < numStars; i++){
	stars.push(randomCord(true));
}


function drawStars(){
	var starColor = 'White';
	
	ctx.fillStyle = starColor;
	ctx.strokeStyle = starColor;

	for(i in stars){
		var coord = stars[i];
		ctx.beginPath();
		ctx.arc(coord.x,coord.y,coord.z,0,2*Math.PI);
		ctx.fill();
	}

}




function updateStars(){

	for(i in stars){
		var coord = stars[i];

		coord.x = coord.x * speed ;//* 60/frameRate;
		coord.y = coord.y * speed ;//* 60/frameRate;
		coord.z = coord.z * zSpeed ;//* 60/frameRate;
		
		if(Math.abs(coord.y) > canvas.height || Math.abs(coord.x) > canvas.width){
			stars[i] = randomCord();
		}
	}
}


function startAnimation(){
	
	var intervalId = setInterval(function(){
		ctx.clearRect(-hWidth, -hHeight, canvas.width, canvas.width);
		ctx.fillStyle = "black";
		ctx.fillRect(-hWidth, -hHeight, canvas.width, canvas.height);
		updateStars();
		drawStars();
		
	}, updateSpeed);
	
	globalIntervalId = intervalId;
	return intervalId;
}



function randomCord(firstDraw){
	var xRange = 50;
	var yRange = 50; 
	

	if(firstDraw){
	   	xRange = hWidth;
		yRange = hHeight;
	 }
	
	var coord = 
	{
		'x' : randomIntFromInterval(-xRange,xRange),
		'y'	: randomIntFromInterval(-yRange,yRange),
		'z'	: Math.random(),
	};
	
	coord.x = coord.x == 0 ? 1 : coord.x;
	coord.y = coord.y == 0 ? 1 : coord.y;
	
	//coord.x = coord.x <= hWidth ? coord.x : -(coord.x  - hWidth) ;
	//coord.y = coord.y <= hHeight ? coord.y : -(coord.y  - hHeight) ;
	
	return coord;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


$( window ).resize(canvasResize);
function canvasResize(e){
	
	$('#mainCanvas').attr('width', $(window).width());
	clearInterval(globalIntervalId);
	hWidth = canvas.width/2;
	hHeight = canvas.height/2;
	ctx.translate(hWidth,hHeight);
	startAnimation();
}


drawStars();
canvasResize();