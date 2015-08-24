'use strict';
var mongoose = require('mongoose');

var shapeSchema = new mongoose.Schema({
    name: String,
    shape: {
        type: String,
        required: true
    },
    hash: String
});

mongoose.model('Shape', shapeSchema);