var IronMap = function(id) {
	var markersArray = [];
	var lat;
	var long;
	var styles = [ {
		featureType : 'landscape',
		elementType : 'all',
		stylers : [ {
			hue : '#224f60'
		}, {
			saturation : 28
		}, {
			lightness : -71
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'landscape.man_made',
		elementType : 'all',
		stylers : [ {
			hue : '#207391'
		}, {
			saturation : 50
		}, {
			lightness : -61
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'road',
		elementType : 'all',
		stylers : [ {
			hue : '#80d2f0'
		}, {
			saturation : -21
		}, {
			lightness : 23
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'poi.park',
		elementType : 'all',
		stylers : [ {
			hue : '#1a647f'
		}, {
			saturation : 40
		}, {
			lightness : -62
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'road.highway',
		elementType : 'all',
		stylers : [ {
			hue : '#28d1ef'
		}, {
			saturation : -14
		}, {
			lightness : -15
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'poi.school',
		elementType : 'all',
		stylers : [ {
			hue : '#8ee6f6'
		}, {
			saturation : 72
		}, {
			lightness : -8
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'road.local',
		elementType : 'all',
		stylers : [ {
			hue : '#8ee6f6'
		}, {
			saturation : -15
		}, {
			lightness : -24
		}, {
			visibility : 'on'
		} ]
	}, {
		featureType : 'water',
		elementType : 'all',
		stylers : [ {
			hue : '#81d2e6'
		}, {
			saturation : 40
		}, {
			lightness : -7
		}, {
			visibility : 'on'
		} ]
	} ];

	var options = {
		mapTypeControlOptions : {
			mapTypeIds : [ 'Styled' ]
		},
		center : new google.maps.LatLng(19.438019159516003, -99.13311233520506),
		zoom : 2,
		mapTypeControl : false,
		navigationControl : false,
		streetViewControl : false,
		navigationControlOptions : {
			style : google.maps.NavigationControlStyle.SMALL
		},
		mapTypeId : 'Styled'
	};
	var div = document.getElementById(id);
	var map = new google.maps.Map(div, options);
	var styledMapType = new google.maps.StyledMapType(styles, {
		name : 'Styled'
	});
	map.mapTypes.set('Styled', styledMapType);

	this.addMarker = function(_lat,_long) {
		
		lat = _lat;
		long = _long

		clearOverlays();
		var markerPos = new google.maps.LatLng(lat, long);
		marker = new google.maps.Marker({
			position : markerPos,
			map : map
		});
		map.setCenter(markerPos);
		markersArray.push(marker);
		
		
		 var flightPlanCoordinates = [
		                              new google.maps.LatLng(19.438019159516003, -99.13311233520506),
		                              new google.maps.LatLng(lat, long),
		                          ];
		                          var flightPath = new google.maps.Polyline({
		                            path: flightPlanCoordinates,
		                            strokeColor: '#FF0000',
		                            strokeOpacity: 1.0,
		                            strokeWeight: 2
		                          });

		flightPath.setMap(map);

		

	};

	function clearOverlays() {
		for ( var i = 0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		}
		markersArray = [];
	}
	

};
