'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var deepPopulate = require('mongoose-deep-populate');
var status ="busy online offline".split(' ');

var userSchema = new mongoose.Schema({
    name: {first: String, last: String},
    picture: {
        type: String,
        default: 'http://www.corporatetraveller.ca/assets/images/profile-placeholder.gif'
    },
    description: {
        type: String,
        default: 'No Bio'
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    isAdmin: Boolean,
    address: {
        shipping: {type: mongoose.Schema.ObjectId, ref: 'Address'},
        lat: Number,
        lng: Number
    },
    billing: {
        billingAddress: {type: mongoose.Schema.ObjectId, ref: 'Address'},
        number: Number,
        ccv: Number,
        exp: {month: Number, year: Number},
        cardType: String
    },
    dishes: [{type: mongoose.Schema.ObjectId, ref: 'Dish'}],
    favorites: [{type: mongoose.Schema.ObjectId, ref: 'Dish'}],
    orders: [{type: mongoose.Schema.ObjectId, ref: 'Order'}],
    receivedOrders:{
        type: [{type: mongoose.Schema.ObjectId, ref: 'Order'}],
        default: []
    },
    reviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    status:{
        type: String,
        enum: status,
        default: 'offline'
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    },
    archived: {type: Boolean, default: false}

});

userSchema.plugin(deepPopulate, {});
// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

userSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

userSchema.statics.generateSalt = generateSalt;
userSchema.statics.encryptPassword = encryptPassword;

userSchema.statics.findChefs = function() {
    return this.find({ dishes: {$exists: true, $not: {$size: 0}} }).deepPopulate('address.shipping billing.billingAddress dishes.tags dishes.reviews.user').exec()
        .then(function(chefs) {
            return chefs;
        });
}

userSchema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', userSchema);