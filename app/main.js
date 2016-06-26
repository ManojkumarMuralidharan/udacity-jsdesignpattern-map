// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["jquery", "knockout","http://maps.google.com/maps/api/js?sensor=false"], function($, ko) {

  ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor) {
        // First get the latest data that we're bound to
		var value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);


        var latLng = new google.maps.LatLng(valueUnwrapped[0].latitude, valueUnwrapped[0].longitude);
       // console.log('This works'+JSON.stringify(latLng));
        var mapOptions = {
            zoom: 10,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        this.map = new google.maps.Map(element,mapOptions);
    },
    update: function(element, valueAccessor){
		var value = valueAccessor(), 
			_self_ = this;
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        valueUnwrapped.forEach(function(value){
	        var latLng = new google.maps.LatLng(value.latitude, value.longitude);
			//console.log('This works too'+JSON.stringify(latLng));

			_self_.marker = new google.maps.Marker({
	            position: latLng,
	            map: this.map
	          });	
        })
        
    }
  };

  var Markers = function(){
  	var _self_ = this;
  	this.mapMarkers = ko.observableArray([]);

  	this.addMarkers = function(marker){
  		_self_.mapMarkers.push(marker);
  	}
  	this.getMarker = function(marker){
  		return _self_.mapMarkers();
  	}

  }

  var LocationViewModal = function(){
	var _self_ = this;
	
    this.init = function (){
    	_self_.markers = new Markers();
		_self_.markers.addMarkers({name: "Cleveland", latitude:41.48 , longitude:-81.67});
		_self_.markers.addMarkers({name: "Chicago", latitude: 41.88, longitude: -87.63});
    };

    this.getLocationMarkers = function (){
		return _self_.markers.getMarker();
    };
    this.init();

  };

  var AppViewModel = function () {
    this.status = ko.observable('active');
	this.locationManager = new LocationViewModal();
    this.locations = this.locationManager.getLocationMarkers();

  };
  ko.applyBindings(new AppViewModel());
});
