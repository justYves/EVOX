'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var worldSchema = new mongoose.Schema({
    tick: {
        type: Number,
        required: true
    },
    timestamp: [{
        type: Date,
        default: Date.now
    }],
    size: {
        type: Number,
        default: 100
    },
    map: [{
        type: mongoose.Schema.ObjectId,
        ref: 'CellRow'
    }],
    environment: {
        type: String,
        default: 'land'
    }, //air, aquatic, tundra
    temperature: Number
});

worldSchema.plugin(deepPopulate, {});

worldSchema.pre('save', function(next) {
    this.timestamp.push(Date.now());
    next();
});

mongoose.model('World', worldSchema);