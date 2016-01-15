/**
 * Created by CraigFox on 15/01/16.
 */
/* GET about page */
module.exports.about = function(req,res){
    res.render('index', {title: 'About'});
}