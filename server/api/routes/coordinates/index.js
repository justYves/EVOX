'use strict';
var mongoose = require('mongoose');
var Coordinate = mongoose.model('Coordinate');
var router = require('express').Router();
var _ = require('lodash');
module.exports = router;

// /api/coordinates
router.param('id', function(req, res, next, id) {
    Coordinate.findById(id).exec()
        .then(function(coord) {
            if (coord) {
                req.coord = coord;
                next();
            } else {
                throw new Error("Coordinate doesn't exist!");
            }
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
    Coordinate.find().exec()
        .then(function(coordinates) {
            res.json(coordinates);
        })
        .then(null, next);
});

router.get('/:id', function(req, res, next) {
    res.json(req.coord);
});

router.post('/', function(req, res, next) {
    Coordinate.create(req.body)
        .then(function(coord) {
            res.status(201).json(coord);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.coord, req.body)
    req.coord.save()
        .then(function(coord) {
            res.status(200).json(coord);
        })
        .then(null, next);
});