'use strict';
var mongoose = require('mongoose');

var shapeSchema = new mongoose.Schema({
    name: String,
    shape: {
        type: String,
        required: true
    }
});

mongoose.model('Shape', shapeSchema);