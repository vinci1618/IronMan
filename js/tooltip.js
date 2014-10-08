(function($) {
	$.fn.extend({
				// plugin name - animatemenu
				tooltip : function(options) {
					var over = false;

					$("body").append('<span style="width:216px; height:45px; position:absolute; z-index:9999; " id="tool"></span>');

					return this.each(function() {
						var o = options;

						// Assign current element to variable, in this case is
						// UL element
						var obj = $(this);

						obj.mouseover(function(e) {
							$("#tool").append(
									'<img src="statics/img/' + e.target.id
											+ '.png" />');
							over = true;
							$("#tool").show();

						});
						obj.mousemove(function(e) {

							if (over) {
								$("#tool").css({
									left : e.pageX + 8,
									top : e.pageY - 20

								});

							}

						});
						obj.mouseout(function() {
							over = false;

							$("#tool").hide();

							$("#tool").children().remove();

						});

					});
				}
			});
})(jQuery);
