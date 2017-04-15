function post () {
	// send a request to node
	
	
	
	 
	var i  = document.getElementById('editor').innerHTML;
	

	//get image

	
	var myRegexp = /src=".*?"/g;
	var match; 
	var dat = {};
	dat["info"] = [];
	
	while ( match = myRegexp.exec(i) ) {
		dat["info"].push(match[0].replace("src=\"", "").replace(/\"$/, ""));
		;
	}
	
	console.log(dat["info"]);
	
	

	$.ajax({ 
		type: "POST", 
		url : "/savedataimg", 
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
			dat["text"] = i.replace(/<input.*?>/, "");
			dat["subject"] = document.getElementById("post-title").value;
			go (dat);
		}
	});
		
	// });

	function go (datum) {
		$.ajax( {
			type: "POST", 
			url : "/send-blog", 
			data : JSON.stringify(datum), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json"
		});
	}
}


function Callback(data)
     {
        alert(JSON.stringify(data));
     }


var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image'],
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],            // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

  var editor = new Quill('#editor', {
    modules: { toolbar: toolbarOptions },
    theme: 'snow'
  });