 var clicking = false;
       


var screenSize = getScreenWidth();
var sizes = ["xs", "sm", "md", "lg"];
var posArray = {};


// todo: replace ugly  class references with some json map at the beginning

function nextImage () {
    // block on set perc, then do the rest
    // via ugly callback
     console.log("bg width is " + currentConfig["bgWidth"]);
    setPerc (function () {
        $('.image-holder-wrapper-' + currentCont + "-" + currentSize).css('display', "none");
        if (getNextConfiguration()) {
            $('.image-holder-wrapper-' + currentCont + "-" + currentSize).css('display', "block");
            currentConfig["posX"] = 0;
            currentConfig["posY"] = 0;
            setMinBackgroundParams();
        }
        else {
            saveIMG();
            
        }
    });
    
}

function setPerc (fun) {
    console.log(JSON.stringify(posAndArticleArray));
    getRatio (function (h, w) {
        var rat = h / w;
        
        var imgHeight = rat*currentConfig["bgWidth"];
        var percY;
        var percX;
        if ( $('#' + currentCont + "-" + currentSize).width() == currentConfig["bgWidth"]) {
            percX = 0;
        }else {
            var percX = 100 * currentConfig["posX"] / ( $('#' + currentCont + "-" + currentSize).width() - currentConfig["bgWidth"]);

        }
        if ($('#' + currentCont + "-" + currentSize).height() - imgHeight == 0) {
            percY = 0;
        }
        else {
            percY = 100 * currentConfig["posY"] / ( $('#' + currentCont + "-" + currentSize).height() - imgHeight);
        }
        currentConfig["bgPerc"] = percX + "% " + percY + "%";

        fun(); 
    });
}
function getObj () { 
     var pos_obj = {
        "posX" : 0,
        "posY"  : 0,
        "startX" : 0,
        "startY" : 0,
        "lastX" : 0,
        "lastY" : 0,
        "bgHeight" :  300,
        "bgWidth" :  300,
        "bgPerc" : 0 // set before stoarge

    };
    return pos_obj;
}

function getImageFile () {
    var background = new Image();
    background.src = getBackgroundSrc();
    // alert(background.src.split("/"));
    var strInd = background.src.split("/").length-1;
    return background.src.split("/")[strInd];

}

function getBackgroundSrc () {
    
    return document
                    .getElementsByClassName('image-holder')[0]
                     .style
                      .backgroundImage
                       .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
                        .split(',')[0];
    
}



var articleTypes = {"main" : ["lg", "md", "sm", "xs"], "scnd" : ["lg", "md", "sm", "xs"], "thrd" : ["xs"]};
// so we know whats next
var orderArray = [];
for (var key in articleTypes) {
    if (articleTypes.hasOwnProperty(key)) {
        for (var i=0; i<articleTypes[key].length; i++) {
            var val =articleTypes[key][i];
            var tm = {};
            tm[key] = val;
            orderArray.push(tm);  
        }
    }
}


getObj();

var posAndArticleArray = {};
for (var key in articleTypes) {
    posAndArticleArray[key] = {};
    if (articleTypes.hasOwnProperty(key)) {
        for (var i=0; i<articleTypes[key].length; i++) {
            posAndArticleArray[key][articleTypes[key][i]] = getObj();
            
        }
    }
}
function getNextConfiguration () {
    // first try within this article type
    for (var i=0; i<orderArray.length-1; i++) {
       
        if (orderArray[i][currentCont] ==currentSize) {
            //todo make this more element
            for (var key in orderArray[i+1]) {
                currentCont = key;
                currentSize = orderArray[i+1][key];
            }
            currentConfig = posAndArticleArray[currentCont][currentSize]; 
            return true;
        }
    }   
    return false; // done
}

$('#next-image').click(nextImage);
var currentCont = "main";
var currentSize = "lg";
var currentConfig  = posAndArticleArray[currentCont][currentSize];
setScreenParams();$('#' + currentCont + "-" + "md").css("background-size", posAndArticleArray[currentCont]["md"]["bgWidth"] + "px");    

setMinBackgroundParams();
// setScreenParams();
posArray["imgName"] = getImageFile();

$('.image-holder').mousedown(function(e){
    clicking = true;
    // alert(screenSize);
    currentConfig["startX"] = e.offsetX - currentConfig["lastX"];
    currentConfig["startY"] = parseInt(e.offsetY) - parseInt(currentConfig["lastY"]);
});

