'use strict';
var mongoose = require('mongoose');
var Shape = mongoose.model('Shape');
var Creature = mongoose.model('Creature');
var User = mongoose.model('User');
var router = require('express').Router();
var _ = require('lodash');
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

router.get('/id/:id', function(req, res, next) {
    Shape.findById(req.params.id).exec()
        .then(function(shape) {
            shape.shape = JSON.parse(shape.shape);
            res.json(shape);
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

router.post('/many', function(req, res, next) { //post for payload
    Shape.find({
        name: {
            $in: req.body
        }
    }).exec()
        .then(function(shapes) {
            res.status(200).json(shapes);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    Shape.findById(req.params.id).exec()
        .then(function(shape) {
            _.extend(shape, req.body.shape);
            return shape.save()
        })
        .then(function(shape) {
            return Creature.findById(req.body.creature._id).exec()
        })
        .then(function(creature) {
            _.extend(creature, req.body.creature)
            return creature.save()
        })
        .then(function() {
            return User.findById(req.body.user).exec()
        })
        .then(function(user) {
            var toChange;
            user.creature.forEach(function(critter) {
                console.log(critter.id)
                if (critter.id === req.body._id) toChange = critter;
            })
            _.extend(toChange, req.body)
            return toChange.save()
        })
        .then(function(userCreature) {
            res.status(200).json(userCreature)
        })
        .then(null, next)

})

router.put('/default/:id', function(req, res, next) {
    Shape.findById(req.params.id).exec()
        .then(function(shape) {
            _.extend(shape, req.body);
            return shape.save()
        })
        .then(function(result) {
            res.status(200).json(result)
        })
        .then(null, next)
})