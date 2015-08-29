// Instantiate all models
var mongoose = require('mongoose');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../server/app');

var toSeed = require('../testingseed.js');

var Shape = mongoose.model('Shape');
var User = mongoose.model('User');
var Creature = mongoose.model('Creature');

describe('Shape route', function() {
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

    var testShape;
    beforeEach('Retrieve a shape', function(done) {
        Shape.findOne({
            name: 'turtle'
        }).exec()
            .then(function(shape) {
                testShape = shape;
                done();
            });
    });

    describe('GET requests', function() {

        it('/api/shapes should get with 200 response and an array as the body', function(done) {
            loggedInAgent.get('/api/shapes').expect(200).end(function(err, res) {
                if (err) return done(err);
                receivedShapes = res.body;
                expect(res.body).to.have.length(3);
                done();
            });
        });

        it('/api/shapes/id/:id gets one shape by the id', function(done) {
            loggedInAgent.get('/api/shapes/id/' + testShape._id).expect(200).end(function(err, res) {
                if (err) return done(err)
                expect(res.body.name).to.equal('turtle');
                done();
            });
        });

        it('/api/shapes/:name gets one shape by the name', function(done) {
            loggedInAgent.get('/api/shapes/' + testShape.name).expect(200).end(function(err, res) {
                if (err) return done(err)
                expect(res.body).to.be.a('string');
                done();
            });
        });

    });

    var postShape = {
        name: 'Dragon',
        shape: JSON.stringify({
            voxels: 'test',
            colors: 'test'
        })
    };

    describe('POST requests', function() {

        it('/api/shapes should post with 201 response and create a new shape', function(done) {
            loggedInAgent.post('/api/shapes').send(postShape).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.name).to.equal('Dragon');
                done();
            });
        });

        it('/api/shapes/many should get with 200 response and an array as the body', function(done) {
            loggedInAgent.post('/api/shapes/many').send(['turtle', 'fox']).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.length(2);
                done();
            });
        });

    });

    describe('PUT request', function() {

        it('returns an error if shape doesn\'t exist', function(done) {
            loggedInAgent.put('/api/shapes/abc123boop').send(postShape).expect(200).end(function(err, res) {
                expect(err).to.not.equal(null);
                done();
            });
        });

        it('/default/:id', function(done) {
            loggedInAgent.put('/api/shapes/default/' + testShape._id).send(postShape).expect(200).end(function(err, res) {
                expect(res.body.name).to.equal('Dragon');
                done();
            });
        });

    });

});