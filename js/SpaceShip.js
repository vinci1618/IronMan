var SpaceShip = function(_holder) {

	var holder = _holder;
	var shipType1 = "statics/img/nave_1.gif";
	var shipType2 = "statics/img/nave_2.gif";
	var shipType3 = "statics/img/nave_3.gif";
	var xplotionImg = "statics/img/explosion_gif_once.gif";
	var shipType;
    var laser1Sound = $('#laser1_sound')[0];
    var explotionSound = $("#explotion_sound")[0];
    var scoreSound = $("#score_sound")[0];
    var prev;
	var grades;

	var spaceShipW = 400;

	function getGrades(){
		var rand = Math.floor(Math.random()*4) + 1;
		if(prev == rand){
			rand = Math.floor(Math.random()*4) + 1;
		}
		prev = rand;
		switch (rand) {
		case 1:

			 grades = {
				top:0-spaceShipW,
				left:	Math.floor((Math.random()*document.documentElement.clientWidth)+1),
				width:spaceShipW
			}

			break;
		case 2:
			 grades = {
				top:Math.floor((Math.random()*document.documentElement.clientHeight)+1)-spaceShipW/2,
				left:document.documentElement.clientWidth,
				width:spaceShipW
			}

			break;
		case 3:
			 grades = {
				top:document.documentElement.clientHeight,
				left:Math.floor((Math.random()*document.documentElement.clientWidth)+1)-spaceShipW/2,
				width:spaceShipW
		}

			break;
		case 4:

			 grades = {
				top: Math.floor((Math.random()*document.documentElement.clientHeight)+1)-spaceShipW/2,
				left:0-spaceShipW,
				width:spaceShipW
			}
			break;

		default:
			break;
		}


		return grades;

	}

	function uniqueid(){
	    // always start with a letter (for DOM friendlyness)
	    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
	    do {
	        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
	        var ascicode=Math.floor((Math.random()*42)+48);
	        if (ascicode<58 || ascicode>64){
	            // exclude all chars between : (58) and @ (64)
	            idstr+=String.fromCharCode(ascicode);
	        }
	    } while (idstr.length<10);

	    return (idstr);
	}

	this.create = function(){
		shipType = Math.floor((Math.random()*3)+1);

		var ship = $('<div/>');
		ship.css({
			position:"absolute",
			width:10,
			left:((document.documentElement.clientWidth/2)-25)+Math.floor((Math.random()*50)+(Math.random())*0),
			top:((document.documentElement.clientHeight/2)-25)+Math.floor((Math.random()*50)+(Math.random())*0)
		});

		ship.append("<img draggable='false' width='100%' src="+eval("shipType"+shipType)+"  />");
		ship.attr("title",shipType);

		ship.fadeIn("slow");
		holder.append(ship);
		ship.animate(getGrades(), 2500, "linear", function(e){
			ship.remove();
		});
		ship.on("click",function(e){
			ship.append("<img draggable='false' style='position:absolute; top:0; left:0; z-index:10;' width='100%' src='"+xplotionImg+"?="+uniqueid()+"' />");
			explotionSound.pause();
//			laser1Sound.play();
			holder.trigger({
				type:"onDestroy",
				c:$(e.currentTarget).attr("title")
			});
			explotionSound.play();
			ship.stop();
//			ship.fadeOut();
			var timeOut = setTimeout(function() {
				ship.remove();
				scoreSound.play();

			},1000);

		});
	};


}