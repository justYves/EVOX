// Instantiate all models
var mongoose = require('mongoose');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/evoxTest';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../server/app');

var toSeed = require('../testingseed.js');

var User = mongoose.model('User');

describe('User route', function() {
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

    var testUser;
    beforeEach('Retrieve a creature', function(done) {
        User.findOne({
            email: 'darwin@gmail.com'
        }).exec()
            .then(function(user) {
                testUser = user;
                done();
            });
    });
    describe('GET requests', function() {

        it('/api/creatures should get with 200 response and an array as the body', function(done) {
            loggedInAgent.get('/api/users').expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.length(1);
                done();
            });
        });

        it('/api/creatures/:id gets one user by the id', function(done) {
            loggedInAgent.get('/api/users/' + testUser._id).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.email).to.equal('darwin@gmail.com');
                done();
            });
        });

    });

    var postUser = {
        email: 'alfred@gmail.com',
        password: 'origin'
    };

    describe('POST requests', function() {

        it('/api/users should post with 201 response and create a new creature', function(done) {
            loggedInAgent.post('/api/users').send(postUser).expect(201).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.email).to.equal('alfred@gmail.com');
                done();
            });
        });

    });

    describe('PUT request', function() {

        it('updates a user', function(done) {
            loggedInAgent.put('/api/users/' + testUser._id).send(postUser).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.email).to.equal('alfred@gmail.com');
                done();
            });
        });

        it('returns an error if user doesn\'t exist', function(done) {
            loggedInAgent.put('/api/user/robert_darwin').send(postUser).expect(200).end(function(err, res) {
                expect(err).to.not.equal(null);
                done();
            });
        });
        it('adds creatures to users creature array', function(done) {
            loggedInAgent.put('/api/users/' + testUser._id + "/creatures").send({
                name: "turtle"
            }).expect(200).end(function(err, res) {
                if (err) return done(err);
                expect(res.body.creature.length).to.equal(2);
                done();
            });
        });

    });


});