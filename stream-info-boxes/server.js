var fs = require('fs');
var irc = require('tmi.js');

module.exports = function(nodecg) {
	var inCommandCooldown = false;
	
	// Sets up the connection to Twitch chat.
	var ircOptions = {
		options: {
			debug: false
		},
		connection: {
			reconnect: true
		},
		identity: {
			username: 'slowton2',
			password: 'OAUTH_GOES_HERE'
		},
		channels: ['#zoton2']
	}
	
	var client = new irc.client(ircOptions);
	client.connect();
	
	client.on('chat', function(channel, user, message, self) {
		if (!self) {
			if (message.toLowerCase() == '!song' && !inCommandCooldown) {
				fs.readFile('bundles/stream-info-boxes/view/song.txt', {encoding:'utf8'}, function(err, data) {
					if (!err && data != '') {
						client.say(channel, 'CURRENT SONG: ' + data);
						
						inCommandCooldown = true;
						setTimeout(function() {inCommandCooldown = false;}, 15000);
					}
				});
			}
		}
	});
}