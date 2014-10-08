var Game = function(_holder) {

	var holder = _holder;
	var onEnterFrame;
	var xm = 0;
	var shipCount = 0;
	var shipManager = new SpaceShip(holder);
	var timeOut;
	var score_sc = $("#score_sc");
	var score_time = $("#score_time");
	this.start = start;
	var t=0;
	var busy = false;
	var token = "";
	var timeCounter;
	var timeLimit = 60;


	function start() {
		busy = true;
		timeLimit = 60;
		score_sc.html(0);
		xm = 0;
		shipCount = 0;
		timeOut = setTimeout(stop,60*1000);
		onEnterFrame = setInterval(enterFrame, 600);
		timeCounter = setInterval(setClock, 1000);
		$("body").addClass('attack');
	}

	this.setToken = function(_token){
		token = _token;
	}

	this.getToken = function(){
		return token;
	}

	holder.on("onDestroy", function(e){
		shipCount++;
		switch (Number(e.c)) {
		case 1:
			xm+=15;
		break;
		case 2:
			xm+=10;
		break;
		case 3:
			xm+=20;
		break;
		default:
			break;
		}
		score_sc.html(shipCount);
	});

	function stop() {
		$("body").removeClass('attack');
		var CXV;
		busy = false;
		clearInterval(onEnterFrame);
		clearTimeout(timeOut);

		if(token){
			CXV = XRCTYVIUOBTVC(String(xm),token);
		}else{
			CXV = false;
		}

		holder.trigger({
			type:"onFinish",
			CXV:CXV
		});

	};

	function setClock(){
		timeLimit--;
		score_time.html(timeLimit);
	}

	function enterFrame(){

		shipManager.create();

	}

};