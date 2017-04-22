
function initPost (id) { 

	$.get('/postcontent/' + id, function (resp) {
		$("#postcontent").html(resp.body);
		$("#author").html( $("#author").html() + "By: " + resp.author);
		$("#posttime").html($("#posttime").html() +  "Written: " + resp.time);
		$( ".ql-editor p" ).first().addClass("lead");
		$("#posttitle").html(resp.title);


		if (resp.imageId) {
			$.get('/featuredImage/' + resp.imageId, function (resp) {
				$("#featuredimage").css("background-image", "url('/uploads/images/" + resp.img +"')");
				

			});
		}
	});


}