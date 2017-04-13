$( window ).resize(go);

go();


function go() {
	if ($( window ).width()  < 770) {
	
		$('.main-content-2').css("background-size", $( window ).width() /2);
		$('.main-content-3').css("background-size", $( window ).width() /2 );
		$('.main-content-thumbnail.story-1 ').css("background-size",  $( window ).width());

	}
	else {

		$('.main-content-2').css("background-size", "");
		$('.main-content-3').css("background-size", "");
		$('.main-content-thumbnail.story-1 ').css("background-size",  "");
	}
}
// alert("hi");