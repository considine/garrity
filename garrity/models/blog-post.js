
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var blogSchema = new Schema({ 
	body: String,
	views : {type : Number, default: 0},
	title: String,
	text : String,
	published : {type : Boolean, default : false},
	upToDate : {type : Boolean, default : false},
	article : {type : Boolean, default : false},
	author: String,
	featuredImage : {type : Boolean, default : false},
	imageId : String,
	lastEdited : {type : Date, default : Date.now},
	time : { type : Date, default: Date.now }
});


var bschema =  new Schema ({
	article : {type : Boolean, default : false},
	featuredImage : {type : Boolean, default : false}
});


// the schema is useless so far
// we need to create a model using it
var BlogPost = mongoose.model('blogPost', blogSchema);
var models = {
  blog : mongoose.model('blogPost', blogSchema)
};
module.exports =  models;
	// make this available to our users in our Node applications
