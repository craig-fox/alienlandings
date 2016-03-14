var mongoose = require('mongoose');
var Landing = mongoose.model('Landing');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

var doAddQuote = function(req, res, landing){
    if(!landing){
      sendJsonResponse(res, 404, {
         "message": "landingid not found"
      });
    } else {
        landing.quotes.push({
            author: req.body.author,
            quoteText: req.body.quoteText,
            takenAt: req.body.takenAt
        });

        landing.save(function(err, landing){
            var thisQuote;
            if(err){
                console.log(err);
                sendJsonResponse(res, 400, err);
            } else {
                thisQuote = landing.quotes[landing.quotes.length - 1];
                sendJsonResponse(res, 201, thisQuote);
            }
        });
    }
};

module.exports.quotesReadOne = function(req, res){
    if(req.params && req.params.landingid) {
        Landing
            .findById(req.params.landingid)
            .select('name quotes')
            .exec(
                function(err, landing){
                    var response, quote;
                    if(!landing){
                        sendJsonResponse(res, 404, {"message": "landingid not found"});
                        return;
                    } else if (err){
                        sendJsonResponse(res, 400, err);
                        return;
                    }

                    if(landing.quotes && landing.quotes.length > 0){
                        console.log(landing.quotes.id);
                        quote = landing.quotes.id('569dbf7da826f8bcb73ba42d');
                        if(!quote){
                            sendJsonResponse(res, 404, {"message": "quoteid was not found"})
                        } else {
                            response = {
                              landing: { name: landing.name,
                                         id: req.params.landingid
                                       },
                              quote: quote
                            };
                            sendJsonResponse(res, 200, response);
                        }
                    } else {
                        sendJsonResponse(res, 404, {"message": "No quotes found"});
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {"message": "Not found, landingid and quoteid are both required"});
    }
};

module.exports.quotesUpdateOne = function(req, res){
    //sendJsonResponse(res, 200, {"status":"success"});

    if(!req.params.landingid || !req.params.quoteid){
        sendJsonResponse(res, 404, {
            "message": "Not found, landingid and quoteid are required"
        });
        return;
    }

    Landing
        .findById(req.params.landingid)
        .select('reviews')
        .exec(
            function(err, landing){
                var thisQuote;
                if(!landing){
                   sendJsonResponse(res, 404, {"message": "landingid not found"});
                   return;
                } else if (err){
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (landing.quotes && landing.quotes.length > 0){
                    thisQuote = landing.quotes.id(req.params.quoteid);
                    if(!thisQuote){
                        sendJsonResponse(res, 404, {
                            "message": "quoteid not found"
                        });
                    } else {
                        thisQuote.author = req.body.author;
                        thisQuote.quoteText = req.body.quoteText;
                        thisQuote.takenAt = req.body.takenAt;
                        landing.save(function(err, landing){
                            if(err){
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 200, thisQuote);
                            }

                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {"message": "No quote to update"});
                }
            }

        );
};

module.exports.quotesDeleteOne = function(req, res){
    if(!req.params.landingid || !req.params.quoteid){
        sendJsonResponse(res, 404, {"message" : "Not found, landingid and quoteid are required"});
        return;
    }

    Landing
        .findById(req.params.landingid)
        .select('quotes')
        .exec(
            function(err, landing){
                if(!landing){
                    sendJsonResponse(res, 404, {
                        "message" : "landingid not found"
                    });
                    return;
                } else if (err){
                    sendJsonResponse(res, 400, err);
                    return;
                }

                if(landing.quotes && landing.quotes.length > 0){
                    if(!landing.quotes.id(req.params.quoteid)){
                        sendJsonResponse(res, 404, {"message" : "quoteid not found"});
                    } else {
                        landing.quotes.id(req.params.quoteid).remove();
                        landing.save(function(err){
                            if(err){
                                sendJsonResponse(res, 404, err);
                            } else {
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {"message": "No quote to delete"});
                }
            }
        );

   // sendJsonResponse(res, 200, {"status":"success"});
};

module.exports.quotesCreate = function(req, res){
    var landingid = req.params.landingid;
    if(landingid){
        Landing.findById(landingid)
            .select('quotes')
            .exec(
                function(err, landing){
                    if(err){
                        sendJsonResponse(res, 400, err);
                    } else {
                        doAddQuote(req, res, landing);
                    }
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, landingid required"
        });
    }

    //sendJsonResponse(res, 200, {"status":"success"});
};