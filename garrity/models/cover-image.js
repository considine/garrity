var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var gchildSchema = new Schema({ 
	posX: Number,
	posY: Number,
	startX: Number,
	startY : Number,
	lastX : Number,
	lastY : Number,
	bgHeight : Number,
	bgWidth : Number,
	bgPerc : String
});

var middleSchema = new Schema({
	lg : gchildSchema,
	md : gchildSchema,
	sm : gchildSchema,
	xs : gchildSchema
});

var middleSchema2 = new Schema ({
	lg : gchildSchema,
	md : gchildSchema,
	sm : gchildSchema,
	xs : gchildSchema
});


var mainSchema = new Schema({
	main : middleSchema,
	scnd : middleSchema2,
	thrd : {xs : gchildSchema},
	time : { type : Date, default: Date.now },
	img : String

});

// the schema is useless so far
// we need to create a model using it
var ImageModel = mongoose.model('articleImage', mainSchema);

// make this available to our users in our Node applications
module.exports = ImageModel;