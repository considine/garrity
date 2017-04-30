
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
	The attributes that  articles  blogs and pages all share
*/
var contentBase = {

	body: String,
	title: String,
	text : String,
	lastEdited : {type : Date, default : Date.now},
	time : { type : Date, default: Date.now },
	slug : String
};

/*
	The attributes that are used on both blogs and pages. 
	Can be seen as an intermediate inheritance from base class,
	this excludes pages
*/
var postextras = {
	author: String,
	imageId : {type: Schema.Types.ObjectId, ref : 'featuredimage'},
	published : {type : Boolean, default : false},
	upToDate : {type : Boolean, default : false},
	featuredImage : {type : Boolean, default : false},
	views : {type : Number, default: 0}
};
/*
	The attributes that only blogs use
*/
var bextras = {
	
	mailed : {type : Boolean, default : false}

};
/*
	The attributes that articles use, only
*/
var aextras = {
	// either Main, Secondary1, Secondary2, Third, Or none
	frontpageStatus : {type : String, default : "none"}
};
/*
	The attributes that pages use, only
*/
var pageextras = {

};
/*
	Create the blog & article schemas from base + extras 
*/
var postextras = mergeAttributes(contentBase, postextras);
var blogSchema = new Schema(mergeAttributes(postextras, bextras));
var articleSchema = new Schema(mergeAttributes(postextras, aextras));
var pageSchema = new Schema(mergeAttributes(contentBase, pageextras));
/* 
	Package both schemas into, and export
*/
var models = {
  blog : mongoose.model('blogPost', blogSchema),
  article : mongoose.model('articlePost', articleSchema),
  page : mongoose.model('page', pageSchema)
};


console.log(JSON.stringify(mergeAttributes(contentBase, pageextras)));
module.exports =  models;

function mergeAttributes (base, extra) {
	var newbase = {};
	for (var key in base) {
		if (base.hasOwnProperty(key)) {
			newbase[key] = base[key];
		}
	}
	for (var key in extra) {
		if (extra.hasOwnProperty(key)) {
			newbase[key] = extra[key];
		}
	}
	return newbase;
}
