(function(){
   angular
       .module('alienLandingsApp')
       .controller('quoteModalCtrl', quoteModalCtrl);

   quoteModalCtrl.$inject = ['$uibModalInstance', 'alienLandingsData', 'landingData'];
   function quoteModalCtrl($uibModalInstance, alienLandingsData, landingData){
      var vm = this;
      vm.landingData = landingData;

       vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
       vm.format = vm.formats[0];
       vm.altInputFormats = ['M!/d!/yyyy'];
       vm.dateOptions = {
           maxDate: new Date(),
           showWeeks: true
       };

       vm.takenAtPopup = {opened: false};

       vm.openTakenAtPopup = function() {
           vm.takenAtPopup.opened = true;
       };

      vm.onSubmit = function(){
         vm.formError = "";
         if(!vm.formData.name || !vm.formData.takenAt || !vm.formData.quoteText){
             vm.formError = "All fields required, please try again";
             return false;
         } else {
             vm.doAddQuote(vm.landingData.landingid, vm.formData);
         }
      };

      vm.doAddQuote = function(landingid, formData){
          alienLandingsData.addQuoteById(landingid, {
                  author: formData.name,
                  takenAt: formData.takenAt,
                  quoteText: formData.quoteText
          })
              .success(function(data){
                vm.modal.close(data);
              })
              .error(function(data){
                vm.formError = "Your quote has not been saved, please try again";
              });
          return false;
      };

       vm.modal = {
           close: function(result){
              $uibModalInstance.close(result);
           },
           cancel: function() {
               $uibModalInstance.dismiss('cancel');
           }
       };
   }
})();
