(function(){
    angular
        .module('alienLandingsApp')
        .controller('aboutCtrl', aboutCtrl);

    function aboutCtrl(){
        var vm = this;

        vm.pageHeader = {
          title: 'About Alien Landings'
        };

        vm.main = {
           content: "Alien Landings was created to help people find the sites where alien visitors may have landed," +
               "and give conspiracy theorists plenty of justification in life.\n" +
               "Find where Elvis was transported from this cruel world to a better one, today!"
        };

    }
})();
