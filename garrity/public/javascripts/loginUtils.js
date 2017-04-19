$("#login-button").click(function () {
	console.log("Login attempt");
	// make sure the user and password are set, then send
	//    to login attempt
	var email =  $("#inputEmail").val();
	var pass = $("#inputPassword").val();

	var dat = {};
	dat["user"] = email; dat["password"] = pass;
	var datSubmit = JSON.stringify(dat);
	console.log(email);
	var emailRegexp = new RegExp(".*@.+");
	if(email && pass && /.*@.+/.test(email)) {
		$.ajax ({
			type: 'POST',
			url: '/admin/loginAttempt',
			data: JSON.stringify(dat), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json",
			success : function(data, textStatus, xhr) {
				console.log("HELLO");
				if (xhr.status == 200) {
					window.location.href = "/admin/new-post"
				}
				console.log(xhr);

			}


		});


	}



});

