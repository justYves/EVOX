var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

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

levelSchema.plugin(deepPopulate, {});

mongoose.model('Level', levelSchema);