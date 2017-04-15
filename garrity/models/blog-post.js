var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var blogSchema = new Schema({ 
	body: String,
	title: String,
	time : { type : Date, default: Date.now }
});


// the schema is useless so far
// we need to create a model using it
var BlogPost = mongoose.model('blogPost', blogSchema);

// make this available to our users in our Node applications
module.exports = BlogPost;