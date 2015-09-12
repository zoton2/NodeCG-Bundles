// Cache the selector here, rather than fetching it every time we want to run the animation.
var $infoBox = $('#info-box');
var $textBox = $('#text-box');

var alertPlaying = false;
var alertsQueue = [];
var animationPlaying = false;

// Stores the replicants (the global variables).
var toggleFollowerAlert = nodecg.Replicant('toggleFollowerAlert', {defaultValue:true});
var toggleDonationAlert = nodecg.Replicant('toggleDonationAlert', {defaultValue:true});
var toggleDonationMessage = nodecg.Replicant('toggleDonationMessage', {defaultValue:true});
var toggleHostAlert = nodecg.Replicant('toggleHostAlert', {defaultValue:true});
var defaultDelay = nodecg.Replicant('delay', {defaultValue:5000});
var defaultFollowerLength = nodecg.Replicant('followerDuration', {defaultValue:5000});
var defaultDonationLength = nodecg.Replicant('donationDuration', {defaultValue:10000});
var defaultHostLength = nodecg.Replicant('hostDuration', {defaultValue:5000});
var followerMessage = nodecg.Replicant('followerMessage', {defaultValue:'{name} is now following!'});
var donationMessage = nodecg.Replicant('donationMessage', {defaultValue:'{name} donated {amount}!'});
var hostMessage = nodecg.Replicant('hostMessage', {defaultValue:'{name} is now hosting me for {count} viewers!'});
var donationMin = nodecg.Replicant('donationMin', {defaultValue:1});

// Triggers when there is a new follower.
nodecg.listenFor('newFollower', function(message) {
	// Pushes the alert to the queue.
	alertsQueue.push({type:'follower',data:message});
	
	// If the alert is not currently playing, this will start it.
	if (!alertPlaying) {alertPlaying = true; sendQueuedAlerts();}
});

// Triggers when there is a new donation.
nodecg.listenFor('newDonation', function(message) {
	// Pushes the alert to the queue.
	alertsQueue.push({type:'donation',data:message});
	
	// If the alert is not currently playing, this will start it.
	if (!alertPlaying) {alertPlaying = true; sendQueuedAlerts();}
});

nodecg.listenFor('newHost', function(message) {
	// Pushes the alert to the queue.
	alertsQueue.push({type:'host',data:message});
	
	// If the alert is not currently playing, this will start it.
	if (!alertPlaying) {alertPlaying = true; sendQueuedAlerts();}
});

// Used to send the next queued alert.
function sendQueuedAlerts() {
	// If there are no messages left, stops the queue.
	if (alertsQueue.length == 0) {alertPlaying = false; return;}
	
	// Stores the next alert.
	var nextAlert = alertsQueue[0];
	
	// Removes the alert from the queue.
	alertsQueue.splice(0, 1);
	
	// Sends the next alert.
	if (nextAlert.type == 'follower') {showFollowerAlert(nextAlert.data);}
	else if (nextAlert.type == 'donation') {showDonationAlert(nextAlert.data);}
	else if (nextAlert.type == 'host') {showHostAlert(nextAlert.data);}
}

// Used to show the new follower alert.
function showFollowerAlert(username) {
	// Will only run if the follower alerts are turned on.
	if (toggleFollowerAlert.value) {
		// Gets the custom message and replaces the wildcards.
		var followerMessageHTML = followerMessage.value;
		followerMessageHTML = followerMessageHTML.replace('{name}', '<b>' + username + '</b>');
		
		var textHTML = followerMessageHTML;
		//textHTML += '<audio src=\'follower-sound.mp3\' autoplay>';
		$textBox.html(textHTML);
		
		// Used to align the box below the screen correctly.
		$infoBox.css({'bottom':'-45px'});
		
		// Changes the box colour.
		$infoBox.css({'background-color':'rgba(25, 71, 117, 0.6)'});
		
		$infoBox.animate({'bottom':'+=45px'}, 1000);
		$infoBox.delay(defaultFollowerLength.value);
		$infoBox.animate({'bottom':'-=45px'}, 1000, function() {
			setTimeout(sendQueuedAlerts, defaultDelay.value);
		});
	}
	
	else {sendQueuedAlerts();}
}

// Used to show the new donation alert.
function showDonationAlert(donationData) {
	// Will only run if the donation alerts are turned on.
	if (toggleDonationAlert.value) {
		// Parses the donation information.
		var name = donationData.split(';')[0];
		var amount = donationData.split(';')[1];
		var message = donationData.substr(donationData.indexOf(';', donationData.indexOf(';')+1)+1);
		
		if (parseFloat(amount.replace('$', '')) >= donationMin.value) {
			var textHTML = '<div id=\'donation-title\'></div>';
			if (message != '' && toggleDonationMessage.value) {textHTML += '<div id=\'donation-message\'></div>';}
			//textHTML += '<audio src=\'donation-sound.wav\' autoplay>';
			$textBox.html(textHTML);
			
			// Gets the custom message and replaces the wildcards.
			var donationMessageHTML = donationMessage.value;
			donationMessageHTML = donationMessageHTML.replace('{name}', '<b>' + name + '</b>');
			donationMessageHTML = donationMessageHTML.replace('{amount}', amount);
			
			$('#donation-title').html(donationMessageHTML);
			if (message != '' && toggleDonationMessage.value) {
				$('#donation-message').html(message);
				responsiveVoice.speak(message, "UK English Female", {onend: function() {
					if (!animationPlaying) {
						setTimeout(sendQueuedAlerts, defaultDelay.value);
					}
				}});
			}
			
			// Gets the box height (and then adds some more because of padding).
			var boxHeight = $infoBox.height();
			boxHeight += 10;
			
			// Used to align the box below the screen correctly.
			$infoBox.css({'bottom':'-' + boxHeight + 'px'});
			
			// Changes the box colour.
			$infoBox.css({'background-color':'rgba(31, 92, 31, 0.6)'});
			
			animationPlaying = true;
			$infoBox.animate({'bottom':'+=' + boxHeight + 'px'}, 1000);
			$infoBox.delay(defaultDonationLength.value);
			$infoBox.animate({'bottom':'-=' + boxHeight + 'px'}, 1000, function() {
				animationPlaying = false;
				
				if (!responsiveVoice.isPlaying()) {
					setTimeout(sendQueuedAlerts, defaultDelay.value);
				}
			});
		}
		
		else {sendQueuedAlerts();}
	}
	
	else {sendQueuedAlerts();}
}

// Used to show a host alert.
function showHostAlert(hostData) {
	// Will only run if the host alerts are turned on.
	if (toggleHostAlert.value) {
		// Gets the custom message and replaces the wildcards.
		var hostMessageHTML = hostMessage.value;
		hostMessageHTML = hostMessageHTML.replace('{name}', '<b>' + hostData.channel + '</b>');
		hostMessageHTML = hostMessageHTML.replace('{count}', hostData.viewerCount);
		
		var textHTML = hostMessageHTML;
		$textBox.html(textHTML);
		
		// Used to align the box below the screen correctly.
		$infoBox.css({'bottom':'-45px'});
		
		// Changes the box colour.
		$infoBox.css({'background-color':'rgba(204, 122, 0, 0.6)'});
		
		$infoBox.animate({'bottom':'+=45px'}, 1000);
		$infoBox.delay(defaultHostLength.value);
		$infoBox.animate({'bottom':'-=45px'}, 1000, function() {
			setTimeout(sendQueuedAlerts, defaultDelay.value);
		});
	}
	
	else {sendQueuedAlerts();}
}