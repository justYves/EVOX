'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/worlds', require('./worlds'));
router.use('/users', require('./users'));
router.use('/shapes', require('./shapes'));
router.use('/creatures', require('./creatures'));
router.use('/coordinates', require('./coordinates'));

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});