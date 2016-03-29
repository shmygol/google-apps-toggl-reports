/*
 * Require test framework parts
 */

var chai = require('chai'),
    expect = chai.expect;

/*
 * Include required files
 */

var fs = require('fs');
includeFile = function(fileName) {
  var content = fs.readFileSync(fileName).toString();
  eval.apply(global, [content]);
};
includeFile('src/libs/lib.app.js');
// includeFile('src/server/a.myproj.server.main.js');

/*
 * Tests
 */
var app = {};
suite('GasApp', function() {

  setup(function() {
    var GasApp = getLibGasApp_();
    app = new GasApp();
  });

  suite('#setConfigs', function() {
    test('should replace existing configs', function() {
      app.setConfigs({test01: 5});
      expect(app._configs).to.eql(
        {test01: 5}
      );

      app.setConfigs({test02: 10});
      expect(app._configs).to.eql(
        {test02: 10}
      );

      app.setConfigs({test03: 15, test04: 20});
      expect(app._configs).to.eql(
        {test03: 15, test04: 20}
      );
    });
  });

  suite('#addConfigs', function() {
    test('should add configs', function() {
      app._configs = undefined;
      app.addConfigs({test01: 5});
      expect(app._configs).to.eql(
        {test01: 5}
      );
    });

    test('should add several configs and keep old ones', function() {
      app._configs = {test01: 5, test02: 10};
      app.addConfigs({test03: 15, test04: 20});
      expect(app._configs).to.eql(
        {test01: 5, test02: 10, test03: 15, test04: 20}
      );
    });

    test('should add configs with new keys and replaces ones with same ones', function() {
      app._configs = {test01: 5, test02: 10, test03: 15, test04: 20};
      app.addConfigs({test03: 3, test01: 1});
      expect(app._configs).to.eql(
        {test01: 1, test02: 10, test03: 3, test04: 20}
      );
    });
  });

  suite('#getConfigs', function() {
    test('should return empty object if configs is empty object', function() {
      app._configs = {};
      expect(app.getConfigs()).to.eql(
        {}
      );
    });

    test('should return empty object if configs is undefined', function() {
      app._configs = undefined;
      expect(app.getConfigs()).to.eql(
        {}
      );
    });

    test('should return all the configs if there are some', function() {
      app._configs = {test01: 5, test02: 10, test03: 15, test04: 20};
      expect(app.getConfigs()).to.eql(
        {test01: 5, test02: 10, test03: 15, test04: 20}
      );
    });
  });

  suite('#getConfig', function() {
    test('should return a config value for a given key', function() {
      app._configs = {test01: 5, test02: 10, test03: 15, test04: 20};
      expect(app.getConfig('test01')).to.equal(5);
      expect(app.getConfig('test03')).to.equal(15);
    });

    test('should return undefined there is no configs by a given key', function() {
      app._configs = {test01: 5, test02: 10, test03: 15, test04: 20};
      expect(app.getConfig('test99')).to.equal(undefined);
    });

    test('should return undefined for any key if configs is undefined', function() {
      app._configs = undefined;
      expect(app.getConfig('test01')).to.equal(undefined);
      expect(app.getConfig('test99')).to.equal(undefined);
    });

    test('should return undefined for any key if configs is empty object', function() {
      app._configs = {};
      expect(app.getConfig('test01')).to.equal(undefined);
      expect(app.getConfig('test99')).to.equal(undefined);
    });
  });
})

