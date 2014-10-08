var App = function () {

    document.ontouchmove = function (e) {
        e.preventDefault();
    };

    var scale = 1;
    var doc = $("#wrapper");
    var imgWidth = 798;
    var imgHeight = 402;
    var pattern = $("#pattern");
    var mask = $("#mask");
    var UI = $("#UI");
    var paper = Raphael(0, 0, imgWidth, imgHeight);
    var svg = $("svg");
    var overlay = $("#overlay");
    var leftControls = $("#left_controls");
    var bottomControls = $("#bottom_controls");
    var rightControls = $("#right_controls");
    var adjuster = new Adjuster({
        d: doc,
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
    var tuit;
    var video;



    var imgLoader = new ImageLoader();
    var player = new ScenePlayer(10, paper);

    /******** Events *******/


    $(document).keyup(function (e) {
        if (e.keyCode == 27) {

            hideOverlay();

        } // esc
    });


    function interactionHandler(e) {

        //console.log(e.target.title);

        switch (e.target.title) {

        case "play":
            hideOverlay();
            break;
        case "help":
            showOverlay(e.target.title);
            break;
        case "go":
	
        	if(tuit){
        		
        		showOverlay(e.target.title);
        		
        	}            
            break;
        case "send":
        	
    	    $.ajax({
                dataType: "json",
                url: "/telcel-ironman/servicio/index.php/call/avanzar",
                success: function (e) {
                	
                	
                	if(e.success){
                		
                		player.play(nextVideo, function(){

                            player.play(intro, true);
                			
                		});
                		
                   	   setInitData(e);
                   	   hideOverlay();
                	}else{
                		
                		tuit=false;
                	}
                		


                }
            });
    	    
    	    

            break;
        case "attack":
        	
            weaponId = $(e.target).index();

        	
        	if(weaponCount[weaponId] > 0){
        		
        		showOverlay(e.target.title);
                                
                $("#attack_tuit").children().hide();
                $('#attack_tuit').children().eq(weaponId).show();
        		
        	}
            
            break;
        case "user":

            $(e.target).parent().children().removeClass("active");
            $(e.target).addClass("active");

            if (e.target.id != 0) {

                userId = e.target;

            };
            break;
        case "destroy":

            if (userId) {

                $.ajax({
                	type: "POST",
                    dataType: "json",
                    url: "http://qa1.clarusdigital.com/telcel-ironman/servicio/index.php/call/realizar_disparo/",
                    data: {
                        arma: weaponId+1,
                        objetivo: userId.id
                    },
                    success: function (e) {

                        //console.log(e);
                        hideOverlay();
                        $(userId).removeClass("active");
                        
                        weaponCount[weaponId] = weaponCount[weaponId]-1;  
                        $('#armor_block #armor_count').children().eq(weaponId).html(weaponCount[weaponId]);

                    }
                });

            }

            break;


        }

    }

    /******* Set Init Data ********/

    function setInitData(e) {


        //console.log(e.data.info);

        $("#avatar_block img").attr("src", "https://api.twitter.com/1/users/profile_image?screen_name=" + e.data.info.idTwitter + "&size=bigger");
        $("#avatar_block span").html(e.data.info.idTwitter);

        
        var temp = e.data.rankingProximo.siguientes;

        if(temp[1]){


        $("#ranking_block ul").append('<li id="' + temp[0].idUsuario + '">' + temp[0].nombre + '</li>');
        $("#ranking_block ul").append('<li id="' + temp[1].idUsuario + '">' + temp[1].nombre + '</li>');
        
        }
        
    	temp = e.data.rankingProximo.anteriores;


        if(temp[1]){
        	

            $("#ranking_block ul").append('<li id="' + temp[0].idUsuario + '">' + temp[0].nombre + '</li>');
            $("#ranking_block ul").append('<li id="' + temp[1].idUsuario + '">' + temp[1].nombre + '</li>');

        	
        }
        

        $('#armor_block #armor_count').children().eq(0).html(e.data.arma1);
        $('#armor_block #armor_count').children().eq(1).html(e.data.arma2);
        $('#armor_block #armor_count').children().eq(2).html(e.data.arma3);
        
        weaponCount[0] = e.data.arma1;
        weaponCount[1] = e.data.arma2;
        weaponCount[2] = e.data.arma3;
        
        if(e.data.siguienteTweet){
        	
        	//console.log("tenemos otro tiro");
        	
        	tuit = e.data.siguienteTweet;
            video = "periferico1";
            
            imgLoader.load(150,150,video+"/"+video+"_",function(e){
            	            	
                nextVideo = e.imageArray;
                
            });
        	
        }
       
        
        $("#go_content").html(tuit);


        $("#attack_ranking ul").html($("#ranking_block ul").html());
        $("#attack_ranking ul li").addClass("interaction");
        $("#attack_ranking ul li").attr("title", "user");

        $(".interaction").on("click", interactionHandler);




    }

    /********* Overlay functions *********/

    function showOverlay(key) {
        $("#" + key + "_wrapper").addClass("active_wrap").show();
        overlay.fadeIn();

    }

    function hideOverlay(c) {


        overlay.fadeOut(function () {

            if (c) {
                c();

            }
            $(".active_wrap").hide().removeClass("active_wrap");

        });

    };
    
    
    /********** Intro image load *********/

    imgLoader.load(20, 20, "loop2/loop2_", function (e) {
        intro = e.imageArray;
        //console.log(intro);
        player.play(intro, true);
        

    });




};