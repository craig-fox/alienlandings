/**
 * Created by CraigFox on 15/01/16.
 */
/* GET about page */
module.exports.about = function(req,res){
    res.render('generic-text',
        {
            title: 'About Alien Landings',
            content: "Alien Landings was created to track where aliens have landed around the world, listing "+
            "a landing report, a map of the location and images from the landing site."
        });
}