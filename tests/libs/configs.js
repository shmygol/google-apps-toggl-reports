var appRoot = require('app-root-path'),
    ask = require(appRoot + '/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var Configs = {};
suite('libs/configs', function() {

  setup(function() {
    Configs = ask('libs/configs');
  });

  suite('#constructor', function() {
    test('if default config is an empty object, should return data from env configs', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs({});

      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
    });

    test('should ask environment configs only once', function() {
      var expectedAskArg1 = 'environments/configs',
          counter = 0;
      global.ask_ = function(arg1) {
        counter += 1;
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      configs.get();
      configs.get('is_debug');
      configs.get('missing_key');
      expect(counter).to.equal(1);
    });
  });

  suite('#get', function() {
    test('if configs is empty object, should return empty object without arguments and undefined for any key is given', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {};
      };

      var configs = new Configs();

      expect(configs.get()).to.deep.equal({});
      expect(configs.get('foo0')).to.equal(undefined);
      expect(configs.get('foo1')).to.equal(undefined);
    });

    test('if configs is undefined, should return empty object without arguments and undefined for any key is given', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return undefined;
      };

      var configs = new Configs();

      expect(configs.get()).deep.equal({});
      expect(configs.get('foo0')).to.equal(undefined);
      expect(configs.get('foo1')).to.equal(undefined);
    });

    test('if configs is an object, should return it', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
    });

    test('if configs is an object, should return a config value for a given key', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      expect(configs.get('is_debug')).to.equal(true);
      expect(configs.get('toggl_token')).to.equal('1234567890');
    });

    test('if configs is an object, should return undefined for a not existing key', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      expect(configs.get('missing_key')).to.equal(undefined);
    });

    test('should return cloned configs data, not a reference to the data object', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      var configsData = configs.get();
      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
      configsData['new_lokal_key'] = 'foo';
      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
    });

    test('if Google App Property is enabled, should return a property value if exists, otherwse configs data', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {
          _protected_key: '_protected_key in configs',
          configs_key: 'configs_key in configs',
          property_key: 'property_key in configs'
        };
      };

      var propertiesMock = {
        getProperty: function(key) {
          return {
            _protected_key: '_protected_key in properties',
            property_key: 'property_key in properties'
          }[key] || null;
        }
      };

      var configs = new Configs(propertiesMock);

      expect(configs.get('missing_key')).to.equal(undefined);
      expect(configs.get('_protected_key')).to.equal('_protected_key in configs');
      expect(configs.get('configs_key')).to.equal('configs_key in configs');
      expect(configs.get('property_key')).to.equal('property_key in properties');
    });

    test('if Google App Property is enabled, should return always actual value', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {
          'property_key': 'property_key in configs'
        };
      };

      var counterGetProperty = 1;
      var propertiesMock = {
        getProperty: function(key) {
          return (key == 'property_key') ? counterGetProperty++ : null;
        }
      };

      var configs = new Configs(propertiesMock);

      expect(configs.get('property_key')).to.equal(1);
      expect(configs.get('property_key')).to.equal(2);
      expect(configs.get('property_key')).to.equal(3);
    });
  });
});

