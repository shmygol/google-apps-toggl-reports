var appRoot = require('app-root-path'),
    ask = require(appRoot + '/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var togglApi = {};
suite('libs/toggl', function() {

  setup(function() {
    var TogglApi = ask('libs/toggl')
    togglApi = new TogglApi();
  });

  suite('#request', function() {
    test('', function() {
    });
    test('', function() {
    });
  });

  suite('#summary', function() {
    test('', function() {
    });
    test('', function() {
    });
  });

});

