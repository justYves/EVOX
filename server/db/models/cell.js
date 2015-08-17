'use strict';
var mongoose = require('mongoose');

var cellSchema = new mongoose.Schema({
    material: String,
    neighbors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cell'
    }],
    //To be added later on
    // creatures =[{type:mongoose.Schema.ObjectId, ref:'Creature'}]
    x: Number,
    y: Number,
    z: Number
});

cellSchema.method('coordinate', function() {
    return [this.x, this.y, this.z];
})

mongoose.model('Cell', cellSchema);