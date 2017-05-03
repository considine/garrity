var configModel = require('../../models/imageconfig');

function dimensObj () {
	var configNameArticle = "Article";
	var configNameBlog = "Blog";
	var testConfig = {
		
		'.main-content-thumbnail.story-1' : {
			"lg" : {
				w : 551, h : 496, mw : "1000000px"
			},
			"md" : {
				w : 551, h : 396, mw : "1200px"
			},
			"sm" : {
				w : 470, h : 296, mw : "992px"
			},
			"xs" : {
				w : 741, h : 196, mw : "768px"
			}
		},
		
		'.secondary-content' : {
			"lg" : {
				w : 555, h : 250 , mw : "10000000px"
			},
			"md" : {
				w : 555, h : 200, mw : "1200px"
			},
			"sm" : {
				w : 495, h : 150, mw : "992px"
			},
			"xs" : {
				w : 382, h : 200, mw : "768px"
			}
		} ,
		'.blog-image-holder' : {
			"lg" : {
				w : 690, h : 230, mw : "10000000px"
			}
		}, 
	};
	var blogConfig = {
		
		'.blog-image-holder' : {
			"lg" : {
				w : 690, h : 230, mw : "10000000px"
			}
		}, 
		'.blog-image-holder-article-header' : {
			"lg" : {
				w : 160, h : 128, mw : "1000000px"
			}
			
		} 
	};

	this.configName = blogConfig;
	this.config = testConfig;

	function getClassAndMwArray (config) {
		var retArray = {};
		var i =0;
		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				i+=1;
				var t = {};
				t["class"] = key;
				t["sizes"] = {};
				for (var size in config[key]) {
					if (config[key].hasOwnProperty(size)) {
						var t2 = {};
						t2[size] = config[key][size]["mw"];
						t["sizes"][size] = config[key][size]["mw"]; 
					}
				}
				retArray["t-" + i] =  t;
			}

		}

		return retArray;
	}
	

	function htmlBuilder(config) {
		var html = "";
		var h3 = "";
		var d1 = "";
		var d2 = "";
		var ul = "<ul class=\"pager\"> <li class=\"zoom-in-button\" style = \"cursor: pointer;\"> <a> - </a> </li> <li class=\"zoom-out-button\" style = \"cursor: pointer;\"> <a> + </a> </li> </ul> "
		var i =0;
		var order = getOrderArray(config);
		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				for (var size in config[key]) {
					if (config[key].hasOwnProperty(size))  {
						var c = "Configuration #" + (i+1) + " of " + order.length; 
						h3 = "<h3 class=\"image-header\">" +c + "</h3>\n" ;
						d1 = "<div class=\"image-holder-wrapper image-holder-wrapper-" + getJsonKey(order[i])  + "-" + getJsonValue(order[i])  +"\"> D1_INNER </div>";

						d2 = "<div class=\"image-holder\" id=\"" + getJsonKey(order[i])  + "-" + getJsonValue(order[i])  + "\" style=\"background-image: url('https://tribwgntv.files.wordpress.com/2015/03/cubs_300x300.jpg'\">  </div>";
						var d1inner = h3 + d2 + ul;
						html += d1.replace("D1_INNER", d1inner);
						i +=1;
					}
				}
			}
		}
		return html;
	}

	function getJsonKey(json) {
		

		for (key in json) {
			if (json.hasOwnProperty(key)) {
				return key;
			}
		}
	}
	function getJsonValue(json) {
		for (key in json) {
			if (json.hasOwnProperty(key)) {
				return json[key];
			}
		}
	}

	function getFirstItem (config) {
		var orderArray = getOrderArray(config);
		var currentCont = getJsonKey(orderArray[0]);
		var currentSize = getJsonValue(orderArray[0]);
		
    	return '.myContainer .image-holder-wrapper-' + currentCont + "-" + currentSize + "{ display: block; }";
   
	}
	function cssBuilder(config) {
		var css = "";
		

		var maxWidth = getMaxWidth(config);
		var order = getOrderArray(config);
		var i =0;
		for (var className in config) {
			if (config.hasOwnProperty(className)) {
				for (var size in config[className]) {
					if (config[className].hasOwnProperty(size)) {
						var c = " .myContainer .image-holder-wrapper-" + getJsonKey(order[i]) + "-" + getJsonValue(order[i]) + " .image-holder { HEIGHT_AND_WIDTH }";
						var hw = "height: " + config[className][size]["h"] + "px; width: " +config[className][size]["w"] + "px;";
						
						
						var rat = config[className][size]["h"] / config[className][size]["w"];
						var widthRat = (config[className][size]["w"] / 2 ) / maxWidth;
						var adjustedWidth = widthRat * config[className][size]["w"];
						var adjustedHeight = rat * adjustedWidth;
						var hw2 = "height: " + Math.round(adjustedHeight) + "px; width: " + Math.round(adjustedWidth) + "px;";
						var mediaTag = " @media (max-width: " + Math.round(maxWidth) + "px ) { MEDIA_INNER }".replace("MEDIA_INNER", c).replace("HEIGHT_AND_WIDTH", hw2);
						c = c.replace("HEIGHT_AND_WIDTH", hw);
						c += mediaTag;
						css += c;
					}
					i+=1;
				}
			}
		}
		css += getFirstItem(config);
		
		return (css);

	}

	function getMaxWidth (config) {
		var maxWidth = 0;
		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				for (var size in config[key]) {
					if (config[key].hasOwnProperty(size)) {
						if (config[key][size]["w"] > maxWidth)
							maxWidth = config[key][size]["w"];
					}
				}
			}
		}
		return maxWidth;
	}


	function getArticleTypes (config) {
		// var testArticleTypes = {"main" : ["lg", "md", "sm", "xs"], "scnd" : ["lg", "md", "sm", "xs"], "third" : ["xs"]};
		var articleBuilder = {};
		var i =0;
		for (var key in config) {
			
			if (config.hasOwnProperty(key)) {
				i+=1;
				articleBuilder["t-" + i] = [];
				for (size in config[key]) {
					if (config[key].hasOwnProperty(size)) {

						articleBuilder["t-" + i].push(size);
					}
				}
				// console.log(naming["classes"][key]["abbrev"]);
			}
		}
		return articleBuilder;
		
	}

	function getOrderArray (config) {

		var articleTypes = getArticleTypes(config);
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
		return orderArray;
	}

	


	this.getAll = function () {
		//todo inject config and naming
		var dat = {};
		dat["orderArray"] = getOrderArray(this.config);
		dat["html"] = htmlBuilder(this.config);
		dat["articleTypes"] = getArticleTypes(this.config);
		dat["css"] = cssBuilder(this.config);
		dat["classnames"] = getClassAndMwArray(this.config);
		return dat;
	}

	
	var testArticleTypes = {"main" : ["lg", "md", "sm", "xs"], "scnd" : ["lg", "md", "sm", "xs"], "third" : ["xs"]};
	var testOrderArray = [ 
		{ main: 'lg' },
		{ main: 'md' },
		{ main: 'sm' },
		{ main: 'xs' },
		{ scnd: 'lg' },
		{ scnd: 'md' },
		{ scnd: 'sm' },
		{ scnd: 'xs' } 
	];
	var testMins = { homeless: '1200px', md: '992px', sm: '768px', xs: '0px' };

};



var d = new dimensObj();
// // // // var s = {};
// var all =d.getAll();
// all["configName"] = "Article";

// new configModel(all).save(function (err, dimens) {
// 	console.log("saved");
// });
// // });



module.exports = new dimensObj();

