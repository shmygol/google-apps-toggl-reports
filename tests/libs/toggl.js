var appRoot = require('app-root-path'),
    ask = require(appRoot + '/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

/*
 * Tests
 */
var togglApi, UrlFetchAppMock;
suite('libs/toggl', function() {

  setup(function() {
    var TogglApi = ask('libs/toggl'),
        UrlFetchAppMock = sinon.mock();

    global.UrlFetchApp = UrlFetchAppMock;
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

