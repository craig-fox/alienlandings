(function(){
    angular
        .module('alienLandingsApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'alienLandingsData', 'geolocation'];
    function homeCtrl($scope, alienLandingsData, geolocation){
        var vm = this;

        vm.pageHeader= {
            title: 'Alien Landings',
            strapline: "Seeking where extraterrestials have visited"
        };

        vm.sidebar = {
            content: "The truth is out there. For the last hundred years, " +
            "alien spacecraft have been visiting our planet. Or so say a few vividly " +
            "imaginative folks with one too many viewings of Close Encounters of the Third Kind " +
            "under the belt. But do we dare doubt? Right now, E.T. may be watching."
        };

        vm.message = "Checking your location";


        vm.getData = function(position){
            var lat = position.coords.latitude,
                lng = position.coords.longitude;
            vm.message = "Searching for alien landing sites";
            alienLandingsData.landingByCoords(lat,lng)
                .success(function(data){
                    vm.message = data.length >0 ? "": "No locations found";
                    vm.data = {landings: data};
                })
                .error(function(e){
                    vm.message = "An error occurred while retrieving data"
                    console.log(e);
                });
        };

        vm.showError = function (error) {
            $scope.$apply(function() {
                vm.message = error.message;
            });
        };

        vm.noGeo = function() {
            $scope.$apply(function(){
                vm.message = "Geolocation is not supported by this browser";
            })
        };

        geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
})();