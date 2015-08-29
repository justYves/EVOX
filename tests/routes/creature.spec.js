// Instantiate all models
var mongoose = require('mongoose');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../server/app');

var toSeed = require('../testingseed.js');

var Creature = mongoose.model('Creature');

describe('Creature route', function() {
    var loggedInAgent;

    beforeEach('Establish DB connection', function(done) {
        loggedInAgent = supertest.agent(app);

        if (!mongoose.connection.db) {
            mongoose.connect(dbURI);
        }
        return toSeed(done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    var testCreature;
    beforeEach('Retrieve a creature', function(done) {
        Creature.findOne({
            name: 'turtle'
        }).exec()
            .then(function(creature) {
                testCreature = creature;
                done();
            });
    });

    describe('GET requests', function() {

        it('/api/creatures should get with 200 response and an array as the body', function(done) {
            loggedInAgent.get('/api/creatures').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.length(5);
                done();
            });
        });

        it('/api/creatures/:id gets one creature by the id', function(done) {
            loggedInAgent.get('/api/creatures/' + testCreature._id).expect(200).end(function(err, res) {
                if (err) return done(err)
                expect(res.body.name).to.equal('turtle');
                done();
            });
        });

    });

    var postCreature = {
        name: 'Dragon',
        category: 'Very Large'
    };

    describe('POST requests', function() {

        it('/api/creatures should post with 201 response and create a new creature', function(done) {
            loggedInAgent.post('/api/creatures').send(postCreature).expect(201).end(function(err, res) {
                if (err) return done(err);
                console.log(res.body)
                expect(res.body.name).to.equal('Dragon');
                done();
            });
        });

        it('/api/creatures/all should get with 200 response and an array as the body', function(done) {
            loggedInAgent.post('/api/creatures/all').send(['turtle', 'fox']).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.length(2);
                done();
            });
        });

    });

    describe('PUT request', function() {

        it('updates a creature', function(done) {
            loggedInAgent.put('/api/creatures/' + testCreature._id).send(postCreature).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.name).to.equal('Dragon');
                done();
            });
        });

        it('returns an error if creature doesn\'t exist', function(done) {
            loggedInAgent.put('/api/creatures/abc123boop').send(postCreature).expect(200).end(function(err, res) {
                expect(err).to.not.equal(null);
                done();
            });
        });

    });

    describe('DELETE request', function() {

        it('deletes a creature', function(done) {
            loggedInAgent.delete('/api/creatures/' + testCreature._id).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Successfully deleted!');
                done();
            });
        });

    });

});