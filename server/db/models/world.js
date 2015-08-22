'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var worldSchema = new mongoose.Schema({
    name: String,
    tick: {
        type: Number,
        default: 10
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    size: {
        type: Number,
        default: 100
    },
    // map: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Cell'
    // }],
    map: String,
    // materials: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Material'
    // }],
    creatures: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Creature'
    }],
    environment: { // set materials on front end depending on env
        type: String,
        default: 'land'
    }, //air, aquatic, tundra
    temperature: Number,
    trees: String,
    flat: Boolean
});

worldSchema.plugin(deepPopulate, {});

worldSchema.pre('save', function(next) {
    this.timestamp = Date.now();
    next();
});

mongoose.model('World', worldSchema);