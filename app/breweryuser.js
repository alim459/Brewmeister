var baseURL = 'http://localhost:8080'

var app = angular.module('Brewmaster', ['ngMaterial']);
app.controller('AppCtrl', function($scope, $mdDialog, $mdMedia, $rootScope, $http) {
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey');
});

app.controller('SearchCtrl', function($scope, $http, $timeout, $rootScope, $mdDialog) {
    $scope.beer = {};
    $scope.beerTypeCategories = ["IPA", "Pilsner", "Porter", "Stout", "Lager"];
    $scope.abvCategories = ["<4%", "4-4.99%", "5-5.99%", "6-6.99%", ">7%" ];
    $scope.ibuCategories = ["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", ">70"];
    $scope.ratingCategories = ["1", "2", "3", "4"];
    $rootScope.searchResults = [];

    $scope.submitBeer = function(ev){
    	if (!validSubmission()) {
    		$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.textContent('Yo dawg, check that all fields are entered, and that IBU/ABV are numbers')
					.ariaLabel('Alert Dialog Demo')
					.ok('Got it!')
					.targetEvent(ev)
	    	);

    	} else {
            var url = baseURL + '/beers';
            console.log('making POST to ' + url + 'with a payload of ' + JSON.stringify($scope.beer));
    		$http({
                method: 'POST',
                url: baseURL + '/beers'
            }).then(function successCallback(response) {
                console.log('received a response of ' + JSON.stringify(response.data));
                if (response.data.created === true){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .textContent('Beer successfully created.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                    );
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .textContent('Beer creation failed. Try a different name.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                    );
                }
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }); 

    	}

  
    }

    function validSubmission(){
    	if (!$scope.beer.hasOwnProperty('bname') || !$scope.beer.hasOwnProperty('breweryName') ||
            !$scope.beer.hasOwnProperty('abv') || !$scope.beer.hasOwnProperty('ibu') || 
            !$scope.beer.hasOwnProperty('description') || isNaN(parseFloat($scope.beer.abv)) || 
            isNaN(parseFloat($scope.beer.abv))) {
                return false;
        } else {
            return true;
        }
    }

});
var selectedBeer = {};
app.controller('UpdateCtrl', function($scope, $http, $timeout, $rootScope, $mdDialog, $mdMedia) {
    $scope.brewery = '';
    $rootScope.searchResults = [];
    $scope.newDescription = '';
    // $scope.selectedBeer = {"a-fake":"beer"};

    $scope.searchBeer = function(ev){
        if($scope.brewery === ''){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .textContent('Yo dawg, please provide your brewery\'s name')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        } else {
            var url = baseURL + '/beers?breweryName=' + $scope.brewery;
            console.log('making HTTP GET to ' + url);
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                $rootScope.searchResults = response.data;
                console.log("the search results are " + JSON.stringify($rootScope.searchResults));
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }
    }

    $scope.updateDescription = function(ev, beer){
        selectedBeer = beer;
        console.log('selectedBeer is now' + JSON.stringify(selectedBeer));
        console.log('trying to update the beer: ' + JSON.stringify(selectedBeer));
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DescriptionController(beer, $scope),
                templateUrl: '../app/updatedialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
    }

    $scope.submitDescription = function(ev){
        console.log('the new description is ' + $scope.newDescription);
        if ($scope.newDescription === ''){
            // $scope.selectedBeer = {};
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .textContent('Yo dawg, please provide a new description')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        } else {
            //TODO: modify t back to bname
            console.log('selectedBeer is ' + JSON.stringify(selectedBeer));
            var url = baseURL + '/beer/' + selectedBeer.name;
            var payload = {'description':$scope.newDescription};

            console.log('Making HTTP POST to ' + url + ' with a payload of ' + JSON.stringify(payload)); //!!!
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then(function successCallback(response) {
                console.log('received a response of ' + JSON.stringify(response.data));
                if (response.data.updated === true){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .textContent('Successfully updated description.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                    );
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .textContent('Update failed.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                    );
                }

                // $scope.newDescription = '';
                // $scope.selectedBeer = {};
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

    }

});

function DescriptionController(beer, $scope){
    $scope.selectedBeer = beer;
}