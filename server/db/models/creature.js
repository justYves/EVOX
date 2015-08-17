'use strict';
var mongoose = require('mongoose');

var creatureSchema = new mongoose.Schema({
    shape: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shape'
    },
    hp: {
        type: Number,
        default: 10
    },
    carnivore: {
        type: Boolean,
        default: false
    },
    herbivore: {
        type: Boolean,
        default: true
    },
    size: {
        type: Number,
        default: 10
    },
    vision: {
        type: Number,
        default: null
    },
    hunger: {
        type: Number,
        default: null
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    z: {
        type: Number,
        default: 0
    }
});

mongoose.model('Creature', creatureSchema);