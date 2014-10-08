/**
 *
 */
var Adjuster = function(_elements, paper, svg, imgWidth, imgHeight, ex) {

	var elements = _elements;
	if (ex) {
		var p = paper;
		var s = svg;
		var w = imgWidth;
		var h = imgHeight;
	}

	this.temp = function(){

		ajust();

	}

	function ajust() {

		for (x in elements) {

			elements[x].width(window.innerWidth);
			elements[x].height(window.innerHeight);

		}

		if (ex) {

			ratio1 = w / h;
			ratio2 = window.innerWidth / window.innerHeight;

			if (ratio1 < ratio2) {
				scale = innerWidth / w;

			} else {
				scale = innerHeight / h;
			}

			p.setSize(w * scale, h * scale);

			s.css({

				left : -(w * scale - innerWidth) / 2,
				top : -(h * scale - innerHeight) / 2

			});

		}

	}
//
//	window.onresize = function() {
//		ajust();
//	};
	ajust();

};