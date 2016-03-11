(function(){
    angular.module('alienLandingsApp', ['ngRoute']);

    function config($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    }

    angular
        .module('alienLandingsApp')
        .config(['$routeProvider', config]);

})();

