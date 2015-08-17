'use strict';
var mongoose = require('mongoose');
var Shape = mongoose.model('Shape');
var router = require('express').Router();
module.exports = router;

// /api/shapes
router.get('/', function(req, res, next) {
    Shape.find().exec()
        .then(function(shapes) {
            res.json(shapes);
        })
        .then(null, next);
});

router.post('/', function(req, res, next) {
    Shape.create(req.body)
        .then(function(shape) {
            res.status(201).json(shape);
        })
        .then(null, next);
});