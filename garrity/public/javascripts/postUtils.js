var editor;
var content = {};
function getContent(publish, cb) {
	var i  = document.getElementById('editor').innerHTML;
	var myRegexp = /<img src="data.*?"/g;
	var match; 
	var dat = {};
	dat["info"] = [];
	while ( match = myRegexp.exec(i) ) {
		dat["info"].push(match[0].replace("src=\"", "").replace(/\"$/, ""));
	}
	var delta = JSON.stringify(editor.getContents());
	$.ajax({ 
		type: "POST", 
		url : "/admin/savedataimg", 
		data: JSON.stringify(dat), 
		contentType: "application/json; charset=utf-8", 
		dataType: "json",
		success: function (data) {
			if (data.data.length != dat["info"].length) throw "Not all images saved ";
			dat["imgs"] = data.data;
			for (var j=0; j<dat["info"].length; j++) {	
				var replaced = dat["info"][j].replace("<img ", "");
				i = i.replace(replaced, "/uploads/emailImages/" + data.data[j]);
				delta = delta.replace(replaced, "/uploads/emailImages/" + data.data[j]);
			}
			content["text"] = delta;
			content["publish"] = publish;
 			content["author"] = $("#postAuthor").val();
			if (publish) {
				content["body"] = i.replace(/<input.*?>/, "").replace(/contenteditable=\".*?\"/, "");
			}
			console.log(publish + " IS publish");
			cb();
		}
	});

	return content;
}
function deletePost (id) {
	$.ajax ({
		type: "DELETE",
		url : "/admin/data/blog/" + id,
		success : function (resp) {
			$("#" + id).remove();
			console.log(resp);
		}
	});
}
//HORRENDOUS workaround!
$('#titleInput').click(function () {
	setTimeout(function(){
            $("#titleInput").focus();},100);
	
});
function Callback(data)
     {
        alert(JSON.stringify(data));
     }
function initQuill () {
	var Font = Quill.import('formats/font');
	// We do not add Aref Ruqaa since it is the default
	Font.whitelist = ['mirza', 'roboto', 'oswald', 'comic sans ms'];
	Quill.register(Font, true);

	editor = new Quill('#editor', {
	modules: { toolbar: '#toolbar' },
	theme: 'snow'
	});
}
function loadFeaturedImage(id) {
	// get image based on id
	$.get("/featuredImage/" + id, function (resp) {
		
		refreshContent(false);
		// setFeaturedImage(id);
	});

}
function refreshContent (publish) {
	function cb () {
		$.ajax ({
			url: '/admin/data/blog/' + content._id,
			dataType: "json",
			contentType: "application/json; charset=utf-8",  
			type : 'PUT',
			data: JSON.stringify(content), 
			success : function(data) {
				console.log("FROM SUCCESS");
				try {
					publish ? showMessage("publish_success") : showMessage("save_success");
				} catch (err) {
					//pass
					console.log(err);
				}
				
			},
			error : function (err) {
				console.log("FROM SUCCESS");
				try {
					publish ? showMessage("publish_error") : showMessage("save_error");
				} catch (err2) {
					//pass
					console.log(err2);
				}
			},
			complete : function () {
				console.log("done!");
				
				// setFeaturedImage(id);
			}

		});
	}
	getContent(publish, cb);
}
$("#title-input").keyup(function () {
	content.title = $(this).val();
	console.log(content);
});
// function called when featured image is saved
function setFeaturedImage(id) {
	$.get('/featuredImage/' + id, function (resp) {
		console.log("/uploads/images/" + resp.img);
		$("#featured-image").html("<img style='width : 100%;' src='" + "/uploads/images/" + resp.img +"'>");
		content.imageId = id;
		// refreshContent(false);
	});
}
function fillEditContent (id) {
	var post = $.get("/admin/data/blog/" + id, function (resp) {
		var body = resp.text;

		if (resp[0].text) {
			editor.setContents(JSON.parse(resp[0].text));
		}
		console.log(resp[0]);
		if (resp[0].imageId) {
			
			setFeaturedImage(resp[0].imageId);
		}
		if (resp[0].title) {
			$("#title-input").val(resp[0].title);
		}
		if (resp[0].author) {
			$('#postAuthor').val(resp[0].author);
		}

		content = resp[0];
		
	});
}
$("#toolbar").css("display", "block");
