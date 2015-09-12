// Cache the selector here, rather than fetching it every time we want to run the animation.
var $infoBox = $('#info-box');
var $textBox = $('#text-box');

// Stores the replicants (the global variables).
var game = nodecg.Replicant('game');
var category = nodecg.Replicant('category');
var followerGoal = nodecg.Replicant('followerGoal');
var toggleGame = nodecg.Replicant('toggleGame', {defaultValue:true});
var toggleCategory = nodecg.Replicant('toggleCategory', {defaultValue:true});
var toggleSong = nodecg.Replicant('toggleSong', {defaultValue:true});
var toggleFollowerGoal = nodecg.Replicant('toggleFollowerGoal', {defaultValue:true});
var toggleTopDonators = nodecg.Replicant('toggleTopDonators', {defaultValue:true});
var defaultDelay = nodecg.Replicant('delay', {defaultValue:10000});
var defaultLength = nodecg.Replicant('duration', {defaultValue:5000});

// Array of all the functions for all the boxes that can appear.
/*var infoBoxes = [
	showGameName,
	showCategoryName,
	showSongName,
	showFollowerGoal,
	showTopDonators
];*/
var infoBoxes = []

// Using a timeout to give the script time to get the replicants (above) before it starts.
setTimeout(findEnabledBoxes, 200);

// Used to find the next box to show, and if none are available, wait.
function findEnabledBoxes() {
	// If none of the boxes are enabled, checks every second for one to be enabled.
	if (infoBoxes.length == 0) {
		var checkForEnabled = setInterval(function() {
			if (infoBoxes.length > 0) {
				clearInterval(checkForEnabled);
				
				// Starts off by picking a random info box to show.
				var random = randomInt(0, infoBoxes.length);
				infoBoxes[random]();
			}
		}, 1000);
	}
	
	else {
		// Starts off by picking a random info box to show.
		var random = randomInt(0, infoBoxes.length);
		infoBoxes[random]();
	}
}

// Below listeners add/remove boxes from the array, depending on if the user wants them or not.
// These always run on page start.
toggleGame.on('change', function(oldValue, newValue) {
	if (newValue) {infoBoxes.push(showGameName);}
	else if (infoBoxes.indexOf(showGameName) > -1) {infoBoxes.splice(infoBoxes.indexOf(showGameName), 1);}
});

toggleCategory.on('change', function(oldValue, newValue) {
	if (newValue) {infoBoxes.push(showCategoryName);}
	else if (infoBoxes.indexOf(showCategoryName) > -1) {infoBoxes.splice(infoBoxes.indexOf(showCategoryName), 1);}
});

toggleSong.on('change', function(oldValue, newValue) {
	if (newValue) {infoBoxes.push(showSongName);}
	else if (infoBoxes.indexOf(showSongName) > -1) {infoBoxes.splice(infoBoxes.indexOf(showSongName), 1);}
});

toggleFollowerGoal.on('change', function(oldValue, newValue) {
	if (newValue) {infoBoxes.push(showFollowerGoal);}
	else if (infoBoxes.indexOf(showFollowerGoal) > -1) {infoBoxes.splice(infoBoxes.indexOf(showFollowerGoal), 1);}
});

toggleTopDonators.on('change', function(oldValue, newValue) {
	if (newValue) {infoBoxes.push(showTopDonators);}
	else if (infoBoxes.indexOf(showTopDonators) > -1) {infoBoxes.splice(infoBoxes.indexOf(showTopDonators), 1);}
});

// Used to show the current game's name (changed via the dashboard).
function showGameName() {
	if (game.value != undefined) {
		var textHTML = '<b>Game:</b> ' + game.value;
		$textBox.html(textHTML);
		
		$infoBox.animate({'top':'+=40px'}, 1000);
		$infoBox.delay(defaultLength.value);
		$infoBox.animate({'top':'-=40px'}, 1000, function() {
			setTimeout(findEnabledBoxes, defaultDelay.value);
		});
	}
	
	else {findEnabledBoxes();}
}

// Used to show the current categories name (changed via the dashboard).
function showCategoryName() {
	if (category.value != undefined) {
		var textHTML = '<b>Category:</b> ' + category.value;
		$textBox.html(textHTML);
		
		$infoBox.animate({'top':'+=40px'}, 1000);
		$infoBox.delay(defaultLength.value);
		$infoBox.animate({'top':'-=40px'}, 1000, function() {
			setTimeout(findEnabledBoxes, defaultDelay.value);
		});
	}
	
	else {findEnabledBoxes();}
}

