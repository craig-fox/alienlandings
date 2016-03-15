(function(){
    angular
        .module('alienLandingsApp')
        .service('alienLandingsData', alienLandingsData);

    alienLandingsData.$inject = ['$http'];
    function alienLandingsData($http) {
        var landingByCoords = function (lat, lng) {
            return $http.get('api/landings?lng=' + lng + '&lat=' + lat + '&maxDistance=20000');
        };

        var landingById = function (landingid){
            return $http.get('/api/landings/' + landingid);
        };

        var addQuoteById = function (landingid, data){
            return $http.post('/api/landings/' + landingid + '/quotes', data);
        };

        return {
            landingByCoords: landingByCoords,
            landingById: landingById,
            addQuoteById: addQuoteById
        };
    }
})();