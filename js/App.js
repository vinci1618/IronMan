var App = function () {

	var loadSound = $('#load_sound')[0];
    var ambientSound = $("#ambient_sound")[0];
    var pressSound = $("#press_sound")[0];
    var acceptSound = $("#accept_sound")[0];
    var weaponSound = $(".weapon_sound");
    var service = "/telcel-ironman/servicio/";

    loadSound.muted = true;
    ambientSound.muted = true;

    var scale = 1;
    var fx = $("#fx_wrapper");
    var gameW = $("#game_wrapper");
    var doc = $("#wrapper");
    var imgWidth = 798;
    var imgHeight = 402;
    var pattern = $("#pattern");
    var mask = $("#mask");
    var UI = $("#UI");
    var scoreW = $("#score_wrapper");
    var paper = Raphael(0, 0, imgWidth, imgHeight);
    var svg = $("svg");
    var overlay = $("#overlay");
    var leftControls = $("#left_controls");
    var bottomControls = $("#bottom_controls");
    var rightControls = $("#right_controls");
    var adjuster = new Adjuster({
        d: doc,
        g:gameW,
        fx:fx,
        p: pattern,
        m: mask,
        ui: UI,
        o: overlay
    }, paper, svg, imgWidth, imgHeight, true);
    var intro = new Array;
    var nextVideo = new Array();
    var userId = 0;
    var weaponId;
    var map = new IronMap("map_canvas");
    var weaponCount = {};
    var answer = {};
    var currentQuestion;

    var tuit;
    var trivia;
    var video;
    var frameNum = 0;
    var newPlayer = true;
    var km = 0;

    var imgLoader = new ImageLoader();
    var player = new ScenePlayer(10, paper);
	var game = new Game(gameW);
   /*******  Interaction Handlers *******/
    function interactionHandler(e) {

    	_gaq.push(['_trackEvent', 'Click', e.target.value, 'App event']);
    	pressSound.play();
        switch (e.target.value) {
        case "play":
            hideOverlay();
            acceptSound.play();
            break;
        case "share":
        	scrleft = (screen.width / 2) - (400 /2); //centres horizontal
        	scrtop = ((screen.height / 2) - (200 /2)) - 40; //centres vertical
        	mywindow = window.open("https://www.facebook.com/sharer/sharer.php?u=http://ironman4glte.com/", "mywindow", "location=1,status=1,scrollbars=1,  width=400,height=200,left="+scrleft+",top="+scrtop);
        break;
        case "help":
            showOverlay(e.target.value);
            break;
        case "ranking":
            showOverlay(e.target.value);
        break;
        case "go3":
        	if(game.getToken()){
        		showOverlay("advertGame");
        	}else{
        		showOverlay("advertAcumulables");
        	}
			var timeOut = setTimeout(function() {
				hideOverlay();
	        	mask.fadeOut();
	        	scoreW.fadeIn();
	        	UI.fadeOut(function(){
	        		game.start();
	        	});
			},2000);

    	break;
        case "attack":
            weaponId = $(e.target).index();
        	if(weaponCount[weaponId] > 0){
        		showOverlay(e.target.value);
                $("#attack_tuit").children().hide();
                $('#attack_tuit').children().eq(weaponId).show();
                $("#attack_ranking ul li").removeClass("active");
        	}else{
        		showOverlay("advertWeapon");
        	}

            break;
        case "destroy":
            if (userId) {
            	acceptSound.play();
                $.ajax({
                	type: "POST",
                    dataType: "json",
                    url: service+"index.php/call/realizar_disparo/",
                    data: {
                        arma: weaponId+1,
                        objetivo: userId.id
                    },
                    success: function (e) {
                        var temp = weaponSound.eq(weaponId);
                        temp[0].play();
                        hideOverlay();
                        $(userId).removeClass("active");
                        weaponCount[weaponId] = weaponCount[weaponId]-1;
                        if(weaponCount[weaponId] == 0){
                            $('#weapon_block #weapon_indicator').children().eq(weaponId).attr("disabled","disabled")
                        }
                        $('#weapon_block #weapon_count').children().eq(weaponId).html(weaponCount[weaponId]);

                    }
                });
            }

            break;
            default:
            $(e.target).parent().children().removeClass("active");
            $(e.target).addClass("active");

            if (e.target.id != 0) {
                userId = e.target;
            };
        }
    }

    /******* Set Init Data ********/

    function setInitData(e) {

    	if(e.data.token){
        	game.setToken(e.data.token);
    	}else{
        	game.setToken(false);
    	}
    	if(e.data.score){
    		$("#advertScore_wrapper span").html(e.data.score+"km");
            showOverlay("advertScore");
    	}
    	km = e.data.info.kilometrosRecorridos;
    	$("#km_counter").html(km+" Km");
    	if(km > 0){
    		newPlayer = false;
    	}else{
    		newPlayer = true;
    	}

        $("#avatar_block img").attr("src",e.data.profile_image_url);
        $("#avatar_block span").html(e.data.info.idTwitter);

        weaponCount[0] = e.data.arma1;
        weaponCount[1] = e.data.arma2;
        weaponCount[2] = e.data.arma3;

        $('#weapon_block #weapon_count').children().eq(0).html(weaponCount[0]);
        $('#weapon_block #weapon_count').children().eq(1).html(weaponCount[1]);
        $('#weapon_block #weapon_count').children().eq(2).html(weaponCount[2]);

        $("#ranking_wrapper ul").html("");

        for (x in e.data.ranking)
        {
        	$("#ranking_wrapper ul").append('<li id="'+e.data.ranking[x].idUsuario+'">'+e.data.ranking[x].idTwitter+'</li>');
        }

        if(e.data.coordenada){
        	map.addMarker(e.data.coordenada.latitud, e.data.coordenada.longitud);
        }

    	if(trivia){

            video = e.data.siguienteVideo;
            frameNum = e.data.frames;
            imgLoader.load(frameNum,frameNum,video+"/"+video+"_",function(e){
                nextVideo = e.imageArray;
            });
    	}

        $("#ranking_block ul").html("");
        $("#attack_ranking ul").html("");

        var temp = e.data.rankingProximo.anteriores;
        var xj = 1;
        for (x in temp){

        	$("#ranking_block ul").append('<li id="' + temp[x].idUsuario + '"><span>'+temp[x].posicion+'</span>'+ temp[x].idTwitter+ '</li>');
        	if( xj > 2){
            	$("#attack_ranking ul").append('<li value="user" class="interaction" id="' + temp[x].idUsuario + '">'+ temp[x].idTwitter+ '</li>');
        	}
        	xj++;
    	}

		$("#ranking_block ul").append('<li class="me" ><span>'+ e.data.info.posicion+'</span>'+ e.data.info.idTwitter+ '</li>');
    	temp = e.data.rankingProximo.siguientes;
    	xj = 0	;
        for (x in temp){

            $("#ranking_block ul").append('<li id="' + temp[x].idUsuario + '"><span>'+temp[x].posicion+'</span>'+ temp[x].idTwitter+ '</li>');
        	if(xj < 2){

            	$("#attack_ranking ul").append('<li value="user" class="interaction" id="' + temp[x].idUsuario + '">'+ temp[x].idTwitter+ '</li>');
            	xj++;

        	}

        }

        $("#go_content").html(tuit);

        $(".interaction").off("click", interactionHandler);
        $(".interaction").on("click", interactionHandler);

    }

    /********* Overlay functions *********/

    function showOverlay(key) {

    	if(!key){
    		$("#loader").addClass("active_wrap").show();
    	}else{
        	$("#" + key + "_wrapper").append('<button id="close" class="close" ></button>');
        	$("#" + key + "_wrapper").addClass("active_wrap").show();
        	$(".close").on("click",function(){ hideOverlay() });
    		$("#prompt_wrapper").show();
    	}
        overlay.fadeIn();
    }

    function hideOverlay(c) {
        overlay.fadeOut(function () {
            $(".active_wrap").hide().removeClass("active_wrap");
            if($(".active_wrap").children(".close")){
            	$(".active_wrap").children(".close").remove();
                $(".close").off();
            }
            if (c) {
                c();
            }
        });
    };

    /********** Intro image load *********/

    function init(){
    	$("#preload").remove();
        imgLoader.load(50, 50, "game/game", function (e) {
            intro = e.imageArray;
            $.ajax({
                dataType: "json",
                url: service+"index.php/call/carga_inicial2/",
                success: function (e) {
                    if (e.success) {
                 	   setInitData(e);
                        hideOverlay(function () {
                        	fx.fadeIn();
                            leftControls.animate({
                                left: 0
                            });
                            bottomControls.animate({
                                bottom: 0
                            });
                            rightControls.animate({
                                right: 0
                            }, function () {
                            	if(newPlayer){
                            		showOverlay("help");
                            	}
                            });

                        });
                        loadSound.pause();
                        ambientSound.play();

                       player.play(intro, true);

                    } else {
                        self.location="index.html";
                    }
                }
            });
        });
    }

    /******** Events *******/
    gameW.on("onFinish", function(e){

    		if(e.CXV){
    			var CXV = e.CXV;
    			$.ajax({
    		     	type: "POST",
    		        dataType: "json",
    		        data:{CXV:CXV},
    		        url: service+"index.php/call/reload",
    		        success: function (e) {
    		        	if(e.data){
    		        		setInitData(e);
						}
    		         }
    		     });
    		}

    	scoreW.fadeOut();
    	mask.fadeIn();
    	UI.fadeIn(function(){

    	});
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            hideOverlay();
        }
    });

    $(window).load(function(){
    	init();
    });

    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    $(".attack").tooltip();

};