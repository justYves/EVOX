'use strict';
var mongoose = require('mongoose');

var materialSchema = new mongoose.Schema({
    materials: [String]
});

mongoose.model('Material', materialSchema);