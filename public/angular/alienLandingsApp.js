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
                $scope.message = "Situation normal all Fucked Up"
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



   /* return[ { name: 'Roswell Incident',
        credibility: 3,
        discoveredAt: 'July 8, 1947',
        location: 'Roswell, New Mexico, USA',
        rumors: ['Alien Tech', 'Little Green Men', 'Crash Landing', 'Cover Up'],
        distance: '11435'
    },{
        name: 'Bangkok Fireball',
        credibility: 2,
        discoveredAt: 'September 17, 2015',
        location: 'Bangkok, Thailand',
        geo: {latitude: 13.7539800, longitude: 100.5014400},
        rumors: ['Fire In Sky', 'Hidden Landing'],
        distance: '9572'
        },{
        name: 'Kenneth Arnold Flight',
        credibility: 4,
        discoveredAt: 'June 24, 1947',
        location: 'Mount Rainier, Cascade Range, Washington, USA',
        rumors: ['Flying Saucers', 'Alien Tech', 'Magnetic Disturbance'],
        distance: '11265'
        },{
        name: 'Kim Dotcom MegaUFO',
        credibility: 1,
        discoveredAt: 'February 2, 2016',
        location: 'Coatesville, Auckland, New Zealand',
        rumors: ['Flying Saucers', 'Alien Tech', 'Magnetic Disturbance'],
        distance: '0.75675'
    }]; */
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