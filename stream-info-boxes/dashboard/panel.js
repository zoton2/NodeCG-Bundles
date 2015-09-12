// BUGS/TODO:
// Sometimes the enable/disable settings go from false to true when the server is started up again.

'use strict';

// NodeCG injects the '$bundle' variable, which is a jQuery selector targeting all of our bundle's panels.
// To target one specific panel within our bundle, we can use '.filter()'.
var $panel = $bundle.filter('.stream-info-boxes');

// We like to target our buttons and inputs with `ctrl-` class names. However, you can use whatever you want!
var $changeDelay = $panel.find('.ctrl-info-delay');
var $changeDuration = $panel.find('.ctrl-info-duration');
var $changeGame = $panel.find('.ctrl-game');
var $changeCategory = $panel.find('.ctrl-category');
var $changeFollowerGoal = $panel.find('.ctrl-follower-goal');
var $toggleGame = $panel.find('.ctrl-toggle-game');
var $toggleCategory = $panel.find('.ctrl-toggle-category');
var $toggleSong = $panel.find('.ctrl-toggle-song');
var $toggleFollowerGoal = $panel.find('.ctrl-toggle-follower-goal');
var $toggleTopDonators = $panel.find('.ctrl-toggle-top-donators');
var $followerCount = $panel.find('#follower-count');
var $song = $panel.find('#song');

// Stores the replicants (the global variables).
var delay = nodecg.Replicant('delay', {defaultValue:10000});
var duration = nodecg.Replicant('duration', {defaultValue:5000});
var game = nodecg.Replicant('game');
var category = nodecg.Replicant('category');
var followerGoal = nodecg.Replicant('followerGoal');
var toggleGame = nodecg.Replicant('toggleGame', {defaultValue:true});
var toggleCategory = nodecg.Replicant('toggleCategory', {defaultValue:true});
var toggleSong = nodecg.Replicant('toggleSong', {defaultValue:true});
var toggleFollowerGoal = nodecg.Replicant('toggleFollowerGoal', {defaultValue:true});
var toggleTopDonators = nodecg.Replicant('toggleTopDonators', {defaultValue:true});

// Updates the information on the dashboard every 10 seconds.
getInfo();
setInterval(getInfo, 10000);

// Used to update the information shown on the dashboard.
function getInfo() {
	$.get('../view/stream-info-boxes/stream-labels/total_follower_count.txt', function(data) {
		$followerCount.html('<b>Follower Count:</b> ' + data.replace(',', ''));
	});

	$.get('../view/stream-info-boxes/song.txt', function(data) {
		if (data != '') {$song.html('<b>Song:</b> ' + data);}
	});
}

// If statements below change the toggle buttons if the things are off when the page loads.
// Using a timeout to give the script time to get the replicants (above) before it starts.
setTimeout(function() {
	if (!toggleGame.value) {
		$toggleGame.removeClass('btn-primary').addClass('btn-danger');
		$toggleGame.html('Enable Game');
	}

	if (!toggleCategory.value) {
		$toggleCategory.removeClass('btn-primary').addClass('btn-danger');
		$toggleCategory.html('Enable Category');
	}

	if (!toggleSong.value) {
		$toggleSong.removeClass('btn-primary').addClass('btn-danger');
		$toggleSong.html('Enable Song');
	}

	if (!toggleFollowerGoal.value) {
		$toggleFollowerGoal.removeClass('btn-primary').addClass('btn-danger');
		$toggleFollowerGoal.html('Enable Follower Goal');
	}

	if (!toggleTopDonators.value) {
		$toggleTopDonators.removeClass('btn-primary').addClass('btn-danger');
		$toggleTopDonators.html('Enable Top Donators');
	}
}, 200);

// Used to let the user change the delay between boxes.
$changeDelay.click(function() {
	var entry = prompt('Enter the new delay below (in ms):', delay.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		delay.value = parseInt(entry);
	}
});

// Used to let the user change the box duration (excluding Top Donators).
$changeDuration.click(function() {
	var entry = prompt('Enter the new duration below (in ms):', duration.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		duration.value = parseInt(entry);
	}
});

// Used to let the user change the game.
$changeGame.click(function() {
	var entry = prompt('Enter the new game below:', game.value);
	
	if (entry != null && entry != '') {
		game.value = entry;
	}
});

// Used to let the user change the category.
$changeCategory.click(function() {
	var entry = prompt('Enter the new category below:', category.value);
	
	if (entry != null && entry != '') {
		category.value = entry;
	}
});

// Used to let the user change the follower goal.
$changeFollowerGoal.click(function() {
	var entry = prompt('Enter the new follower goal below:', followerGoal.value);
	
	if (entry != null && entry != '' && !isNaN(entry)) {
		followerGoal.value = parseInt(entry);
	}
});

// Used to toggle the display of game on/off.
$toggleGame.click(function() {
	if (toggleGame.value) {
		toggleGame.value = false;
		$toggleGame.removeClass('btn-primary').addClass('btn-danger');
		$toggleGame.html('Enable Game');
	}
	
	else {
		toggleGame.value = true;
		$toggleGame.removeClass('btn-danger').addClass('btn-primary');
		$toggleGame.html('Disable Game');
	}
});

// Used to toggle the display of category on/off.
$toggleCategory.click(function() {
	if (toggleCategory.value) {
		toggleCategory.value = false;
		$toggleCategory.removeClass('btn-primary').addClass('btn-danger');
		$toggleCategory.html('Enable Category');
	}
	
	else {
		toggleCategory.value = true;
		$toggleCategory.removeClass('btn-danger').addClass('btn-primary');
		$toggleCategory.html('Disable Category');
	}
});

// Used to toggle the display of song on/off.
$toggleSong.click(function() {
	if (toggleSong.value) {
		toggleSong.value = false;
		$toggleSong.removeClass('btn-primary').addClass('btn-danger');
		$toggleSong.html('Enable Song');
	}
	
	else {
		toggleSong.value = true;
		$toggleSong.removeClass('btn-danger').addClass('btn-primary');
		$toggleSong.html('Disable Song');
	}
});

// Used to toggle the display of follower goal on/off.
$toggleFollowerGoal.click(function() {
	if (toggleFollowerGoal.value) {
		toggleFollowerGoal.value = false;
		$toggleFollowerGoal.removeClass('btn-primary').addClass('btn-danger');
		$toggleFollowerGoal.html('Enable Follower Goal');
	}
	
	else {
		toggleFollowerGoal.value = true;
		$toggleFollowerGoal.removeClass('btn-danger').addClass('btn-primary');
		$toggleFollowerGoal.html('Disable Follower Goal');
	}
});

// Used to toggle the display of follower goal on/off.
$toggleTopDonators.click(function() {
	if (toggleTopDonators.value) {
		toggleTopDonators.value = false;
		$toggleTopDonators.removeClass('btn-primary').addClass('btn-danger');
		$toggleTopDonators.html('Enable Top Donators');
	}
	
	else {
		toggleTopDonators.value = true;
		$toggleTopDonators.removeClass('btn-danger').addClass('btn-primary');
		$toggleTopDonators.html('Disable Top Donators');
	}
});