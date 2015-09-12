// BUGS/TODO:
// Donations may not track as new if the same person donates the same amount with the same message.
// Had an error once where after a while of a new donation, all the old donations played again, but I don't know why.

var fs = require('fs');
var irc = require('tmi.js');

// Temporarily stores the lists loaded from the files.
var mostRecentFollowers;
var mostRecentDonations;

module.exports = function(nodecg) {
	// Stores the replicants (the global variables).
	var mostRecentFollower = nodecg.Replicant('mostRecentFollower');
	var mostRecentDonation = nodecg.Replicant('mostRecentDonation');
	
	// Sets up the connection to Twitch chat.
	var ircOptions = {
		options: {
			debug: false
		},
		connection: {
			reconnect: true
		},
		identity: {
			username: 'zoton2',
			password: 'OAUTH_GOES_HERE'
		},
		channels: ['#zoton2']
	}
	
	var client = new irc.client(ircOptions);
	client.connect();
	
	// Gets the most recent followers on start-up (these ones won't have an alert).
	fs.readFile('bundles/stream-info-boxes/view/stream-labels/session_followers.txt', {encoding:'utf8'}, function(err, data) {
		mostRecentFollowers = data;
		
		// Used for the dashboard to make sure the "last" part is actually accurate.
		mostRecentFollower.value = data.split(',')[0];
	});
	
	// Gets the most recent donations on start-up (these ones won't have an alert).
	fs.readFile('bundles/stream-info-boxes/view/stream-labels/session_donators.txt', {encoding:'utf8'}, function(err, data) {
		mostRecentDonations = data;
		
		// Used for the dashboard to make sure the "last" part is actually accurate.
		mostRecentDonation.value = data.split('*^!')[0];
	});
	
	// Checks for a new followers every 10 seconds.
	setInterval(function() {
		fs.readFile('bundles/stream-info-boxes/view/stream-labels/session_followers.txt', {encoding:'utf8'}, function(err, data) {
			// If the followers have changed, then we have new ones!
			if (mostRecentFollowers != data) {
				var newFollowersList = data.split(',');
				var oldFollowersList = mostRecentFollowers.split(',');
				var newFollowers = [];
				
				// Goes through the last loaded list and logs the ones that are actually new.
				for (var i = 0; i < newFollowersList.length; i++) {
					if (newFollowersList[i] != oldFollowersList[0]) {newFollowers.unshift(newFollowersList[i]);}
					else {break;}
				}
				
				// Sends the alerts for the new followers (oldest to newest).
				for (var i = 0; i < newFollowers.length; i++) {nodecg.sendMessage('newFollower', newFollowers[i]); mostRecentFollower.value = newFollowers[i];}
				mostRecentFollowers = data;
			}
		});
	}, 10000);
	
	// Checks for a new donations every 10 seconds.
	setInterval(function() {
		fs.readFile('bundles/stream-info-boxes/view/stream-labels/session_donators.txt', {encoding:'utf8'}, function(err, data) {
			// If the donations have changed, then we have new ones!
			if (mostRecentDonations != data) {
				var newDonationsList = data.split('*^!');
				var oldDonationsList = mostRecentDonations.split('*^!');
				var newDonations = [];
				
				// Goes through the last loaded list and sends the ones that are actually new.
				for (var i = 0; i < newDonationsList.length; i++) {
					if (newDonationsList[i] != oldDonationsList[0]) {newDonations.unshift(newDonationsList[i]);}
					else {break;}
				}
				
				// Sends the alerts for the new donations (oldest to newest).
				for (var i = 0; i < newDonations.length; i++) {nodecg.sendMessage('newDonation', newDonations[i]); mostRecentDonation.value = newDonations[i];}
				mostRecentDonations = data;
			}
		});
	}, 20000);
	
	// When another user hosts the channel, sends this.
	client.on('hosted', function(channel, username, viewers) {
		if (viewers == undefined) {viewers = 0;}
		
		var data = {
			channel: username,
			viewerCount: viewers
		};
		
		nodecg.sendMessage('newHost', data);
	});
}