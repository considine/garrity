
function initPost (id) { 

	$.get('/postcontent/' + id, function (resp) {
		$("#postcontent").html(resp.body);
		$("#author").html( $("#author").html() + "By: " + resp.author);
		$("#posttime").html($("#posttime").html() +  "Written: " + resp.time);
		$( ".ql-editor p" ).first().addClass("lead");
		$("#posttitle").html(resp.title);

		if (resp.featuredImage) {
			$("#featuredImageContainer").css("display", "block");
		}
		if (resp.imageId) {
			$.get('/featuredImage/' + id, function (resp) {
				$("#featuredimage").css("background-image", "url('/uploads/images/" + resp.imgname +"')");
				var style = document.createElement('style')
			    style.type = 'text/css'
			    style.innerHTML = resp.css;
			    document.getElementsByTagName('head')[0].appendChild(style)

			});
		}
	});


}