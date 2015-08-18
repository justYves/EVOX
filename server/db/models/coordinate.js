'use strict';
var mongoose = require('mongoose');

var coordinateSchema = new mongoose.Schema({
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

mongoose.model('Coordinate', coordinateSchema);