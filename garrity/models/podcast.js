var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var podcastSchema = new Schema ({
	_id : String,
	version: Number,
	type: String,
	provider_name: String,
	provider_url: String,
	height: Number,
	width: String,
	title: String,
	description: String,
	thumbnail_url: String,
	html: String,
	author_name: String,
	author_url: String
});

// id is the author_url
var Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;
