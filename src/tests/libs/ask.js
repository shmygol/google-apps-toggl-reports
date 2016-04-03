var appRoot = require('app-root-path'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var ask_ = require(appRoot + '/src/libs/ask.js');
suite('ask_', function() {

  suite('#', function() {
    test('should call a function generated from the given module name regardless basePath', function() {
      var expected = 'function result';
      var ask_libs_mmm_ = function() {
        return expected;
      }

      expect(ask_('libs/mmm')).to.equal(expected);
      expect(ask_('libs/mmm', 'any/path/')).to.equal(expected);
    });

    test('should try to include a module if a generated function not found', function() {
      var customRequireFunction = function(moduleName) {
        return 'result from custom require function for module ' + moduleName;
      }
      var require = function(moduleName) {
        return 'result from standart require function for module ' + moduleName;
      }

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
      var require = undefined;

      expect(ask_.bind(adk_, 'libs/mmm')).to.throw(Error);
      expect(ask_.bind(adk_, 'libs/mmm', 'any/path/')).to.throw(Error);
    });

    test('should throw an exception if the module name starts with "." or "/"', function() {
      var ask_libs_mmm_ = function() {
        return;
      }

      expect(ask_.bind(adk_, '.libs/mmm')).to.throw(TypeError);
      expect(ask_.bind(adk_, './libs/mmm')).to.throw(TypeError);
      expect(ask_.bind(adk_, '/libs/mmm')).to.throw(TypeError);
    });

  });

})

