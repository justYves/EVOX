'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model('User');
var router = require('express').Router();
module.exports = router;

// /api/users
router.param('id', function(req, res, next, id) {
    User.findById(id).deepPopulate('world.name world.creature creature.shape creature.creature levels').exec()
        .then(function(user) {
            if (user) {
                req.CurrentUser = user;
                next();
            } else {
                throw new Error("User doesn't exist!");
            }
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
    User.find().deepPopulate('world creature.shape creature.creature').exec()
        .then(function(users) {
            res.json(users);
        })
        .then(null, next);
});

router.post('/', function(req, res, next) {
    User.create(req.body)
        .then(function(user) {
            res.status(201).json(user);
        })
        .then(null, next);
});

router.get('/:id', function(req, res, next) {
    res.json(req.CurrentUser);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.CurrentUser, req.body);
    req.CurrentUser.save()
        .then(function(user) {
            res.status(200).json(user);
        })
        .then(null, next);
});

router.put('/:id/creatures', function(req, res, next) {
    req.CurrentUser.creature.push(req.body);
    req.CurrentUser.save()
        .then(function(user) {
            res.status(200).json(user);
        })
        .then(null, next);
});


router.delete('/:id', function(req, res, next) {
    User.remove({
        _id: req.params.id
    })
        .then(function() {
            res.status(200).json({
                message: 'Successfully deleted!'
            });
        })
        .then(null, next);
});