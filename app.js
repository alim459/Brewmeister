var mockMode = true;
var debugMode = false;
var baseURL = 'http://localhost:8080'
var userid = 1;
var mockBeers = [
 	{
	  	"bname": "Thunderbird Lager",
	  	"breweryName": "UBC Brewery",
	  	"type": "Lager",
	  	"abv": "5.1%",
	  	"ibu": "10 bitterness units",
	  	"imageLocation": "images/stock-beer.jpg",
	  	"vendors":[
	  		{"StoreName":"Legacy Liquor Store"},
	  		{"StoreName":"BC Liquore Store"}
	  	]
  	},
  	{	
	  	"bname": "Passive Aggressive",
	  	"breweryName": "Brassneck",
	  	"type": "IPA",
	  	"abv": "5.3%",
	  	"ibu": "2 bitterness units",
	  	"imageLocation": "images/ipa.jpg",
	  	"vendors":[
	  		{"StoreName":"Another Liquor Store"},
	  		{"StoreName":"Darby's"}
	  	]
  	},
  	{
	  	"bname": "Southern Hop",
	  	"breweryName": "Main Street Brewery",
	  	"type": "IPA",
	  	"abv": "6.1%",
	  	"ibu": "20 bitterness units",
	  	"imageLocation": "images/stock-beer.jpg",
	  	"vendors":[]
	},
	{
	  	"bname": "Sun God Wheat Ale",
	  	"breweryName": "R&B Brewery",
	  	"type": "Hefeweizen",
	  	"abv": "5.6%",
	  	"ibu": "2 bitterness units",
	  	"imageLocation": "images/TownHallHefeweizen.jpg",
	  	"vendors":[]
	}
]

var app = angular.module('Brewmaster', ['ngMaterial']);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey');
});


app.controller('AppCtrl', function($scope, $mdDialog, $mdMedia, $rootScope, $http) {

	$rootScope.uuid = null;
	$rootScope.loading = false;
	//this block used to get the recommended beers, and set to a scope variable
	if (mockMode) {
		$scope.recommendedBeers = mockBeers;
  	} else {
  		$http({
		    method: 'GET',
		    url: baseURL + '/recommendedbeers?userid=' + userid
		}).then(function successCallback(response) {
			console.log('recommended beers are ' + JSON.stringify(response.data));
		    $scope.recommendedBeers = response.data;
		}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});	
  	}

  	//called when a vendor is clicked
  	$scope.showVendors = function(ev, beer) {
  		if (beer.vendors.length === 0){
  			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.textContent('No vendors found for ' + beer.bname)
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);

  		} else if (mockMode){
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    $mdDialog.show({
			        controller: VendorDialogCtrl,
			      	templateUrl: 'app/vendordialog.html',
			      	parent: angular.element(document.body),
			      	targetEvent: ev,
			      	clickOutsideToClose:true,
			      	fullscreen: useFullScreen,
			      	locals:{
			      		beer: beer
			      	}
			    });

  		} else {
 
		    $mdDialog.show({
		        controller: VendorDialogCtrl,
		      	templateUrl: 'app/vendordialog.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
		      	fullscreen: useFullScreen,
		      	locals:{
                    beer: beer
                }
		    });
	    }
 
 		function VendorDialogCtrl($scope, $mdDialog, beer){
        	$scope.selectedBeer = beer;

        	$scope.showVendorPage = function(ev, vendor){
        		$mdDialog.show({
			        controller: VendorPageCtrl,
			      	templateUrl: 'app/vendortemplate.html',
			      	parent: angular.element(document.body),
			      	targetEvent: ev,
			      	clickOutsideToClose:true,
			      	fullscreen: useFullScreen,
			      	locals:{
			      		vendor: vendor
			      	}
			    });


        	}
		}

		function VendorPageCtrl($scope, $mdDialog, vendor){
			$scope.vendor = vendor;
			$scope.beers = []
			//$scope.beers = get the beers for this vendor by providing storeName
			if (mockMode) {
				$scope.beers = mockBeers;

			} else {
				//make the http request to the getbeersbyvendor here...

			}
		}
	}

	//called when the ratings button is clicked
  	$scope.showRatings = function(ev, beer) {

	    $mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#popupContainer')))
			.clickOutsideToClose(true)
			.title('Showing ratings for ' + beer.name)
			.textContent('You can specify some description text in here.')
			.ariaLabel('Alert Dialog Demo')
			.ok('Got it!')
			.targetEvent(ev)
	    );

		// console.log("clicked on a beer's vendors" + beer.name);
  	};

});

