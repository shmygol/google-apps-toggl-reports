/*
 * Require test framework parts
 */

var chai = require('chai'),
    expect = chai.expect;

/*
 * Include required files
 */


/*
 * Tests
 */
var utils = {};
suite('lib.utils', function() {

  setup(function() {
    utils = require('../../../src/libs/lib.utils.js');
  });

  suite('#getSpreadsheetUrl', function() {
    test('should return the url based on the method parameters', function() {
        var expected = 'https://docs.google.com/spreadsheets/d/FILE_ID#001/edit#gid=GID#001';
        var actual = utils.getSpreadsheetUrl('FILE_ID#001', 'GID#001');
        expect(actual).to.equal(expected);
    });

    test('should throw an exception if file id and/or gid are not provided', function() {
        var expected = 'https://docs.google.com/spreadsheets/d/FILE_ID#001/edit#gid=GID#001';

        expect(utils.getSpreadsheetUrl.bind(utils, 'FILE_ID#001')).to.throw(TypeError);
        expect(utils.getSpreadsheetUrl.bind(utils, undefined, 'GID#001')).to.throw(TypeError);
        expect(utils.getSpreadsheetUrl.bind(utils)).to.throw(TypeError);
    });
  });

})

