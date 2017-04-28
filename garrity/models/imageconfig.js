
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var mixSchema = new Schema({},{ "strict": false });

var configSchema = new Schema  ({
	configName : String,
	mins : mixSchema,
	orderArray : mixSchema,
	html : String,
	css : String
});



var Config = mongoose.model('imageconfig', mixSchema);

module.exports = Config;