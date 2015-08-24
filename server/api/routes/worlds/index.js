'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var World = mongoose.model('World');
var Promise = require('bluebird');
var Creature = mongoose.model('Creature');
var router = require('express').Router();
module.exports = router;

//  /api/worlds/
router.param('id', function(req, res, next, id) {
    World.findById(id).deepPopulate('map creatures.position creatures.rotation').exec()
        .then(function(world) {
            if (!world) {
                throw new Error("World doesn't exist!");
            } else {
                req.world = world;
                next();
            }
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
    World.find().deepPopulate('map creatures.position creatures.rotation').exec()
        .then(function(worlds) {
            res.json(worlds);
        })
        .then(null, next);
});

router.post('/', function(req, res, next) {
    World.create(req.body)
        .then(function(world) {
            res.status(201).json(world);
        })
        .then(null, next);
})

router.get('/:id', function(req, res, next) {
    res.json(req.world);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.world, req.body);
    req.world.save()
        .then(function(world) {
            res.status(200).json(world);
        })
        .then(null, next);
});

router.delete('/:id', function(req, res, next) {
    Creature.remove({
        _id: {
            $in: req.world.creatures
        }
    })
        .then(function() {
            return req.world.remove()
        })
        .then(function() {
            res.status(200).json({
                message: 'Successfully deleted!'
            });
        })
        .then(null, next);
});