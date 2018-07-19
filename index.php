<!DOCTYPE html>

 
<html><head>
<meta charset="utf-8">
<title>Website</title>


<link href="images/icons/icon128.png" rel="icon" sizes="128x128"/>
<link rel="stylesheet"  type="text/css" href="css/main.css" />
</head>
<body>

<div class="menuBar"> 
	<div class="menuButton" id="mainMenuButton"></div>
    
</div>

<div class="quarterCircleMenu menuHidden">
<div class="menuBlock1"></div>
<div class="menuBlock2"></div>
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


</script>
</html>