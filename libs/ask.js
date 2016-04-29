
function ask_(moduleName, requireFunction) {
  if (typeof requireFunction === 'undefined' && typeof require !== 'undefined') {
    requireFunction = require;
  }

  if (moduleName[0] === '.' || moduleName[0] === '/' ) {
    throw new TypeError(
      'moduleName parameter must not start with "/" or "."'
    );
  }
  var functionNameToAsk = 'ask_' + moduleName.replace(/[-\/\.]/g, '_') + '_',
      isFunctionExist = false;
  try {
    isFunctionExist = eval('typeof ' + functionNameToAsk) !== 'undefined';
  } catch (ex) {
    ex.message = 'Function name to ask: "' + functionNameToAsk + '". Error: ' + ex.message;
    throw ex;
  }

  if (isFunctionExist) {
    return eval(functionNameToAsk + '()');
  }
  if (typeof requireFunction !== 'undefined') {
    var appRoot = require('app-root-path'),
        modulePath = appRoot + '/' + moduleName,
        errors = [];
    try {
      return requireFunction(moduleName);
    } catch (ex) {
      errors.push(ex.message);
      try {
        return requireFunction(modulePath);
      } catch (ex) {
        errors.push(ex.message);
        throw new Error(
          'Can include neither "' + moduleName + '" nor "' + modulePath + '" modules. Errors: \n' + errors.join('\n')
        );
      }
    }
  }
  throw new Error('Ask function ' + functionNameToAsk + ' is not foundModule and no external require function provided');
}

if (typeof module !== 'undefined') {
  module.exports = ask_;
}

