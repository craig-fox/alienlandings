var mongoose = require('mongoose');
var Landing = mongoose.model('Landing');

var theEarth = (function(){
    var earthRadius = 6371;

    var getDistanceFromRads = function(rads){
       return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function(distance){
       return parseFloat(distance/earthRadius);
    };

    return {
      getDistanceFromRads: getDistanceFromRads,
      getRadsFromDistance: getRadsFromDistance
    };


})();

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
}

module.exports.landingsListByDistance = function(req, res){
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(20000),
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
        console.log("Point: " + JSON.stringify(point));
       // console.log("The Results: " + JSON.stringify(results));
        if(err){
            sendJsonResponse(res, 404, err);
        } else {
           results.forEach(function(doc){
                landings.push({
                    distance: theEarth.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    credibility: doc.obj.credibility,
                    discoveredAt: doc.obj.discoveredAt,
                    location: doc.obj.location,
                    rumors: doc.obj.rumors,
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

                landing.name = req.body.name;
                landing.location = req.body.location;
                landing.rumors = req.body.rumors.split(",");
                landing.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
                landing.siteViewingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },{
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }];

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
   // sendJsonResponse(res, 200, {"status":"success"});
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



