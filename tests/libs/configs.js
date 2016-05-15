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

      var configs = new Configs();

      expect(configs._data).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
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

      configs.getProperty('is_debug');
      configs.getProperty('missing_key');
      expect(counter).to.equal(1);
    });
  });

  suite('#getProperty', function() {
    test('if configs is empty object, should return undefined for any key is given', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {};
      };

      var configs = new Configs();

      expect(configs.getProperty('foo0')).to.equal(undefined);
      expect(configs.getProperty('foo1')).to.equal(undefined);
    });

    test('if configs is undefined, should return undefined for any key is given', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return undefined;
      };

      var configs = new Configs();

      expect(configs.getProperty('foo0')).to.equal(undefined);
      expect(configs.getProperty('foo1')).to.equal(undefined);
    });

    test('if configs is an object, should return a config value for a given key', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      expect(configs.getProperty('is_debug')).to.equal(true);
      expect(configs.getProperty('toggl_token')).to.equal('1234567890');
    });

    test('if configs is an object, should return undefined for a not existing key', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      expect(configs.getProperty('missing_key')).to.equal(undefined);
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

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      expect(configs.getProperty('missing_key')).to.equal(undefined);
      expect(configs.getProperty('_protected_key')).to.equal('_protected_key in configs');
      expect(configs.getProperty('configs_key')).to.equal('configs_key in configs');
      expect(configs.getProperty('property_key')).to.equal('property_key in properties');
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

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      expect(configs.getProperty('property_key')).to.equal(1);
      expect(configs.getProperty('property_key')).to.equal(2);
      expect(configs.getProperty('property_key')).to.equal(3);
    });
  });

  suite('#getProperties', function() {
    test('if configs is an object, should return a clone of it', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs();

      var configsData = configs.getProperties();
      expect(configs.getProperties()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
      configsData['toggl_token'] = '0000';
      configsData['new_lokal_key'] = 'foo';
      expect(configs.getProperties()).to.deep.equal({is_debug: true, toggl_token: '1234567890'});
    });

    test('if Google App Property is enabled, should return merged properties', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {
          is_debug: true,
          toggl_token: '1234567890',
        };
      };

      var propertiesMock = {
        getProperty: function(key) {
          return {
            toggl_token: 'toggl_token in properties',
            new_key: 'foo',
          }[key] || null;
        },
        getProperties: function(key) {
          return {
            toggl_token: 'toggl_token in properties',
            new_key: 'foo',
          };
        }
      };

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      expect(configs.getProperties()).to.deep.equal({
        is_debug: true,
        toggl_token: 'toggl_token in properties',
        'new_key': 'foo',
      });
    });

    test('should not overwrite protected configs by properties from Google Properhies Service', function() {
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
        },
        getProperties: function(key) {
          return {
            _protected_key: '_protected_key in properties',
            property_key: 'property_key in properties'
          };
        },
      };

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      expect(configs.getProperties()).to.deep.equal({
        _protected_key: '_protected_key in configs',
        configs_key: 'configs_key in configs',
        property_key: 'property_key in properties'
      });
    });
  });

  suite('#setProperty', function() {
    test('should call setProperty of Google Properties Service object', function() {
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
        setProperty: function(key, value) {
          expect(key).to.equal('new');
          expect(value).to.equal('foo');
          return {
            _protected_key: '_protected_key in properties',
            property_key: 'property_key in properties'
          }[key] || null;
        },
      };

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      configs.setProperty('new', 'foo');
    });

    test('should call setProperty of Google Properties Service object', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {
          _protected_key: '_protected_key in configs',
          configs_key: 'configs_key in configs',
          property_key: 'property_key in configs'
        };
      };

      var configs = new Configs();

      expect(configs.setProperty.bind(configs, 'new', 'foo')).to.throw(TypeError, 'Properties container must be defined in constructor, but isn\'t.');
    });

    test('should call setProperty of Google Properties Service object', function() {
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
        setProperty: function(key, value) {
          return {
            _protected_key: '_protected_key in properties',
            property_key: 'property_key in properties'
          }[key] || null;
        },
      };

      var configs = new Configs();
      configs._propertiesContainer = propertiesMock;

      expect(configs.setProperty.bind(configs, '_protected_new', 'foo')).to.throw(TypeError, 'Cuoln\'t set protected property \'_protected_new\'');
    });
  });
});

