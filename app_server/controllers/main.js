/**
 * Created by CraigFox on 15/01/16.
 */
/* GET home page */
module.exports.index = function(req,res){
    res.render('index', {title: 'Alien Landings'});
}