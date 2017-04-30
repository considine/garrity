var clicking = false;

var posArray = {};
var articleTypes;
var orderArray = [];
var posAndArticleArray = {};
var currentCont;
var currentSize;
var classNames;
var currentConfig;
var bgimage;
var contentid;


function injectVars (ArticleTypes, OrderArray, Classnames, Css, bgimg, contentId) {
    bgimage = bgimg;
    contentid = contentId;
    console.log(contentid + "From image-render")
    $('.image-holder').css("background-image", 'url(' + bgimg + ')');
    
    classNames = Classnames;
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = Css;
    document.getElementsByTagName('head')[0].appendChild(style)
    console.log(JSON.stringify(Css));

    articleTypes = ArticleTypes;
    orderArray = OrderArray;
    var posA = {};
    for (var key in articleTypes) {
        posA[key] = {};
        if (articleTypes.hasOwnProperty(key)) {
            for (var i=0; i<articleTypes[key].length; i++) {
                posA[key][articleTypes[key][i]] = getObj();
                
            }
        }
    }
    posAndArticleArray = posA;


    for (var key in orderArray[0]) {
        if (orderArray[0].hasOwnProperty(key)) {
            currentCont = key;
            currentSize = orderArray[0][key];
        }
    }
   

    currentConfig  = posAndArticleArray[currentCont][currentSize];
    
    setScreenParams();

    setMinBackgroundParams();
    // setScreenParams();

    posArray["imgName"] = getImageFile();
    $('#next-image').click(function () {
       nextImage();
        
    });
    $('.image-holder').mousemove(function(){
        if(clicking == false) return;

        currentConfig["posX"] =  event.offsetX -  currentConfig["startX"];

        currentConfig["posY"] =  event.offsetY - currentConfig["startY"];
      
        setScreenParams();
      
    });
    $(".zoom-out-button").click(function () {


        var increment = 100;
        currentConfig["bgWidth"] += increment;
        
       setScreenParams();
    });

    $('.image-holder').mousedown(function(e){
        clicking = true;
        // alert(screenSize);
        currentConfig["startX"] = e.offsetX - currentConfig["lastX"];
        currentConfig["startY"] = parseInt(e.offsetY) - parseInt(currentConfig["lastY"]);
    });

    $("#take-defaults").click(function() {
        centerRest();
    });
    $(".zoom-in-button").click(function () {
   var increment = 100;
    
    checkDimensions(increment);
        updateScreenAndCatch();
    });
    $( window ).resize(function() {
        setMinBackgroundParams();
    });

    $(document).mouseup(function(e){
        if(clicking == false) return;
        clicking = false;

        updateScreenAndCatch();
    })

}

function nextImage () {
    // block on set perc, then do the rest
    // via ugly callback

    setPerc (function () {
        $('.image-holder-wrapper-' + currentCont + "-" + currentSize).css('display', "none");
        if (getNextConfiguration()) {

            $('.image-holder-wrapper-' + currentCont + "-" + currentSize).css('display', "block");
            console.log('.image-holder-wrapper-' + currentCont + "-" + currentSize);
            currentConfig["posX"] = 0;
            currentConfig["posY"] = 0;
            setMinBackgroundParams();
        }
        else {
            saveIMG();
            done = true;
            
        } 
    });
}

function centerRest () {

    setGo();
    while (getNextConfiguration()) {
        setGo();
    }
    saveIMG();
    done = true;    
    function setGo () {
        currentConfig["bgWidth"] = "cover";
        currentConfig["posX"] = "center";
        currentConfig["posY"] = "center";
    }
}


function getBoxWidth() {
    return getBox().width();
}
function getBoxHeight() {
    return getBox().height();
}
function getBox () {
    return $('#' + currentCont + "-" + currentSize);
}

function setPerc (fun) {
   
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
        // now set the percentages of the background
        currentConfig["bgWidth"] = (100 * currentConfig["bgWidth"] / $("#" + currentCont + "-"  +currentSize).width()) + "%";
        // posAndArticleArray["height"] = h;
        // posAndArticleArray["width"] = w;
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



function setScreenParams () {
    var posXpx =currentConfig["posX"] + 'px';
    var percX = 100* (currentConfig["posX"] + currentConfig["bgWidth"]/2) / $('#' + currentCont + "-" + currentSize).width();
    var posYpx = currentConfig["posY"] + 'px';
    var newHeight =currentConfig["bgHeight"] + 'px';
    var newWidth = currentConfig["bgWidth"] + 'px';
    $('#' + currentCont + "-" + currentSize).css('background-position-x', posXpx);
    $('#' + currentCont + "-" + currentSize).css('background-position-y',  posYpx); 
    $('#' + currentCont + "-" + currentSize ).css("background-size", newWidth);
}


// $('.screen-size-indic').click(function () {
//     var myjson = {
//         "xsli": "xs",
//         "smli" : "sm",
//         "mdli" : "md",
//         "lgli" : "lg"
//     }
//     var sizes = {
//         "xs" : "200px",
//         "sm" : "300px",
//         "md" : "400px",
//         "lg" : "500px"
//     }
//     screenSize = myjson[$(this).attr("id")];
//     $(".image-holder").css("max-width", sizes[screenSize]);
//      $(".image-holder").css("height", sizes[screenSize] );
//     updateBar($(this).attr("id"));
//     setScreenParams();
// });

// we have startX, and background position size!


// function updateBar (barId) {
//     $('.screen-size-indic').removeClass('active');
//     $("#" + barId).addClass('active');
// }


function saveIMG () {
    var dataSave = {};
    dataSave["config"] = posAndArticleArray;
    dataSave["img"] = getImageFile();
    dataSave["classNames"] = classNames;
    dataSave["contentid"] = contentid;
    getRatio(function (h, w) {
        dataSave["ratio"] = h/w;
        $.ajax({
        url: '/admin/saveimg',
        type: "POST",
        contentType: 'application/json', 
        dataType: "json",
        data : JSON.stringify(dataSave), 
        success : function (resp) {
            
            try {
                // try to call function that will load this image into the box
                console.log(JSON.stringify(resp));
                loadFeaturedImage(resp.id);
            }
            catch (e) {
                //pass
            }
            $('#myModal').modal('hide');
            
            }
        });

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
          
            currentConfig["bgWidth"] = Math.ceil(hf / ratio);
            currentConfig["bgHeight"] = hf;
        }   
        setScreenParams();
    });
     // $('#' + currentCont + "-" + currentSize).css("background-size", "cover");
}
