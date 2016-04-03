/*
 * Modules
 */
var appRoot = require('app-root-path'),
    chai = require('chai'),
    expect = chai.expect,
    rewire =  require('rewire'),
    pathToAsk = appRoot + '/src/libs/ask.js';

/*
 * Prepare
 */
var ask_ = rewire(pathToAsk),
    originalRequire = ask_.__get__('require');

/*
 * Tests
 */
suite('ask_', function() {

  setup(function() {
    ask_ = rewire(pathToAsk);

    ask_.__set__('ask_libs_mmm_', undefined);
    ask_.__set__('require', originalRequire);
  });

  suite('#', function() {
    test('should call a function generated from the given module name regardless basePath', function() {
      var expected = 'function result';

      ask_.__set__('ask_libs_mmm_', function() {
        return expected;
      });

      expect(ask_('libs/mmm')).to.equal(expected);
      expect(ask_('libs/mmm', 'any/path/')).to.equal(expected);
    });

    test('should try to include a module if a generated function not found', function() {
      var customRequireFunction = function(moduleName) {
        return 'result from custom require function for module ' + moduleName;
      };
      var originalRequire = ask_.__get__('require');

      ask_.__set__('require', function(moduleName) {
        return 'result from standart require function for module ' + moduleName;
      });

      // standart require (by default)
      expect(ask_('libs/mmm')).to.equal('result from standart require function for module libs/mmm');
      expect(ask_('libs/mmm', 'any/path/')).to.equal('result from standart require function for module any/path/libs/mmm');

      // the same with the provided custon require function
      expect(ask_('libs/mmm', undefined, customRequireFunction)).
        to.equal('result from custom require function for module libs/mmm');
      expect(ask_('libs/mmm', 'any/path/', customRequireFunction)).
        to.equal('result from custom require function for module any/path/libs/mmm');
    });

    test('should throw an exception if generated function not found and no other require function provided', function() {
      var originalRequire = ask_.__get__('require');

      ask_.__set__('require', undefined);

      expect(ask_.bind(ask_, 'libs/mmm')).to.throw(Error, 'Ask function ask_libs_mmm_ is not foundModule and no external require function provided');
      expect(ask_.bind(ask_, 'libs/mmm', 'any/path/')).to.throw(Error, 'Ask function ask_libs_mmm_ is not foundModule and no external require function provided');
    });

    test('should throw an exception if the module name starts with "." or "/"', function() {
      ask_.__set__('ask_libs_mmm_', function() {
        return;
      });

      expect(ask_.bind(ask_, '.libs/mmm')).to.throw(TypeError);
      expect(ask_.bind(ask_, './libs/mmm')).to.throw(TypeError);
      expect(ask_.bind(ask_, '/libs/mmm')).to.throw(TypeError);
    });

  });

});

