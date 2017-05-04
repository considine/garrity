(function () {
	$("#add-track").click(function () {
		if (!$("#sc-url").val()) {
			$("#error-alert").css("display", "block");
			return;
		}

		$.ajax({
			type : "POST",
			url : '/admin/soundcloud',
			contentType: 'application/json', 
        	dataType: "json",
        	data : JSON.stringify({"url" : $("#sc-url").val()}),
			success : function (resp) {
				console.log(resp.success);
				$(".all-podcasts").append('<div class="podcast-holder">' + resp.success + "</div>");
			},
			error : function (resp, err) {
				
				$("#error-alert").css("display", "block");
			}



	});
			$("#sc-url").val("");
	});
})();