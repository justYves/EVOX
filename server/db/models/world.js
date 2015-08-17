'use strict';

var mongoose = require('mongoose');

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
    map: [
        [{
            type: mongoose.Schema.ObjectId,
            ref: 'Cell'
        }]
    ],
    environment: {
        type: String,
        default: 'land'
    }, //air, aquatic, tundra
    temperature: Number
});

worldSchema.pre('save', function(next) {
    this.timestamp.push(Date.now());
    next();
});

mongoose.model('World', worldSchema);