var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var childSchema = new Schema({ 
	posX: Number,
	posY: Number,
	startX: Number,
	startY : Number,
	startX : Number,
	lastX : Number,
	lastY : Number,
	bgHeight : Number,
	bgWidth : Number
});

var mainSchema = new Schema({
	"xs" : childSchema, 
	"sm" : childSchema,
	"md" : childSchema,
	"lg" : childSchema,
	"imgName" : String 

});

// the schema is useless so far
// we need to create a model using it
var ImageModel = mongoose.model('articleImage', mainSchema);

// make this available to our users in our Node applications
module.exports = ImageModel;