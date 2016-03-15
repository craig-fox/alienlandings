var mongoose = require('mongoose');
var Landing = mongoose.model('Landing');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

var getCredibility = function(ratings){
    var sum = 0;
    for(var i=0; i < ratings.length; i++){
        sum += parseInt(ratings[i], 10);
    }
    return Math.round(sum / ratings.length);
};

module.exports.landingsListByDistance = function(req, res){
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        num: 10
    };

    if(!lng || !lat){
        sendJsonResponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }

    Landing.geoNear(point, geoOptions, function(err, results, stats){
        var landings = [];
        if(err){
            sendJsonResponse(res, 404, err);
        } else {
           results.forEach(function(doc){
               console.log("Doc Data: " + JSON.stringify(doc));
                landings.push({
                    distance: doc.dis / 1000,
                    name: doc.obj.name,
                    credibility: getCredibility(doc.obj.ratings),
                    discoveredAt: doc.obj.discoveredAt,
                    location: doc.obj.location,
                    rumors: doc.obj.rumors,
                    siteViewingTimes: doc.obj.siteViewingTimes,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, landings);
        }
    });
};

module.exports.landingsReadOne = function(req, res){
    if(req.params && req.params.landingid){
        Landing
            .findById(req.params.landingid)
            .exec(function(err, landing){
                if(!landing){
                    sendJsonResponse(res, 404, {"message": "landingid not found"});
                    return;
                } else if (err){
                    sendJsonResponse(res, 404, err);
                }
                sendJsonResponse(res, 200, landing);
            });
    } else {
        sendJsonResponse(res, 404, {"message": "No landingid in request"});
    }

};

module.exports.landingsUpdateOne = function(req, res){
    if(!req.params.landingid){
        sendJsonResponse(res, 404, {
            "message": "Not found, landingid is required"
        });
        return;
    }
    Landing
        .findById(req.params.landingid)
        .select('-quotes')
        .exec(
            function(err, landing){
                if(!landing){
                    sendJsonResponse(res, 404, {
                        "message": "landingid not found"
                    });
                    return;
                } else if (err){
                    sendJsonResponse(res, 400, err);
                    return;
                }

               var selectedRating = req.body.selectedRating;

                if(selectedRating){
                    landing.ratings.push(selectedRating);
                } else {
                    landing.name = req.body.name;
                    landing.location = req.body.location;
                    landing.rumors = req.body.rumors.split(",");
                    landing.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

                    /* landing.siteViewingTimes = [{
                     days: req.body.days1,
                     opening: req.body.opening1,
                     closing: req.body.closing1,
                     closed: req.body.closed1
                     },{
                     days: req.body.days2,
                     opening: req.body.opening2,
                     closing: req.body.closing2,
                     closed: req.body.closed2
                     }]; */
                }


                landing.save(function(err,location){
                    if(err){
                        sendJsonResponse(res,404, err);
                    } else {
                        sendJsonResponse(res, 200, landing);
                    }
                });
            }
        );
};

module.exports.landingsDeleteOne = function(req, res){
    var landingid = req.params.landingid;
    if(landingid){
        Landing
            .findByIdAndRemove(landingid)
            .exec(
                function(err, landing){
                    if(err){
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {"message": "No landing id"});
    }
};

module.exports.landingsCreate = function(req, res){
    Landing.create({
        name: req.body.name,
        location: req.body.location,
        rumors: req.body.rumors.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        siteViewingTimes: [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            },
            {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }
          ]

        }, function(err, landing){
            if(err){
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 201, landing);
            }
    });
};



