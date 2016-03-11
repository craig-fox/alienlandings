(function(){
    angular
        .module('alienLandingsApp')
        .service('alienLandingsData', alienLandingsData);

    alienLandingsData.$inject = ['$http'];
    function alienLandingsData($http) {
        var locationByCoords = function (lat, lng) {
            return $http.get('api/landings?lng=' + lng + '&lat=' + lat + '&maxDistance=20000');
        };

        return {
            locationByCoords: locationByCoords
        };
    }
})();