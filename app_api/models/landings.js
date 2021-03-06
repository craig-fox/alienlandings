var mongoose = require('mongoose');

var quoteSchema = new mongoose.Schema({
    author: {type: String, required: true},
    quoteText: {type: String, required: true},
    takenAt: {type: Date, "default": Date.now},
    menInBlack: {type: Boolean, "default": false}
});

var siteViewingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var landingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    //credibility: {type: Number, "default": 0, min: 0, max:5},
    ratings: [Number],
    discoveredAt: String,
    location: String,
    rumors: [String],
    coords: {type: [Number], index: '2dsphere', required: true},
    siteViewingTimes: [siteViewingTimeSchema],
    quotes: [quoteSchema]
});

mongoose.model('Landing', landingSchema);

