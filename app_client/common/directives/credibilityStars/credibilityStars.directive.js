(function(){
    angular
        .module('alienLandingsApp')
        .directive('credibilityStars', credibilityStars);

    function credibilityStars() {
        return {
            restrict: 'EA',
            scope: {
                thisCredibility: '=credibility'
            },
            templateUrl: '/common/directives/credibilityStars/credibility-stars.html'
        };
    }
})();