'use strict';
var mongoose = require('mongoose');

var cellRowSchema = new mongoose.Schema({
    cells: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cell'
    }]
});

mongoose.model('CellRow', cellRowSchema);