'use strict';
var mongoose = require('mongoose');
var Shape = mongoose.model('Shape');
var router = require('express').Router();
module.exports = router;

// /api/shapes
router.get('/', function(req, res, next) {
    Shape.find().exec()
        .then(function(shapes) {
            var parsedShapes = shapes.map(function(shape) {
                shape.shape = JSON.parse(shape.shape);
                return shape;
            })
            res.json(parsedShapes);
        })
        .then(null, next);
});

router.get('/:name', function(req, res, next) {
    Shape.findOne({
        name: req.params.name
    }).exec()
        .then(function(data) {
            res.json(data.shape);
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