'use strict';
var mongoose = require('mongoose');

var creatureSchema = new mongoose.Schema({
    shape: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shape'
    },
    name: String,
    social: {
        type: Number,
        default: 10
    },
    intelligence: {
        type: Number,
        default: 10
    },
    // memory: [],
    // food: [],
    offspring: {
        type: mongoose.Schema.ObjectId,
        ref: 'Creature'
    },
    pregnant: Boolean,
    hp: Number,
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
    position: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coordinate'
    },
    rotation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coordinate'
    }
});

creatureSchema.path('size').set(function(value) {
    this.hp = value * 10;
    this.hunger = Math.floor(this.hp / 4);
    return value;
});

mongoose.model('Creature', creatureSchema);