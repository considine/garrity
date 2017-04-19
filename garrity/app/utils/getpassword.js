exports = module.exports = {};
var bcrypt = require('bcrypt');
var adminLogin = require('../../models/admin-login');
const saltRounds = 10;

exports.checkPassword = function (reqUser, reqPass, cb) {
	// need to get the most recent mongo password

	// bcrypt.compare(reqPass, hash, function(err, res) {
		console.log(reqUser);
    	adminLogin.findOne({username: reqUser}, {}, { sort: { 'time' : -1 } }, function(err, post) {
	    	if (err) throw ("Password retrieval Error");
	    	if (!post) {
	    		cb (false); return;
	    	}
	    	bcrypt.compare(reqPass, post.password, function(err, res) {
   				cb(res);
			});
	    	
	    });
	// });
	// return "FAILURE";
	
}

// exports.addUser = function (username, newPass) {
// 		bcrypt.genSalt(saltRounds, function(err, salt) {
// 		    bcrypt.hash(newPass, salt, function(err, hash) {
// 		       new adminLogin({username: username, password: hash}).save (function(e, req) {
// 		       		if (e) {
// 		       			console.log(e);
// 		       			cb();
// 		       		}
// 		       		else {
// 		       			console.log("Success!");
// 		       		}
// 		       });
// 		    });
// 	});
// }
exports.savePassword = function (username, newPass) {
	bcrypt.genSalt(saltRounds, function(err, salt) {
	    bcrypt.hash(newPass, salt, function(err, hash) {
	       new adminLogin({username: username, password: hash}).save (function(e, req) {
	       		if (e) {
	       			console.log(e);
	       			cb();
	       		}
	       		else {
	       			console.log("Success!");
	       		}
	       });
	    });
	});
}

