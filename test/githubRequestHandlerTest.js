var fs = require('fs');
var path = require('path');

var chai = require('chai');
var assert = chai.assert;

var testee = require('../src/githubRequestHandler');
var mockServerController = require('./mock/server'); 
const MOCK_SERVER_URL = mockServerController.url;

describe('githubRequestHandler', function() {

    before(() => mockServerController.start());
    after(() => mockServerController.stop());

    describe('#getTopRepositories()', function () {
        it('should notify service unavailability error message when server is down', function (done) {
            testee.getTopRepositories('anyUser', 'serverThatDoesNotExist')
                .then(
                    null,
                    function (result) {
                        assert.deepEqual(result, getJSON('serviceUnavailable.json'));
                        done();
                    }
                );
        });
    });

    describe('#getTopRepositories()', function () {
        it('should notify when user is not found', function (done) {
            testee.getTopRepositories('unknownUser', MOCK_SERVER_URL)
                .then(
                    null,
                    function (result) {
                        assert.deepEqual(result, getJSON('unknownUserExpected.json'));
                        done();
                    }
                );
        });
    });


    describe('#getTopRepositories()', function () {
        it('should return 5 biggest repos sorted in descending size order when user has more than 5 repos', function (done) {
            testee.getTopRepositories('flongo', MOCK_SERVER_URL)
                .then(
                    function (result) {
                        assert.deepEqual(result, getJSON('flongoExpected.json'));
                        done();
                    }
                );
        });
    });

    describe('#getTopRepositories()', function () {
        it('should return less than 5 biggest repos sorted in descending size order when user has less than 5 repos', function (done) {
            testee.getTopRepositories('lessThanFive', MOCK_SERVER_URL)
                .then(
                    function (result) {
                        assert.deepEqual(result, getJSON('lessThanFiveExpected.json'));
                        done();
                    }
                );
        });
    });

    describe('#getTopRepositories()', function () {
        it('should return empty array when user exists but has not repositories', function (done) {
            testee.getTopRepositories('zero', MOCK_SERVER_URL)
                .then(
                    function (result) {
                        assert.deepEqual(result, getJSON('zeroExpected.json'));
                        done();
                    }
                );
        });
    });

});

var getJSON = fileName => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'expected', fileName), 'utf8'));
};