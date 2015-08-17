'use strict';
var mongoose = require('mongoose');

var shapeSchema = new mongoose.Schema({
    shape: {
        type: String,
        required: true
    }
});

mongoose.model('Shape', shapeSchema);