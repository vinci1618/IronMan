var ImageLoader = function() {

	var tempArray = new Array();
	var imageBuffer;
	var nameSpace;
	var limit = 0;
	var block = 10;
	var currentImage = 0;
	var path = "statics/img/renders/";
	var ext = ".jpg";
	var counter = 0;
	var onCompleteEvent;
	var busy = false;
	//////console.log("create Image Loader");
	this.addEvent = function(c) {
		onCompleteEvent = c;
	};

	this.load = function(i, l, n, c) {

		onCompleteEvent = c;
		imageBuffer = i;
		limit = l;
		nameSpace = n;
		////console.log("loading");
		loadBlock();
		busy = true;

	};

	this.getStatus = function() {

		return busy;

	};

	function loadBlock() {

		for ( var x = 1; x <= block; x++) {
			var image = new Image();
			image.onload = function() { // always fires the event.

				counter++;

				if (counter == block) {

					if (currentImage == limit) {
						onCompleteEvent({
							name : nameSpace,
							imageArray : tempArray
						});

						counter = 0;
						tempArray = new Array();
						currentImage = 0;
						block = 10;
						busy = false;

					} else {
						counter = 0;
						loadBlock();

					}
				}

			};
			image.src = path + nameSpace + currentImage + ext;
			tempArray[currentImage] = image.src;
			currentImage++;
		}
	}
	;

};