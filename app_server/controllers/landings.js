/**
 * Created by CraigFox on 15/01/16.
 */
/* GET 'home' page */
module.exports.homelist = function(req, res){
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
};

/* GET 'Landing info' page */
module.exports.landingInfo = function(req, res){
    res.render('landing-info', {
        title: 'Roswell',
        pageHeader: {title: 'Roswell'},
        sidebar: {
            synopsis: 'The Roswell sighting is a touchstone in popular culture, where the military covered up '
            + 'the true nature of a crashed device.'
        },
        landing: {
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
        }
    });
};

/* GET 'Add quote' page */
module.exports.addQuote = function(req, res){
    res.render('landing-quote-form', {
        title: 'Roswell Site Quote'
    });
};