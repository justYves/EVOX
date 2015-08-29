var dbURI = 'mongodb://localhost:27017/gameoflife';
var clearDB = require('mocha-mongoose')(dbURI);

// var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

var User = mongoose.model('User');

// var models = {
//     User: mongoose.model('User'),
//     Address: mongoose.model('Address'),
//     Dish: mongoose.model('Dish'),
//     Order: mongoose.model('Order'),
//     Review: mongoose.model('Review'),
//     Tag: mongoose.model('Tag')
// };

// var toSeed = require('../../testingseed.js');

describe('User model', function() {

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
        expect(User).to.be.a('function');
    });

    describe('statics', function() {

        describe('generateSalt', function() {

            it('should exist', function() {
                expect(User.generateSalt).to.be.a('function');
            });

            it('should generate a salt of random characters', function(done) {
                expect(User.generateSalt()).to.be.a('string');
                done();
            });

        });

        describe('encryptPassword', function() {

            it('should exist', function() {
                expect(User.encryptPassword).to.be.a('function');
            });

            it('should generate the same output when given a specific combination of password and salt', function(done) {
                expect(User.encryptPassword('testing', 'abc123')).to.equal(User.encryptPassword('testing', 'abc123'));
                expect(User.encryptPassword('testing', 'abc123')).to.not.equal(User.encryptPassword('testing1', 'abc123'));
                done();
            });

        });

    });

    describe('methods', function() {

        describe('correctPassword', function() {
            var savedUser;
            var user = {
                name: {
                    first: 'Some',
                    last: 'Dude'
                },
                email: 'dude@test.com',
                password: 'something'
            };

            beforeEach('Create a user', function(done) {
                User.create(user)
                    .then(function(data) {
                        savedUser = data;
                        done()
                    });
            })

            it('should exist', function() {
                expect(savedUser.correctPassword).to.be.a('function');
            });

            it('should return a boolean of whether the input is the correct password', function(done) {
                expect(savedUser.correctPassword('something')).to.be.true;
                done();
            });

        });

    });

    describe('middleware', function() {

        describe('pre save', function() {
            var firstSalt, secondSalt, savedUser;
            var user = new User({
                name: {
                    first: 'Test',
                    last: 'User'
                },
                email: 'testing@test.com',
                password: 'testing'
            });
            user.save()
                .then(function(user) {
                    savedUser = user;
                    firstSalt = user.salt;
                    user.password = 'testing123';
                    return user.save()
                })
                .then(function(user) {
                    secondSalt = user.salt;
                })

            it('should encrypt the password', function(done) {
                expect(savedUser.password).to.not.equal('testing');
                done();
            });

            it('should update the salt everytime password is modified', function(done) {
                expect(firstSalt).to.not.equal(secondSalt);
                done();
            });

        });

    });

})