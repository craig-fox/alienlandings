/**
 * Created by CraigFox on 15/01/16.
 */
/* GET 'home' page */
module.exports.homelist = function(req, res){
    res.render('landings-list', { title: 'Home' });
};

/* GET 'Landing info' page */
module.exports.landingInfo = function(req, res){
    res.render('landing-info', { title: 'Landing info' });
};

/* GET 'Add quote' page */
module.exports.addQuote = function(req, res){
    res.render('landing-quote-form', { title: 'Add quote' });
};