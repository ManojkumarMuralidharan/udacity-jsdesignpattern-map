// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["jquery", "knockout","http://maps.google.com/maps/api/js?sensor=false"], function($, ko) {

  ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // First get the latest data that we're bound to
		var value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);
        var _self_ = this;
         var locations = bindingContext.$data.locations;
        var latLng = new google.maps.LatLng(valueUnwrapped[0].latitude, valueUnwrapped[0].longitude);
       // console.log('This works'+JSON.stringify(latLng));
        var mapOptions = {
            zoom: 10,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        this.map = new google.maps.Map(element,mapOptions);
       google.maps.event.addListener(map, 'click', function(event){

            locations.push({name: "New", latitude:event.latLng.lat(), longitude:event.latLng.lng()});
            var markerA = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
            });

        });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
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


  ko.bindingHandlers.searchlocations = {
    init: function (element, valueAccessor, allBindingsAccessor,  viewModel, bindingContext) {
        // First get the latest data that we're bound to
    var value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        var searchValue = ko.unwrap(value);
        var results = bindingContext.$data.searchResults;
        // if(searchValue==''){
        //   results.removeAll();
        //   return;
        // }
        var _self_ = this;
        var locations = bindingContext.$data.locations;
        
        //Reset the search results

        locations().forEach(function(value){
           if(value.name.indexOf(searchValue)>-1){
            results.push(value);
           }
        });

        //console.dir(locations);        

    },
    update: function(element, valueAccessor, allBindingsAccessor){
    var value = valueAccessor(), 
      _self_ = this;
        // Next, whether or not the supplied model property is observable, get its current value
        var searchValue = ko.unwrap(value);
        var results = allBindingsAccessor()['results'];
        // if(searchValue==''){
        //   results.removeAll();
        //   return;
        // }
        var locations = allBindingsAccessor()['locations'];
        
        //Reset the search results
        results.removeAll();

       
        locations().forEach(function(value){
           if(value.name.indexOf(searchValue)>-1){
            results.push(value);
           }
        });

        
        //console.log('Loc:'+results);        
    }
  };

  var Markers = function(){
  	var _self_ = this;
  	this.mapMarkers = ko.observableArray([]);

  	this.init = function(){
		_self_.addMarkers({name: "Cleveland", latitude:41.48 , longitude:-81.67});
		_self_.addMarkers({name: "Chicago", latitude: 41.88, longitude: -87.63});
  	}

  	this.addMarkers = function(marker){
  		_self_.mapMarkers.push(marker);
  	}
  	this.getMarker = function(marker){
  		return _self_.mapMarkers();
  	}
  	this.init();

  }


  var LocationViewModal = function(markerCollection){
	var _self_ = this;
	
    this.init = function (){
    	_self_.markers = markerCollection;
    };

    this.getLocationMarkers = function (){
		return _self_.markers.getMarker();
    };
    this.init();

  };

  var AppViewModel = function () {
    this.status = ko.observable('active');
    this.markerCollection = new Markers();
	  this.locationManager = new LocationViewModal(this.markerCollection);
    this.locations = this.markerCollection.mapMarkers; //this.locationManager.getLocationMarkers();
    this.searchResults = ko.observableArray([]);
    this.searchValue = ko.observable('Enter a location name...');

  };
  ko.applyBindings(new AppViewModel());
});
