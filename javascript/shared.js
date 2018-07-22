// JavaScript Document

var thisPath = window.location.pathname.split('/');
var thisFolder = 'Home';

if(thisPath.length > 1){
	thisFolder = thisPath[1];
}
$('#webTitle').html(thisFolder);


