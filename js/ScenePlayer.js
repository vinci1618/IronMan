var ScenePlayer = function(fr, paper) {

	var paper = paper;
	var timer;
	var frameRate = 1000 / fr;
	var frame = 0;
	var imageArray = new Array();
	var generic;
	var onEndScene;
	var c = paper
			.image("statics/img/null.jpg", 0, 0, paper.width, paper.height);

	this.play = function(images, _loop) {

		stopTimer();

		if (_loop) {

			generic = _loop;

		}
		imageArray = images;

		initTimer();

	};

	this.stop = function() {
		stopTimer();
	};

	this.addEvent = function(c) {

		onEndScene = c;
	};

	function initTimer() {

		timer = setInterval(drawImages, frameRate);

	}

	function drawImages() {

		var randomnumber = Math.floor(Math.random() * (20 - 17 + 1)) + 17;

		$("#vel_counter").html(randomnumber + " Mb/s");

		// paper.image(imageArray[frame], 0, 0, paper.width, paper.height);
		c.attr({
			src : imageArray[frame],
			width : paper.width,
			height : paper.height
		});
		frame++;

		if (typeof generic != "boolean") {
			imageArray[frame - 1] = null;
		}

		if (frame == imageArray.length) {

			if (typeof generic == "boolean") {
				frame = 0;

			} else {

				generic();

			}

		}

	}

	function stopTimer() {
		clearInterval(timer);
		frame = 1;
	}

};