var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var mainSchema = new Schema({
	css : String,
	imgname : String,
	contentid : {type : String, default : "dsflksjkdlfjksdlf"},
	time : { type : Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var ImageModel = mongoose.model('featuredimage', mainSchema);

// make this available to our users in our Node applications
module.exports = ImageModel;