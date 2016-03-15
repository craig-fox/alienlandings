(function(){
    angular
        .module('alienLandingsApp')
        .controller('landingDetailCtrl', landingDetailCtrl);

    landingDetailCtrl.$inject = ['$routeParams', '$uibModal', 'alienLandingsData', 'credibility'];
    function landingDetailCtrl($routeParams, $uibModal, alienLandingsData, credibility){
        var vm = this;
        vm.landingid = $routeParams.landingid;
        alienLandingsData.landingById(vm.landingid)
            .success(function(data){
                vm.data = {landing: data};
                vm.data.landing.credibility = credibility.getCredibility(vm.data.landing.ratings);
                vm.pageHeader = {
                    title: vm.data.landing.name
                };
            })
            .error(function(e){
                console.log(e);
            });

        vm.popupQuoteForm = function(){
           var modalInstance = $uibModal.open({
               templateUrl: '/quoteModal/quoteModal.view.html',
               controller: 'quoteModalCtrl as vm',
               resolve: {
                   landingData: function(){
                       return {
                           landingid: vm.landingid,
                           landingName: vm.data.landing.name
                       }
                   }
               }
            });

            modalInstance.result.then(function(data){
              vm.data.landing.quotes.push(data);
            });

        }
    }

})();
