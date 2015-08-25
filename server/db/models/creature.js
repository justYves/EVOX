'use strict';
var mongoose = require('mongoose');

var creatureSchema = new mongoose.Schema({
    lifeCycle: Number,
    speed: Number,
    name: String,
    social: {
        type: Number,
        default: 10
    },
    intelligence: {
        type: Number,
        default: 10
    },
    memory: [String],
    // food: [],
    parents: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Creature'
    }],
    pregnant: Boolean,
    hp: {
        type: Number,
        default: 40
    },
    isCarnivore: {
        type: Boolean,
        default: false
    },
    isHerbivore: {
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
        default: 10
    },
    position: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coordinate'
    },
    rotation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coordinate'
    },
    category: String
});

// creatureSchema.path('size').set(function(value) {
//     this.hp = value * 10;
//     this.hunger = Math.floor(this.hp / 4);
//     return value;
// });

mongoose.model('Creature', creatureSchema);