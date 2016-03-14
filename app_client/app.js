(function(){
    angular.module('alienLandingsApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    function config($routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/landing/:landingid', {
                templateUrl: '/landingDetail/landingDetail.view.html',
                controller: 'landingDetailCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    angular
        .module('alienLandingsApp')
        .config(['$routeProvider', '$locationProvider', config]);

})();

