var styles = "";
function addStyle (newStyle) {
	console.log("new Style")
	styles+=newStyle;
}


function updateStyleSheet () {
	var css = document.createElement('style');
	css.type = 'text/css';


	if (css.styleSheet) css.styleSheet.cssText = styles;
	else css.appendChild(document.createTextNode(styles));
	document.getElementsByTagName("head")[0].appendChild(css);
}


function checkDates (d, id)  {
	// var n = d.getTimezoneOffset();
	var d = new Date(d);
	
	$('#post-time-' + id).html(d.getMonth() + "/" + d.getDate()  + "/" + d.getFullYear());
}