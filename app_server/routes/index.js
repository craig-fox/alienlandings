var express = require('express');
var router = express.Router();
var ctrlLandings = require('../controllers/landings');
var ctrlOthers = require('../controllers/others');

/* Landings home page. */
router.get('/', ctrlLandings.homelist);
router.get('/landing/:landingid', ctrlLandings.landingInfo);
router.get('/landing/:landingid/quotes/new', ctrlLandings.addQuote);
router.post('/landing/:landingid/quotes/new', ctrlLandings.doAddQuote);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
