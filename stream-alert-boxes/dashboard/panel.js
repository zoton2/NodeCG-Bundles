'use strict';

// NodeCG injects the '$bundle' variable, which is a jQuery selector targeting all of our bundle's panels.
// To target one specific panel within our bundle, we can use '.filter()'.
var $panel = $bundle.filter('.stream-alert-boxes');

// We like to target our buttons and inputs with `ctrl-` class names. However, you can use whatever you want!
var $changeDelay = $panel.find('.ctrl-alert-delay');
var $changeFollowerDuration = $panel.find('.ctrl-follower-alert-duration');
var $changeDonationDuration = $panel.find('.ctrl-donation-alert-duration');
var $changeHostDuration = $panel.find('.ctrl-host-alert-duration');
var $changeFollowerMessage = $panel.find('.ctrl-follower-message');
var $changeDonationMessage = $panel.find('.ctrl-donation-message');
var $changeDonationMin = $panel.find('.ctrl-donation-min');
var $changeHostMessage = $panel.find('.ctrl-host-message');
var $followerTest = $panel.find('.ctrl-follower-test');
var $donationTest = $panel.find('.ctrl-donation-test');
var $hostTest = $panel.find('.ctrl-host-test');
var $toggleFollowerAlert = $panel.find('.ctrl-toggle-follower-alert');
var $toggleDonationAlert = $panel.find('.ctrl-toggle-donation-alert');
var $toggleDonationMessage = $panel.find('.ctrl-toggle-donation-message');
var $toggleHostAlert = $panel.find('.ctrl-toggle-host-alert');
var $mostRecentFollower = $panel.find('#most-recent-follower');
var $mostRecentDonation = $panel.find('#most-recent-donation');

// Stores the replicants (the global variables).
var delay = nodecg.Replicant('delay', {defaultValue:5000});
var followerDuration = nodecg.Replicant('followerDuration', {defaultValue:5000});
var donationDuration = nodecg.Replicant('donationDuration', {defaultValue:10000});
var hostDuration = nodecg.Replicant('hostDuration', {defaultValue:5000});
var followerMessage = nodecg.Replicant('followerMessage', {defaultValue:'{name} is now following!'});
var donationMessage = nodecg.Replicant('donationMessage', {defaultValue:'{name} donated {amount}!'});
var donationMin = nodecg.Replicant('donationMin', {defaultValue:1});
var hostMessage = nodecg.Replicant('hostMessage', {defaultValue:'{name} is now hosting me for {count} viewers!'});
var mostRecentFollower = nodecg.Replicant('mostRecentFollower');
var mostRecentDonation = nodecg.Replicant('mostRecentDonation');
var toggleFollowerAlert = nodecg.Replicant('toggleFollowerAlert', {defaultValue:true});
var toggleDonationAlert = nodecg.Replicant('toggleDonationAlert', {defaultValue:true});
var toggleDonationMessage = nodecg.Replicant('toggleDonationMessage', {defaultValue:true});
var toggleHostAlert = nodecg.Replicant('toggleHostAlert', {defaultValue:true});

// Updates the information on the dashboard every 10 seconds.
setTimeout(getInfo, 200);
setInterval(getInfo, 10000);

// Used to update the information shown on the dashboard.
function getInfo() {
	$mostRecentFollower.html('<b>Last Follower:</b> ' + mostRecentFollower.value);
	
	// Parse donation info.
	var donationName = mostRecentDonation.value.split(';')[0];
	var donationAmount = mostRecentDonation.value.split(';')[1];
	var donationMessage = mostRecentDonation.value.substr(mostRecentDonation.value.indexOf(';', mostRecentDonation.value.indexOf(';')+1)+1);
	
	var donationHTML = donationName + ' (' + donationAmount + ')';
	if (donationMessage != '') {donationHTML += ': <i>' + donationMessage + '</i>';}
	$mostRecentDonation.html('<b>Last Donation:</b> ' + donationHTML);
}

// If statements below change the toggle buttons if the things are off when the page loads.
// Using a timeout to give the script time to get the replicants (above) before it starts.
setTimeout(function() {
	if (!toggleFollowerAlert.value) {
		$toggleFollowerAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleFollowerAlert.html('Enable Follower Alerts');
	}

	if (!toggleDonationAlert.value) {
		$toggleDonationAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleDonationAlert.html('Enable Donation Alerts');
	}
	
	if (!toggleDonationMessage.value) {
		$toggleDonationMessage.removeClass('btn-primary').addClass('btn-danger');
		$toggleDonationMessage.html('Enable Donation Messages');
	}
	
	if (!toggleHostAlert.value) {
		$toggleHostAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleHostAlert.html('Enable Host Alerts');
	}
}, 200);

