angular.module('alienLandingsApp', []);

var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function() {
   return function(distance){
       var numDistance, unit;
       if(distance && _isNumeric(distance)){
           if(distance > 1){
               numDistance = parseFloat(distance).toFixed(1);
               unit = 'km';
           } else {
               numDistance = parseInt(distance * 1000, 10);
               unit = 'm';
           }
           return numDistance + unit;
       } else {
           return "?";
       }
   };
};

var credibilityStars = function(){
    return {
        scope: {
          thisCredibility: '=credibility'
        },
        templateUrl: "/angular/credibility-stars.html"
    }
};

var landingListCtrl = function ($scope, alienLandingsData, geolocation) {
    $scope.message = "Checking your location";

    $scope.getData = function(position){
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        $scope.message = "Searching for alien landing sites";
        alienLandingsData.landingByCoords(lat,lng)
            .success(function(data){
                $scope.message = data.length >0 ? "": "No locations found";
                $scope.data = {landings: data};
            })
            .error(function(e){
                $scope.message = "An error happened during the landing search"
                console.log(e);
            });
    };

    $scope.showError = function (error) {
        $scope.$apply(function() {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function() {
        $scope.$apply(function(){
            $scope.message = "Geolocation not supported by this browser";
        })
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

var alienLandingsData = function($http){
    var landingByCoords = function(lat, lng){
        return $http.get('api/landings?lng=' + lng + '&lat=' + lat + '&maxDistance=20000');
    };

    return {
        landingByCoords: landingByCoords
    };
};

var geolocation = function() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        } else {
            cbNoGeo();
        }
    };

    return {
       getPosition: getPosition
    };
};

angular
    .module('alienLandingsApp')
    .controller('landingListCtrl', landingListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('credibilityStars', credibilityStars)
    .service('alienLandingsData', alienLandingsData)
    .service('geolocation', geolocation);