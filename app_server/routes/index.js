var express = require('express');
var router = express.Router();
var ctrlLandings = require('../controllers/landings');
var ctrlOthers = require('../controllers/others');

/* Landings home page. */
router.get('/', ctrlLandings.homelist);
router.get('/landing', ctrlLandings.landingInfo);
router.get('/landing/quote/new', ctrlLandings.addReport);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
