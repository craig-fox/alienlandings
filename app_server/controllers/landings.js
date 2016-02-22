var request = require('request');
var apiOptions = {
   server: "http://localhost:3000"
};

if(process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://blooming-tundra-4978.herokuapp.com";
}

var renderHomepage = function(req, res){
    res.render('landings-list', {
        title: 'Alien Landings - find where E.T has touched down',
        pageHeader: {
            title: 'Alien Landings',
            strapline: 'Find where extraterrestials have landed near you!'
        },
        sidebar: "Wanting to know where aliens have landed over the past century and a bit?"
    });
};

var _showError = function(req, res, status){
    var title, content;
    if(status === 404){
        title = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        title = "something's gone wrong (Error " + status + ")";
        content = "A non-404 error has occurred. Please stay calm.";
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};

/* GET 'home' page */
module.exports.homelist = function(req, res){
   renderHomepage(req, res);
}


/*module.exports.homelist = function(req, res){
    res.render('landings-list', {
        title: 'Alien Landings - find where E.T has touched down',
        pageHeader: {
            title: 'Alien Landings',
            strapline: 'Find where extraterrestials have landed near you!'
        },
        landings: [{
            name: 'Roswell Incident',
            credibility: 3,
            discoveredAt: 'July 8, 1947',
            location: 'Roswell, New Mexico, USA',
            rumors: ['Alien Tech', 'Little Green Men', 'Crash Landing', 'Cover Up'],
            distance: '11435km'
        },{
            name: 'Bangkok Fireball',
            credibility: 2,
            discoveredAt: 'September 17, 2015',
            location: 'Bangkok, Thailand',
            geo: {latitude: 13.7539800, longitude: 100.5014400},
            rumors: ['Fire In Sky', 'Hidden Landing'],
            distance: '9572km'
        },{
            name: 'Kenneth Arnold Flight',
            credibility: 4,
            discoveredAt: 'June 24, 1947',
            location: 'Mount Rainier, Cascade Range, Washington, USA',
            rumors: ['Flying Saucers', 'Alien Tech', 'Magnetic Disturbance'],
            distance: '11265km'
        }
        ]
    });
}; */

var renderDetailPage = function(req, res, landingDetail){
    console.log("Landing Detail:" + JSON.stringify(landingDetail));

    res.render('landing-info', {
        title: landingDetail.name,
        pageHeader: {title: landingDetail.name},
        sidebar: {
            synopsis: 'The Roswell sighting is a touchstone in popular culture, where the military covered up '
            + 'the true nature of a crashed device.'
        },
        landing: landingDetail
    });
};

/* GET 'Landing info' page */
module.exports.landingInfo = function(req, res){
    var requestOptions, path;
    path = "/api/landings/" + req.params.landingid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
       requestOptions,
        function(err, response, body){
            var data = body;
            if(response.statusCode === 200){
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                renderDetailPage(req, res, data);
            } else {
               _showError(req, res, response.statusCode);
            }

        }
    );

};

/* GET 'Add quote' page */

var renderQuoteForm = function(req, res, landingDetail){
    res.render('landing-quote-form', {
        title: 'Witness Quote From ' + landingDetail.name + ' Landing Site',
        pageHeader: {title: 'Quote ' + landingDetail.name},
        error: req.query.err,
        url: req.originalUrl
    });
};

var getLandingInfo = function (req, res, callback){
    var requestOptions, path;
    path = "/api/landings/" + req.params.landingid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function(err, response, body){
            var data = body;
            if(response.statusCode === 200){
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.landingInfo = function(req, res){
    getLandingInfo(req, res, function(req, res, responseData){
        renderDetailPage(req, res, responseData);
    });
};

module.exports.addQuote = function(req, res){
    getLandingInfo(req, res, function(req, res, responseData){
        renderQuoteForm(req, res, responseData);
    });
};

module.exports.doAddQuote = function(req, res){
    var requestOptions, path, landingid, postdata;
    landingid = req.params.landingid;
    path = "/api/landings/" + landingid + '/quotes';

    postdata = {
        author: req.body.author,
        quoteText: req.body.quoteText,
        takenAt: req.body.takenAt
    };

    requestOptions = {
       url: apiOptions.server + path,
       method: "POST",
       json: postdata
    };

    if(!postdata.author || !postdata.quoteText){
        res.redirect('/landing/' + landingid + '/quotes/new?err=val')
    } else {
        request(
            requestOptions,
            function(err, response, body) {

                if (response.statusCode === 201) {
                    res.redirect('/landing/' + landingid);
                } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError'){
                    res.redirect('/landing/' + landingid + '/quotes/new?err=val')
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }


};

/*landing: {
    name: 'Roswell Incident',
        location: 'Roswell, New Mexico, USA',
        discoveredAt: 'July 8, 1947',
        credibility: 3,
        geo: {latitude: 13.7539800, longitude: 100.5014400},
    rumors: ['Alien Tech', 'Little Green Men', 'Crash Landing', 'Cover Up'],
        photo: 'aliens.jpg',
        quotes: [
        {
            content: 'It was a close encounter of the 5th kind!',
            person: 'Lauren Robinson'
        },
        {
            content: 'Looked a bit like Gollum, I reckon',
            person: 'Steve Simpson'
        },
        {
            content: 'The truth is in there',
            person: 'Dana Scully'
        }
    ]
} */