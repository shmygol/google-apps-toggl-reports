var appRoot = require('app-root-path'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var app = {};
suite('GasApp', function() {

  setup(function() {
    var GasApp = require(appRoot + '/src/libs/app.js');
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

    test('should return undefined if there is no configs by a given key', function() {
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
  suite('#registerMenuCallbacks', function() {
    test('should create all marked as not registered required proxy functions in the given scope according _menuItems parameter', function() {
      var fooScope = {existingScopeVar_: 'foo'};
      app._menuItems = [
        {
          'caption': 'Test Button',
          'methodName': 'onTestButton',
          'globalFunctionName': undefined,
          'isRegistered': false,
        },
        {
          'caption': 'Test Button2',
          'methodName': 'onTestButtonTwo',
          'globalFunctionName': undefined,
          'isRegistered': false,
        },
        {
          'caption': 'Test Button (registered before)',
          'methodName': 'onTestButtonRegistered',
          'globalFunctionName': false,
          'isRegistered': true,
        },
      ];
      app.registerMenuCallbacks(fooScope);
      expect(fooScope).to.have.property('onTestButton_');
      expect(fooScope).to.have.property('onTestButtonTwo_');
      expect(fooScope).not.to.have.property('onTestButtonRegistered_');
      expect(fooScope.onTestButton_).to.be.a('function');
      expect(fooScope.onTestButtonTwo_).to.be.a('function');
    });

    test('should throw an exception if a menu item already has a globalFunctionName property', function() {
      var fooScope = {existingScopeVar_: 'foo'};
      app._menuItems = [
        {
          'caption': 'Test Button',
          'methodName': 'onTestButton',
          'globalFunctionName': undefined,
          'isRegistered': false,
        },
        {
          'caption': 'Test Button2',
          'methodName': 'onTestButtonTwo',
          'globalFunctionName': 'onTestButtonTwo_', // globalFunctionName must not to be set if isRegistered is false
          'isRegistered': false,
        },
      ];
      expect(app.registerMenuCallbacks.bind(app, fooScope)).to.throw(TypeError);
    });

    test('should throw an exception if the scope already has a method with the same name', function() {
      var fooScope = {existingScopeVar_: 'foo'};
      app._menuItems = [
        {
          'caption': 'Test Button',
          'methodName': 'existingScopeVar',
          'globalFunctionName': undefined,
          'isRegistered': false,
        },
      ];
      expect(app.registerMenuCallbacks.bind(app, fooScope)).to.throw(Error);
    });
  });
});

