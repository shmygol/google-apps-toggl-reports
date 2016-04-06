var appRoot = require('app-root-path'),
    ask = require(appRoot + '/src/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var helpers = {};
suite('lib.helpers', function() {

  setup(function() {
    helpers = ask('libs/helpers');
  });

  suite('#getSpreadsheetUrl', function() {
    test('should return the url based on the method parameters', function() {
        var expected = 'https://docs.google.com/spreadsheets/d/FILE_ID#001/edit#gid=GID#001';
        var actual = helpers.getSpreadsheetUrl('FILE_ID#001', 'GID#001');
        expect(actual).to.equal(expected);
    });

    test('should throw an exception if file id and/or gid are not provided', function() {
        var expected = 'https://docs.google.com/spreadsheets/d/FILE_ID#001/edit#gid=GID#001';

        expect(helpers.getSpreadsheetUrl.bind(helpers, 'FILE_ID#001')).to.throw(TypeError);
        expect(helpers.getSpreadsheetUrl.bind(helpers, undefined, 'GID#001')).to.throw(TypeError);
        expect(helpers.getSpreadsheetUrl.bind(helpers)).to.throw(TypeError);
    });
  });

});

