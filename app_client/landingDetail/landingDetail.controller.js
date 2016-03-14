(function(){
    angular
        .module('alienLandingsApp')
        .controller('landingDetailCtrl', landingDetailCtrl);

    landingDetailCtrl.$inject = ['$routeParams', '$uibModal', 'alienLandingsData'];
    function landingDetailCtrl($routeParams, $uibModal, alienLandingsData){
        var vm = this;
        vm.landingid = $routeParams.landingid;
        alienLandingsData.landingById(vm.landingid)
            .success(function(data){
                vm.data = {landing: data};
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
