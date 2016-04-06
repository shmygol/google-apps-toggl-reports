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
    ask_.__set__('appRoot', '/root/');
    ask_.__set__('require', function(moduleName) {
      if (moduleName == 'app-root-path') {
        return '/root';
      }
      if (moduleName == 'relative/path/to/missing/module' || moduleName == 'missing-module' || moduleName == '/root/src/missing-module') {
        throw new Error('Cannot find module \'' + moduleName+ '\'');
      }
      return 'result from standart require function for module "' + moduleName + '"';
    });

    // undo all changes from tests
    ask_.__set__('ask_libs_mmm_', undefined);
  });

  suite('#', function() {
    test('should call a function generated from the given module', function() {
      var expected = 'function result';

      ask_.__set__('ask_libs_mmm_', function() {
        return expected;
      });

      expect(ask_('libs/mmm')).to.equal(expected);
    });

    test('should try to include a module by name and by path if a generated function not found', function() {
      var customRequireFunction = function(moduleName) {
        if (moduleName == 'relative/path/to/missing/module') {
          throw new Error('Cannot find module \'' + moduleName+ '\'');
        }
        return 'result from custom require function for module "' + moduleName + '"';
      };

      expect(ask_('module-name')).
        to.equal('result from standart require function for module "module-name"');
      expect(ask_('relative/path/to/missing/module')).
        to.equal('result from standart require function for module "/root/src/relative/path/to/missing/module"');

      expect(ask_('libs/mmm', customRequireFunction)).
        to.equal('result from custom require function for module "libs/mmm"');
      expect(ask_('relative/path/to/missing/module', customRequireFunction)).
        to.equal('result from custom require function for module "/root/src/relative/path/to/missing/module"');
    });

    test('should throw an exception if generated function not found and no other require function provided', function() {

      ask_.__set__('require', undefined);

      expect(ask_.bind(ask_, 'libs/mmm')).to.throw(Error, 'Ask function ask_libs_mmm_ is not foundModule and no external require function provided');
    });

    test('should throw an exception if neithere generated function nor module found', function() {
      expect(ask_.bind(ask_, 'missing-module')).
        to.throw(Error, 'Can include neither "missing-module" nor "/root/src/missing-module" modules. Errors: \nCannot find module \'missing-module\'\nCannot find module \'/root/src/missing-module\'');
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