function updateScreenAndCatch () {
    
    if (currentConfig["posX"] > 0) {
        currentConfig["posX"] = 0;
    }
    if (currentConfig["posY"] > 0) {
        currentConfig["posY"] = 0;
    }
    getRatio(function(h, w) {
       
        var hf = $('#' + currentCont + "-" + currentSize).height();
        var wf = $('#' + currentCont + "-" + currentSize).width();
       
        var ratio = h/w;
        var equivHeight = currentConfig["bgWidth"] * ratio;
       
        if (currentConfig["posX"] + currentConfig["bgWidth"] < wf) {
            currentConfig["posX"] = -1  * currentConfig["bgWidth"] + wf;
        }
        if (currentConfig["posY"] + equivHeight < hf) {
           
            currentConfig["posY"] = -1 * ( currentConfig["bgWidth"] * ratio - hf );
            // currentConfig["posY"] =  - hf;
        }
        currentConfig["lastX"] = currentConfig["posX"];
        currentConfig["lastY"] = currentConfig["posY"];
        setScreenParams();
    });
}
$(document).mouseup(function(e){
    if(clicking == false) return;
    clicking = false;

    updateScreenAndCatch();
})

$('.image-holder').mousemove(function(){
    if(clicking == false) return;

    currentConfig["posX"] =  event.offsetX -  currentConfig["startX"];

    currentConfig["posY"] =  event.offsetY - currentConfig["startY"];
   console.log("dragged");
    setScreenParams();
  
});
$(".zoom-out-button").click(function () {


    var increment;
    if (currentSize == "sm" || currentSize == "xs")
        increment = 50;
    else increment = 100;
    currentConfig["bgWidth"] += increment;
    
   setScreenParams();
});

function checkDimensions(increment) {
    // check height and width
    // get frame height and width
    // get ratio of widht and height of image
    getRatio (function(h, w) {
        var ratio = h/w;
        var hf = $('#' + currentCont + "-" + currentSize).height();
        var wf = $('#' + currentCont + "-" + currentSize).width();
        while (currentConfig["bgWidth"] - increment < wf && increment > 0) {
            increment -=1;
        }
        if (increment ==0) {
            alert ("Zoomed out maximum amount. Anymore will leave part of frame empty");
            return;
        }
        var equivHeight = currentConfig["bgWidth"] * ratio;
        while (equivHeight - increment * ratio < hf && increment > 0) {
            increment -=1;
        }
        if (increment ==0) {
            alert ("Zoomed out maximum amount. Anymore will leave part of frame empty");
            return;
        }
    currentConfig["bgWidth"] -=  increment;
    setScreenParams();

        
    });

}
$(".zoom-in-button").click(function () {
   var increment;
    if (currentSize == "sm" || currentSize == "xs")
        increment = 50;
    else increment = 100;

    checkDimensions(increment);
    updateScreenAndCatch();
});


function setScreenParams () {
    var posXpx =currentConfig["posX"] + 'px';

    var percX = 100* (currentConfig["posX"] + currentConfig["bgWidth"]/2) / $('#' + currentCont + "-" + currentSize).width();
    // console.log (percX);
    var posYpx = currentConfig["posY"] + 'px';
    // alert(posX, posY);
    var newHeight =currentConfig["bgHeight"] + 'px';
    var newWidth = currentConfig["bgWidth"] + 'px';
    
    $('#' + currentCont + "-" + currentSize).css('background-position-x', posXpx);
    // $('#' + currentCont + "-" + currentSize).css('background-position-x', percX + "%");
    console.log('#' + currentCont + "-" + currentSize);


    $('#' + currentCont + "-" + currentSize).css('background-position-y',  posYpx);
    
   
    $('#' + currentCont + "-" + currentSize ).css("background-size", newWidth);
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

// we have startX, and background position size!


function updateBar (barId) {
    $('.screen-size-indic').removeClass('active');
    $("#" + barId).addClass('active');
}


function saveIMG () {
    posAndArticleArray["img"] = getImageFile();
    $.ajax({
        url: './saveimg',
        type: "POST",
        contentType: 'application/json', 
        data : JSON.stringify(posAndArticleArray), 
        success : function () {
        alert("Your shit was saved")}
    });

}




function getRatio (func) {
    var background = new Image();
    background.src = getBackgroundSrc()
    $(background).load(function () {
         
        var h = background.height;
        var w = background.width;
        func(h, w);
       
    });
}




function setMinBackgroundParams () {
    
    getRatio (function(h, w) {
        
        var ratio = h/w;
        var hf = $('#' + currentCont + "-" + currentSize).height();
        var wf = $('#' + currentCont + "-" + currentSize).width();

        var frame_ratio = hf/wf;
        // see which is greater
        if (frame_ratio < ratio) {
            // means that the width for the frame ratio is the limitign factor
            currentConfig["bgWidth"] = wf;
            currentConfig["bgHeight"] = wf * ratio;
            
        }
        else {
            console.log("bg width is " + currentConfig["bgWidth"]);
            currentConfig["bgWidth"] = Math.ceil(hf / ratio);
            currentConfig["bgHeight"] = hf;
        }   
       
        setScreenParams();
    });
     // $('#' + currentCont + "-" + currentSize).css("background-size", "cover");
}
