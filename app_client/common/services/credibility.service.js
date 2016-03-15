(function(){
    angular
        .module('alienLandingsApp')
        .service('credibility', credibility);

    function credibility(){
        var getCredibility = function(ratings){
            var sum = 0;
            for(var i=0; i < ratings.length; i++){
                sum += parseInt(ratings[i], 10);
            }
            return  Math.round(sum / ratings.length);
        };

        return {
            getCredibility: getCredibility
        };
    }
})();