// Used to let the user change the delay between alerts.
$changeDelay.click(function() {
	var entry = prompt('Enter the new delay below (in ms):', delay.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		delay.value = parseInt(entry);
	}
});

// Used to let the user change the follower alert duration.
$changeFollowerDuration.click(function() {
	var entry = prompt('Enter the new duration below (in ms):', followerDuration.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		followerDuration.value = parseInt(entry);
	}
});

// Used to let the user change the donation alert duration.
$changeDonationDuration.click(function() {
	var entry = prompt('Enter the new duration below (in ms):', donationDuration.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		donationDuration.value = parseInt(entry);
	}
});

// Used to let the user change the host alert duration.
$changeHostDuration.click(function() {
	var entry = prompt('Enter the new duration below (in ms):', hostDuration.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		hostDuration.value = parseInt(entry);
	}
});

// Used to let the user change the follower alert message.
$changeFollowerMessage.click(function() {
	var entry = prompt('Enter the new follower alert message below (wildcard: {user}):', followerMessage.value);
	
	if (entry != null && entry != '') {
		followerMessage.value = entry;
	}
});

// Used to let the user change the donation alert message.
$changeDonationMessage.click(function() {
	var entry = prompt('Enter the new donation alert message below (wildcards: {user}, {amount}):', donationMessage.value);
	
	if (entry != null && entry != '') {
		donationMessage.value = entry;
	}
});

// Used to let the user change the host alert message.
$changeHostMessage.click(function() {
	var entry = prompt('Enter the new host alert message below (wildcards: {user}, {count}):', hostMessage.value);
	
	if (entry != null && entry != '') {
		hostMessage.value = entry;
	}
});

// Used to let the user change the donation minimum (donations will only appear if they're this amount or more).
$changeDonationMin.click(function() {
	var entry = prompt('Enter the new amount below:', donationMin.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		donationMin.value = parseFloat(entry);
	}
});

// Used to let the user test the follower alert.
$followerTest.click(function() {
	nodecg.sendMessage('newFollower', 'TestGuy');
});

// Used to let the user test the donation alert.
$donationTest.click(function() {
	nodecg.sendMessage('newDonation', 'TestGuy;$4.20;This is a test donation message!');
});

// Used to let the user test the host alert.
$hostTest.click(function() {
	var data = {
		channel: 'TestChannel',
		viewerCount: 42069
	};
	
	nodecg.sendMessage('newHost', data);
});

// Used to toggle the display of follower alerts on/off.
$toggleFollowerAlert.click(function() {
	if (toggleFollowerAlert.value) {
		toggleFollowerAlert.value = false;
		$toggleFollowerAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleFollowerAlert.html('Enable Follower Alerts');
	}
	
	else {
		toggleFollowerAlert.value = true;
		$toggleFollowerAlert.removeClass('btn-danger').addClass('btn-primary');
		$toggleFollowerAlert.html('Disable Follower Alerts');
	}
});

// Used to toggle the display of donation alerts on/off.
$toggleDonationAlert.click(function() {
	if (toggleDonationAlert.value) {
		toggleDonationAlert.value = false;
		$toggleDonationAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleDonationAlert.html('Enable Donation Alerts');
	}
	
	else {
		toggleDonationAlert.value = true;
		$toggleDonationAlert.removeClass('btn-danger').addClass('btn-primary');
		$toggleDonationAlert.html('Disable Donation Alerts');
	}
});

// Used to toggle the display of donation messages on/off.
$toggleDonationMessage.click(function() {
	if (toggleDonationMessage.value) {
		toggleDonationMessage.value = false;
		$toggleDonationMessage.removeClass('btn-primary').addClass('btn-danger');
		$toggleDonationMessage.html('Enable Donation Messages');
	}
	
	else {
		toggleDonationMessage.value = true;
		$toggleDonationMessage.removeClass('btn-danger').addClass('btn-primary');
		$toggleDonationMessage.html('Disable Donation Messages');
	}
});

// Used to toggle the display of host alerts on/off.
$toggleHostAlert.click(function() {
	if (toggleHostAlert.value) {
		toggleHostAlert.value = false;
		$toggleHostAlert.removeClass('btn-primary').addClass('btn-danger');
		$toggleHostAlert.html('Enable Host Alerts');
	}
	
	else {
		toggleHostAlert.value = true;
		$toggleHostAlert.removeClass('btn-danger').addClass('btn-primary');
		$toggleHostAlert.html('Disable Host Alerts');
	}
});