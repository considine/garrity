var request = require('request');
var mongoose = require('mongoose');	
var Podcast = require('../../models/podcast.js')
function Checker (link, res) {

		console.log(link);
		var url = 'http://soundcloud.com/oembed?format=json&url=' + link;
		console.log(url);
		request.get(
			url, 
			function (err, resp, body) {
				if (!err && resp.statusCode==200) {
					var podcast = JSON.parse(body);
					podcast._id = url
					var html = JSON.parse(body).html
					html =html.replace(/ height=\".*?\" /, ' height="100" ')
					html = html.replace(/ width=\".*?\" /, ' style="width: 85%; min-width: 350px" ');
					podcast.html = html;
					new Podcast(podcast).save(function (err) {
						if (err) res.status(500).send({err : err});
						else 
							res.send({"success" : html});
					});

					// console.log(html);
				}
				else {
					res.status(500).send({err : err});
				}
			}
		);
}


module.exports = Checker;

// Checker("https://soundcloud.com/4fthui9fza7z/monday-morning-cornerman-episode-1-championship-triple-header-shakur-pro-debut-porter-berto", 5)
