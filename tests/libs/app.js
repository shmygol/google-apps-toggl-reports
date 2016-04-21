var appRoot = require('app-root-path'),
    ask = require(appRoot + '/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect;

global.ask_ = function(arg1) {
  if (arg1 == 'libs/configs') {
    return Configs;
  } else if (arg1 == 'environments/configs') {
    return {};
  } else {
    throw new Error('Unexpected ask_ argument ' + arg1);
  }
};

/*
 * Tests
 */
var app, Configs, GasApp;
suite('libs/app', function() {

  setup(function() {
    Configs = ask('libs/configs');
    GasApp = ask('libs/app');

    app = new GasApp();
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

