var dbURI = 'mongodb://localhost:27017/gameoflife';
var clearDB = require('mocha-mongoose')(dbURI);

// var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

var World = mongoose.model('World');

// var models = {
//     User: mongoose.model('User'),
//     Address: mongoose.model('Address'),
//     Dish: mongoose.model('Dish'),
//     Order: mongoose.model('Order'),
//     Review: mongoose.model('Review'),
//     Tag: mongoose.model('Tag')
// };

// var toSeed = require('../../testingseed.js');

describe('World model', function() {

    beforeEach('Establish DB connection', function(done) {
        if (!mongoose.connection.db) {
            mongoose.connect(dbURI);
        }
        done();
        // return toSeed(models, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    it('should exist', function() {
        expect(World).to.be.a('function');
    });

    describe('middleware', function() {

        describe('pre save', function() {
            var firstTime, secondTime;
            var world = new World({
                name: 'TestWorld'
            });
            world.save()
                .then(function(world) {
                    firstTime = world.timestamp;
                    world.flat = true;
                    return world.save()
                })
                .then(function(world) {
                    secondTime = world.timestamp;
                })

            it('should update the timestamp everytime a world is saved', function(done) {
                expect(firstTime).to.not.equal(secondTime);
                done();
            });

        });

    });

})