
var editor;
function post () {
	// var i  = '<div style="width: 65%; min-width: 500px; max-width: 650px; margin-left: auto; margin-right: auto;">' + document.getElementById('editor').innerHTML + '<div>';
	var i  = document.getElementById('editor').innerHTML;
	var myRegexp = /<img src="data.*?"/g;
	var match; 
	var dat = {};
	dat["info"] = [];
	
	while ( match = myRegexp.exec(i) ) {
		dat["info"].push(match[0].replace("src=\"", "").replace(/\"$/, ""));
		;
	}
	//replace THEN 
	var delta = JSON.stringify(editor.getContents());
	// console.log(JSON.stringify(delta));
	
	$.ajax({ 
		type: "POST", 
		url : "/admin/savedataimg", 
		data: JSON.stringify(dat), 
		contentType: "application/json; charset=utf-8", 
		dataType: "json",
		success: function (data) {
			console.log(data.data);
			if (data.data.length != dat["info"].length) throw "Not all images saved ";
			dat["imgs"] = data.data;
			for (var j=0; j<dat["info"].length; j++) {	
				i = i.replace(dat["info"][j], data.data[j]);

			}
			dat["text"] = delta;
			dat["subject"] = "SUBJECT";
			// dat["subject"] = document.getElementById("post-title").value;
			go (dat);

		}
	});
	function go (datum) {
		console.log(datum);
		$.ajax( {
			type: "POST", 
			url : "/admin/data/blog", 
			data : JSON.stringify(datum), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json",
			sucess : function (resp) {
				alert("SUCCESS");
			}
		});
	}
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






// var toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//   ['image'],            // custom button values
//   [{ 'list': 'ordered'}, { 'list': 'bullet' }],            // text direction
//   [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//   [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
//   [{ 'font': [] }],
//   [{ 'align': [] }],

//   ['clean']                                         // remove formatting button
// ];
	
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

function fillEditContent (id) {
	var post = $.get("/admin/data/blog/" + id, function (resp) {
		var body = resp.body;
		console.log(resp[0].body);

		editor.setContents(JSON.parse(resp[0].body));
	});
}

$("#toolbar").css("display", "block");