//controller used for search functionality
app.controller('SearchCtrl', function($scope, $http, $timeout, $rootScope) {
    $scope.beer = {};
    $scope.beerTypeCategories = ["IPA", "Pilsner", "Porter", "Stout", "Lager"];
    $scope.abvCategories = ["<4%", "4-4.99%", "5-5.99%", "6-6.99%", ">7%" ];
    $scope.ibuCategories = ["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", ">70"];
    $scope.ratingCategories = ["1", "2", "3", "4"];
    $rootScope.searchResults = [];

    $scope.submitSearch = function(ev){
  
    	if (mockMode){
	    	$rootScope.searchResults = [
			 	{
				  	"bname": "Thunderbird Lager",
				  	"breweryName": "UBC Brewery",
				  	"type": "Lager",
				  	"abv": "5.1%",
				  	"ibu": "10 bitterness units",
				  	"imageLocation": "images/stock-beer.jpg",
				  	"vendors":[
				  		{"StoreName":"Legacy Liquor Store"},
				  		{"StoreName":"BC Liquor Store"}
				  	]
			  	},
			  	{	
				  	"bname": "Passive Aggressive",
				  	"breweryName": "Brassneck",
				  	"type": "IPA",
				  	"abv": "5.3%",
				  	"ibu": "2 bitterness units",
				  	"imageLocation": "images/ipa.jpg",
				  	"vendors":[
				  		{"StoreName":"UBC Liquor Store"},
				  		{"StoreName":"BC Liquore Store"}
				  	]

			  	},
			  	{
				  	"bname": "Southern Hop",
				  	"breweryName": "Main Street Brewery",
				  	"type": "IPA",
				  	"abv": "6.1%",
				  	"ibu": "20 bitterness units",
				  	"imageLocation": "images/stock-beer.jpg",
				  	"vendors":[]
				},
				{
				  	"bname": "Sun God Wheat Ale",
				  	"breweryName": "R&B Brewery",
				  	"type": "Hefeweizen",
				  	"abv": "5.6%",
				  	"ibu": "2 bitterness units",
				  	"imageLocation": "images/TownHallHefeweizen.jpg",
				  	"vendors":[]
				}
	  		];
	  		console.log('the search results are ' + JSON.stringify($scope.searchResults));
	  		console.log('searchResults[0].name is now ' + $scope.searchResults[0].name);

	    } else {
	    	var url = convertBeerToURL();
	    	$rootScope.loading = true;
	    	console.log('rootScope.loading is ' + $rootScope.loading);
	    	console.log('making HTTP GET request to ' + url);
	    	$http({
			    method: 'GET',
			    url: url
			}).then(function successCallback(response) {
				console.log('received a response of ' + JSON.stringify(response.data));
			    $rootScope.searchResults = response.data;
			    console.log("the search results are " + JSON.stringify($scope.searchResults));
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
			$rootScope.loading = false;
			console.log('rootScope.loading is ' + $rootScope.loading);
	    }

	    function convertBeerToURL(){
	    	//!!! implement this
	    	// return 'http://localhost:8020/?/recommendedbeers?userid=1';
	    	var url = baseURL + '/beers';
	    	if (Object.keys($scope.beer).length === 0) {
	    		return url;
	    	} else {
	    		var str = jQuery.param($scope.beer);
	    		url = url + '?' + str;
				return url;
			}
	    }
	
    }

});




// renee-->all login/authentication functionality should sit here
app.controller('LoginCtrl', function($scope, $mdDialog, $mdMedia, $rootScope, $http) {
	$scope.loginInfo = {};
	$scope.signupInfo = {};
	


	//called when login button is clicked
	$scope.showLoginPrompt = function(ev){
		if ($rootScope.uuid === null){
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		    $mdDialog.show({
		        // controller: LoginPromtController,
		      	templateUrl: 'app/logindialog.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
		      	fullscreen: useFullScreen
		    });

		//if we already have a UUID, the user has already logged in
		} else {
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.textContent('Yo dawg, you\'ve already logged in!')
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);


		}
	}

	$scope.sendLoginInfo = function(ev){
		console.log('sending login info of: ' + JSON.stringify($scope.loginInfo));
		if (!$scope.loginInfo.hasOwnProperty('username') || !$scope.loginInfo.hasOwnProperty('password')){
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.textContent('Yo dawg, you need to provide us with both a username and password.')
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);

		//THE FOLLOWING CODE BLOCK IS UNTESTED, WAITING FOR LOGIN API IMPLEMENTATION
		} else {
			var str = jQuery.param($scope.loginInfo);
			var url = baseURL + '/login?' + str
			console.log('Making GET request to ' + url);
			$http({
		    	method: 'GET',
		    	url: url
			}).then(function successCallback(response) {
				if (response.data.authenticated === false){
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.textContent('Login Failed. Check that username and password are correct.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Got it!')
						.targetEvent(ev)
	    	
				} else {
					$rootScope.uuid = response.data.uuid;
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.textContent('Login info authenticated. Welcome back.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Got it!')
						.targetEvent(ev)
	    		
				}



			}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			});	
		}


	}


	$scope.showSignupPrompt = function(ev){
		if ($rootScope.uuid === null){
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		    $mdDialog.show({
		        // controller: LoginPromtController,
		      	templateUrl: 'app/signupdialog.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
		      	fullscreen: useFullScreen
		    });

		//if we already have a UUID, the user has already logged in
		} else {
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Yo dawg, you\'ve already logged in!')
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);
		}
	}

	$scope.sendSignupInfo = function(ev){
		console.log('sending signup info of: ' + JSON.stringify($scope.signupInfo));
		if (!$scope.signupInfo.hasOwnProperty('username') || !$scope.signupInfo.hasOwnProperty('password')){
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.textContent('Yo dawg, you need to provide us with both a username and password.')
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);

		//THE FOLLOWING CODE BLOCK IS UNTESTED, WAITING FOR LOGIN API IMPLEMENTATION
		} else {
			var url = baseURL + '/signup'
			console.log('Making POST request to ' + url + "with a body of " + JSON.stringify($scope.signupInfo));
			$http({
		    	method: 'POST',
		    	url: url,
		    	//TODO: check that the data payload is correct
		    	data: $scope.signupInfo
			}).then(function successCallback(response) {
				if (response.data.authenticated === false){
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.textContent('Signup failed. Try a different username.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Got it!')
						.targetEvent(ev)
	    	
				} else {
					$rootScope.uuid = response.data.uuid;
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.textContent('Signup successful. Welcome to Brewmeister.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Got it!')
						.targetEvent(ev)
	    		
				}



			}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			});	
		}
	}

});