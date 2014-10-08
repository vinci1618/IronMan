var App = function () {
	window.scrollTo(0, 1);
	var service = "/telcel-ironman/servicio/";
    var imgWidth = 480;
    var imgHeight = 300;
    var paper = Raphael(0, 0, imgWidth, imgHeight);
    var svg = $("svg");
    var pattern = $("#pattern");
    var overlay = $("#overlay");
    var UI = $("#UI");
    var xx = $("#advertPortrait");
    var doc = $("body");


    var weaponCount = {};
    var answer = {};
    var currentQuestion;

    var tuit;
    var trivia;
    var video;
    var frameNum = 0;

    var adjuster = new Adjuster({
        b:doc,
        p: pattern,
        o:overlay,
        u:UI
    }, paper, svg, imgWidth, imgHeight, true);

    var imgLoader = new ImageLoader();
    var player = new ScenePlayer(10, paper);


    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    $(window).on("load",function(){

    	init();
    	optionalData();
    	window.scrollTo(0, 1);



    });

    function setInitData(e) {

    	km = e.data.info.kilometrosRecorridos;
    	$("#km_counter").html(km+" Km");


        $("#avatar_block img").attr("src", "https://api.twitter.com/1/users/profile_image?screen_name=" + e.data.info.idTwitter+ "&size=bigger");
        $("#avatar_block span").html(e.data.info.idTwitter);


        weaponCount[0] = e.data.arma1;
        weaponCount[1] = e.data.arma2;
        weaponCount[2] = e.data.arma3;

//        $('#weapon_block #weapon_indicator').children().eq(0).addClass("l"+weaponCount[0]+"w")
//        $('#weapon_block #weapon_indicator').children().eq(1).addClass("l"+weaponCount[1]+"w")
//        $('#weapon_block #weapon_indicator').children().eq(2).addClass("l"+weaponCount[2]+"w")

//        $('#weapon_block #weapon_count').children().eq(0).html(weaponCount[0]);
//        $('#weapon_block #weapon_count').children().eq(1).html(weaponCount[1]);
//        $('#weapon_block #weapon_count').children().eq(2).html(weaponCount[2]);



    	if(trivia){


            video = e.data.siguienteVideo;
            frameNum = e.data.frames;

            imgLoader.load(frameNum,frameNum,video+"_m/"+video+"",function(e){

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


//        $("#attack_ranking ul").html($("#ranking_block ul").html());
//
//        $("#attack_ranking ul li").addClass("interaction");
//        $("#attack_ranking ul li").attr("title", "user");
//

        $(".interaction").off("click", interactionHandler);
        $(".interaction").on("click", interactionHandler);

    }


    function optionalData(){

    	$.ajax({
    		type: "POST",
    	    dataType: "json",
    	    url: service+"index.php/call/obtener_pregunta",
    	    success: function (e) {


    	    	if(e.success){

    	    		var preguntas = e.data;

    	    		if(preguntas){

    	    			trivia = true;

    	    			var count =0;

    	    			for (x in preguntas){

//	    	    			console.log(e.data[x]);

	    	    			var p = '<div class="question_wrapper"><p >'+preguntas[x].pregunta+'</p></div>';

	    	    			var respuestas = preguntas[x].respuestas;
	    	    			var r ="";

	    	    			for (y in respuestas){


		    	    			if(count == 1){
		    	    				r += '<button id="'+respuestas[y].idRespuesta+'"></button>';

		    	    			}else{

		    	    				r += '<li id="'+respuestas[y].idRespuesta+'">'+respuestas[y].respuesta+'</li>';

		    	    			}

//	    	    				console.log(respuestas[y]);
	        	    			//$("#answer_wrapper ul").append('<li id="'+respuestas[y].idRespuesta+'">'+respuestas[y].respuesta+'</li>');

	    	    			}

	    	    			if(count == 1){

	    	    				$("#trivia_content").append('<div id="'+preguntas[x].idPregunta+'" class="question_row">'+p+'<div class="answer_wrapper">'+r+'</div></div>');
	    	    			}else{
	    	    				$("#trivia_content").append('<div id="'+preguntas[x].idPregunta+'" class="question_row">'+p+'<div class="answer_wrapper"><ul>'+r+'</ul></div></div>');
	    	    			}
	    	    			count++;

	    	    		}

	    	    		currentQuestion = 0;
	    	    		$("#trivia_wrapper").css("background-image","url(statics/img/trivia_background.png)");
	    	    		$('#trivia_content').children().eq(currentQuestion).show();
	    	    		$("#trivia_wrapper").addClass("normal")
	    	    		$(".answer_wrapper ul li").on("click",function(e){

	    	    			$(".answer_wrapper ul li").removeClass("active");
	    	    			$(e.target).addClass("active");

	    	    			answer["respuesta"+(currentQuestion+1)] = e.target.id;

	    	    		});

	    	    		$(".answer_wrapper button").on("click",function(e){

	      	    			$(".answer_wrapper button").removeClass("active");
	    	    			$(e.target).addClass("active");
	    	    			answer["respuesta"+(currentQuestion+1)] = e.target.id;


	    	    		});
	    	    		$("#nextBtn").on("click",function(){

	    	    			if(answer["respuesta"+(currentQuestion+1)]){

	        	    			if(currentQuestion <2){


	            	    			currentQuestion++;

	            	    			if(currentQuestion == 1){

	            	    	    		$("#trivia_wrapper").removeClass("normal").addClass("alt");
	            	    	    		$("#trivia_wrapper").css("background-image","url(statics/img/trivia_"+$('#trivia_content').children().eq(currentQuestion).attr("id")+".png)");

	            	    			}else{
	            	    	    		$("#trivia_wrapper").css("background-image","url(statics/img/trivia_background.png)");
	            	    	    		$("#trivia_wrapper").removeClass("alt").addClass("normal");

	            	    			}

	                	    		$('.question_row').hide();
	                	    		$('#trivia_content').children().eq(currentQuestion).show();


	        	    			}else{

	        	    				hideOverlay();
	        	    				trivia = false;
	        	    			  	$.ajax({
	        	    		    		type: "POST",
	        	    		    		data:answer,
	        	    		    	    dataType: "json",
	        	    		    	    url: service+"index.php/call/responder_trivia",
	        	    		    	    success: function (e) {

	        	                           	if(e.success){
		        	    		    	    	trivia = false;


//	        	                           		var score = e.data.respuesta1 + e.data.respuesta2 + e.data.respuesta3;
	        	                           		$("#advertAnswer_wrapper").addClass("correct"+e.data.respuesta1+"_"+e.data.respuesta2+"_"+e.data.respuesta3);

		        	                         	   setInitData(e);

			        	                     		player.play(nextVideo, function(){

			        	                                player.play(intro, true);
			        	                           		showOverlay("advertAnswer");


			        	                    		});

		        	                      	}

	        	    		    	    	}
	        	    		    	    });


	        	    			}
	    	    			}



	    	    		});


    	       		}


    	    	}

    	    }
    	});
    }

    function init(){


    	imgLoader.load(20, 20, "loop2/loop2_", function (e) {
            intro = e.imageArray;
            $.ajax({
                dataType: "json",
                url: service+"index.php/call/carga_inicial2/",
                success: function (e) {



                    if (e.success) {

                  	   setInitData(e);

                        hideOverlay(function () {


                        	      $("#avatar_block").animate({
                        	    	  left: 0
                        		  });
                        		  $("#menu_block").animate({
                        		      bottom: 0
                        		  });
                        		  $("#header").animate({
                        		      top: 0
                        		  }, .2,"linear", function () {


                        		  });


                        });

                       player.play(intro, true);





                    } else {
                        self.location="index.html";

                    }


                }
            });


        });

    }


    function showOverlay(key) {

    	if(!key){

    		$("#loader").addClass("active_wrap").show();

    	}else{
        	$("#" + key + "_wrapper").append('<button id="close" class="close" ></button>');
        	$("#" + key + "_wrapper").addClass("active_wrap").show();
        	$(".close").on("click",function(){ hideOverlay() });
    		$("#prompt_wrapper").show();
    	}
    	overlay.show();
        overlay.animate({
  		  opacity: 1
		});

    }

    function hideOverlay(c) {


    	overlay.anim({
    		  opacity: 0
    		}, .2, 'linear', function(){

    			overlay.hide();

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

    /*******  Interaction Handlers *******/

    function interactionHandler(e) {

    	_gaq.push(['_trackEvent', 'Click', e.target.value, 'App event']);

//    	pressSound.play();

        switch (e.target.value) {

        case "go2":
        	if(trivia){
            	if(imgLoader.getStatus()){


            		showOverlay();
            		imgLoader.addEvent(function(e){

            			nextVideo = e.imageArray;
                		hideOverlay(function(){

                			showOverlay("trivia");

                		});
             		});

            	}else{
            		showOverlay("trivia");
            	}

        	}else{

        		showOverlay("advertTrivia");

        	}
        break;
        case "send":
//        	acceptSound.play();
    	    $.ajax({
                dataType: "json",
                url: service+"index.php/call/avanzar",
                success: function (e) {

                       	if(e.success){

                        	   setInitData(e);
                        	   hideOverlay();
                     	}else{
                     		hideOverlay();
                         	setInitData(e);
                     	}

                 		player.play(nextVideo, function(){

                             player.play(intro, true);

                 		});

                }
            });

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
                $.ajax({
                	type: "POST",
                    dataType: "json",
                    url: service+"index.php/call/realizar_disparo/",
                    data: {
                        arma: weaponId+1,
                        objetivo: userId.id
                    },
                    success: function (e) {

//                        var temp = weaponSound.eq(weaponId);
//                        temp[0].play();

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
    window.addEventListener("resize", function() {
    	window.scrollTo(0, 1);
    	adjuster.temp();

    }, false);

	adjuster.temp();

};