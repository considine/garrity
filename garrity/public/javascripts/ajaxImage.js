var alerts = [ 
	{
	"message" : "Post Saved!",
	"type" : "alert-success",	
	"name" : "save_success"
	},
	{
	"message" : "Post Published!",
	"type" : "alert-success",	
	"name" : "publish_success"
	},
	{
	"message" : "Error Saving post! Email jackconsidine3@gmail.com with details to fix",
	"type" : "alert-danger",
	"name" : "save_error"	
	},
	{
	"message" : "Error publishing post! Email jackconsidine3@gmail.com with details to fix",
	"type" : "alert-danger",
	"name" : "publish_error"		
	}

];

$('#image-form').submit(function(e) {
      
       e.preventDefault();


       var title = "not-necessary";
     
     $(this).ajaxSubmit({
	       data: {title: title},
	       contentType: 'application/json',
	       success: function(response){
	         $("#step2-container").html(response)
	         $("#step1").remove();   
	         // console.log(response);
	       }
	   });
	     return false;
});	


function showMessage (name) {
	$("#alerts div").addClass("gone");
	$("#" + name).removeClass("gone");

	setTimeout(function() {
        $("#" + name).addClass("gone");
    }, 3000);
}

function initAlerts () {
	var base = '<div id = "ALERT_NAME" class="gone alert alert-dismissable ALERT_TYPE" role="alert"> ALERT_MESSAGE </div>';
	var cont = "";
	for (var i=0; i<alerts.length; i++) {
		cont += base.replace("ALERT_TYPE", alerts[i]["type"]).replace("ALERT_MESSAGE", alerts[i]["message"]).replace("ALERT_NAME", alerts[i]["name"]);
	}
	$("#alerts").html(cont);
}