// Used to show the current song's name from the text file.
function showSongName() {
	$.get('song.txt', function(data) {
		if (data != '') {
			var textHTML = '<b>Song:</b> ' + data;
			$textBox.html(textHTML);
			
			$infoBox.animate({'top':'+=40px'}, 1000);
			$infoBox.delay(defaultLength.value);
			$infoBox.animate({'top':'-=40px'}, 1000, function() {
				setTimeout(findEnabledBoxes, defaultDelay.value);
			});
		}
		
		else {findEnabledBoxes();}
	}).fail(function() {
		findEnabledBoxes();
	});
}

// Used to show the current follower count and goal from the text file.
function showFollowerGoal() {
	if (followerGoal.value != undefined) {
		$.get('stream-labels/total_follower_count.txt', function(data) {
			// Get the current follower count and parses it as a number instead.
			var followerCount = data.replace(',', '');
			followerCount = parseInt(followerCount);
			
			var textHTML = '<b>Follower Goal:</b> ' + followerCount.toString() + '/' + followerGoal.value.toString();
			
			// Displays an extra message if the follower goal has actually been met.
			if (followerCount >= followerGoal.value) {textHTML += ' - MET!';}
			
			$textBox.html(textHTML);
			
			$infoBox.animate({'top':'+=40px'}, 1000);
			$infoBox.delay(defaultLength.value);
			$infoBox.animate({'top':'-=40px'}, 1000, function() {
				setTimeout(findEnabledBoxes, defaultDelay.value);
			});
		}).fail(function() {
			findEnabledBoxes();
		});
	}
	
	else {findEnabledBoxes();}
}

// Used to show the top 10 donators from the text file.
function showTopDonators() {
	// Get the top donators from the text file.
	$.get('stream-labels/all_time_top_donators.txt', function(data) {
		if (data != '') {
			// Sets up the HTML for the box, including a new span for this function.
			var textHTML = '<b>Top Donators:</b> <span id=\'donation-info\'></span>';
			$textBox.html(textHTML);
			
			// Populates this array with all the donators.
			var donatorsArray = data.split(',');
			
			// Prints the first person in the list to the text on screen.
			$('#donation-info').html(donatorsArray[0].split(';')[0] + ' (' + donatorsArray[0].split(';')[1] + ')');
			var i = 1;
			
			// Animates down the box.
			$infoBox.animate({'top':'+=40px'}, 1000);
			
			// The length for which each donator will appear.
			var donatorFrequency = 2700;
			
			// Sets up the interval for when to change to the next donator.
			var donatorChangeInterval = setInterval(function() {
				// Fades out the last donator's name and waits until it's done.
				$('#donation-info').animate({opacity:0}, 200, function() {
					// Sets the box's width (in most cases it won't be on auto).
					$infoBox.css({'width':'auto'});
					
					// Gets the width of the box right now.
					var oldContentWidth = $infoBox.width();
					
					// Prints the next donator's info into the text (right now it's still invisible).
					$('#donation-info').html(donatorsArray[i].split(';')[0] + ' (' + donatorsArray[i].split(';')[1] + ')');
					
					// Gets the new width of the box.
					var contentWidth = $infoBox.width();
					
					// Blanks out the text (we put it back in later).
					$('#donation-info').html('');
					
					// Sets the box's width back to what it was before 
					$infoBox.css({'width':oldContentWidth+'px'});
					
					// Animates to the new width of the box and waits until it's done.
					$infoBox.animate({'width':contentWidth+'px'}, 200, function() {
						// Prints the next donator's info back into the text.
						$('#donation-info').html(donatorsArray[i].split(';')[0] + ' (' + donatorsArray[i].split(';')[1] + ')');
						
						// Fades it in.
						$('#donation-info').animate({opacity:1}, 200);
						i++;
						
						// Checks if this is the last donator to display or not.
						if (i == donatorsArray.length) {
							// Stops the interval from running.
							clearInterval(donatorChangeInterval);
							
							// Delays the current animation for a little.
							$infoBox.delay(donatorFrequency-1000);
							
							// Animates up the box and waits for it to finish.
							$infoBox.animate({'top':'-=40px'}, 1000, function() {
								// Sets a timeout for the next information to appear.
								setTimeout(findEnabledBoxes, defaultDelay.value);
								
								// Sets the width back to auto (otherwise other info doesn't size correctly).
								$infoBox.css({'width':'auto'});
							});
						}
					});
				});
			}, donatorFrequency);
		}
		
		else {findEnabledBoxes();}
	}).fail(function() {
		findEnabledBoxes();
	});
}

// Function to return a random integer.
function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}