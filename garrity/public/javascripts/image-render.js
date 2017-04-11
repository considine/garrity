 var clicking = false;
       


var screenSize = getScreenWidth();
// alert(screenSize);
var sizes = ["xs", "sm", "md", "lg"];
var posArray = {};
function getObj () {
    
     var pos_obj = {
        "posX" : 0,
        "posY"  : 0,
        "startX" : 0,
        "startY" : 0,
        "lastX" : 0,
        "lastY" : 0,
        "bgHeight" :  500,
        "bgWidth" :  500,
    };

    return pos_obj;
}

function getImageFile () {
    var background = new Image();
    background.src = document
                    .getElementById('image-holder')
                     .style
                      .backgroundImage
                       .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
                        .split(',')[0];
    // alert(background.src.split("/"));
    var strInd = background.src.split("/").length-1;
    return background.src.split("/")[strInd];

}

for (var i=0; i<sizes.length; i++) {
    var key = sizes[i];

    posArray[key] = getObj();
}
posArray["imgName"] = getImageFile();
console.log(JSON.stringify(posArray));

$('.image-holder').mousedown(function(e){
    clicking = true;
    // alert(screenSize);
     posArray[screenSize]["startX"] = e.offsetX - posArray[screenSize]["lastX"];
    posArray[screenSize]["startY"] = parseInt(e.offsetY) - parseInt(posArray[screenSize]["lastY"]);
});

$(document).mouseup(function(e){
    clicking = false;
    posArray[screenSize]["lastX"] = posArray[screenSize]["posX"];
    posArray[screenSize]["lastY"] = posArray[screenSize]["posY"];
})

$('.image-holder').mousemove(function(){
    if(clicking == false) return;
    posArray[screenSize]["posX"] =  event.offsetX -  posArray[screenSize]["startX"];
    posArray[screenSize]["posY"] =  event.offsetY - posArray[screenSize]["startY"];
    setScreenParams();
  
});
$("#zoom-out-button").click(function () {
    var increment;
    if (screenSize == "sm" || screenSize == "xs")
        increment = 50;
    else increment = 100;
    posArray[screenSize]["bgWidth"] += increment;
    // posArray[screenSize]["bgHeight"] +=  posArray[screenSize]["bgHeight"] / 10;
  
    
   setScreenParams();
});
$("#zoom-in-button").click(function () {
   var increment;
    if (screenSize == "sm" || screenSize == "xs")
        increment = 50;
    else increment = 100;
    // posArray[screenSize]["bgWidth"] += increment;
    // posArray[screenSize]["bgHeight"] +=  posArray[screenSize]["bgHeight"] / 10;
  
    
    posArray[screenSize]["bgWidth"] -=  increment;
    // posArray[screenSize]["bgHeight"] -= posArray[screenSize]["bgHeight"] / 10;
   
    setScreenParams();
  
});
// $( window ).resize(function() {
//     // alert("hi");
//     console.log(JSON.stringify(posArray));
//     screenSize =getScreenWidth();
//     updateBar(screenSize + "li");
//     setScreenParams();
// });

function setScreenParams () {
    var posXpx =posArray[screenSize]["posX"] + 'px';
    var posYpx = posArray[screenSize]["posY"] + 'px';
    // alert(posX, posY);
    var newHeight =posArray[screenSize]["bgHeight"] + 'px';
    var newWidth = posArray[screenSize]["bgWidth"] + 'px';

    $('.image-holder').css('background-position', ( posXpx + " " + posYpx));
    $('.image-holder').css("background-size", newWidth);
}
function getScreenWidth () {
    var w = window.innerWidth;
    if (w < 768) {
        return "xs";
    }else if (w < 970) {
        return "sm";
    }else if (w < 1170) {
        return "md";
    } else if (w >= 1170) {
        return "lg";
    }
}

$('.screen-size-indic').click(function () {
    var myjson = {
        "xsli": "xs",
        "smli" : "sm",
        "mdli" : "md",
        "lgli" : "lg"
    }
    var sizes = {
        "xs" : "200px",
        "sm" : "300px",
        "md" : "400px",
        "lg" : "500px"
    }

    screenSize = myjson[$(this).attr("id")];
    $(".image-holder").css("width", sizes[screenSize]);
     $(".image-holder").css("height", sizes[screenSize] );
    updateBar($(this).attr("id"));
    setScreenParams();

});


function updateBar (barId) {
    $('.screen-size-indic').removeClass('active');
    $("#" + barId).addClass('active');
}


$('.submitImageButton').click (function () {
    var postData = {};
    postData["img"] = posArray;
    $.ajax({
        url: './saveimg',
        type: "POST",
        contentType: 'application/json', 
        data : JSON.stringify(posArray), 
        success : function () {
        alert("Your shit was saved")}
    });

});
