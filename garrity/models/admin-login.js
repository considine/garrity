var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var loginSchema = new Schema({ 
	username: String,
	password: String,
	verified: {
		type: Boolean,
		default: false
	},
	time : { type : Date, default: Date.now }
});


// the schema is useless so far
// we need to create a model using it
var Login = mongoose.model('adminLogin', loginSchema);

// make this available to our users in our Node applications
module.exports = Login;