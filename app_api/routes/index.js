var express = require('express');
var router = express.Router();
var ctrlLandings = require('../controllers/landings');
var ctrlQuotes = require('../controllers/quotes');

//landings
router.get('/landings', ctrlLandings.landingsListByDistance);
router.post('/landings', ctrlLandings.landingsCreate);
router.get('/landings/:landingid', ctrlLandings.landingsReadOne);
router.put('/landings/:landingid', ctrlLandings.landingsUpdateOne);
router.delete('/landings/:landingid', ctrlLandings.landingsDeleteOne);

//quotes
router.post('/landings/:landingid/quotes', ctrlQuotes.quotesCreate);
router.get('/landings/:landingid/quotes/:quoteid', ctrlQuotes.quotesReadOne);
router.put('/landings/:landingid/quotes/:quoteid', ctrlQuotes.quotesUpdateOne);
router.delete('/landings/:landingid/quotes/:quoteid', ctrlQuotes.quotesDeleteOne);

module.exports = router;