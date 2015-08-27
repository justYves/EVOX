var mongoose = require('mongoose');

var levelSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        default: 1
    },
    objectives: [{
        text: {
            type: String,
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    available: {
        type: Boolean,
        default: false
    },
    img: String
});

mongoose.model('Level', levelSchema);