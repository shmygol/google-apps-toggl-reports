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

    test('if default config is an object, should return merged data from env and default configs', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs({default_key: 'foo', default_key_two: 2});

      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890', default_key: 'foo', default_key_two: 2});
    });

    test('if default config is an object with same key, should return merged data and env has a higher priority', function() {
      var expectedAskArg1 = 'environments/configs';
      global.ask_ = function(arg1) {
        expect(arg1).to.equal(expectedAskArg1);
        return {is_debug: true, toggl_token: '1234567890'};
      };

      var configs = new Configs({is_debug: false, default_key: 'foo'});

      expect(configs.get()).to.deep.equal({is_debug: true, toggl_token: '1234567890', default_key: 'foo'});
    });

    test('should call ask_ only once', function() {
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
  });
});

