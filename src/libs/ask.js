
function ask_(moduleName, basePath, requireFunction) {
  if (moduleName[0] === '.' || moduleName[0] === '/' ) {
    throw new TypeError(
      'moduleName parameter must not start with "/" or ".". If you need to set path prefix use optional basePath parameter'
    );
  }
  var functionNameToAsk = 'ask_' + moduleName.replace('/', '_') + '_';

  requireFunction = requireFunction || require;
  basePath = basePath || '';

  if (eval('typeof ' + functionNameToAsk) !== 'undefined') {
    return eval(functionNameToAsk + '()');
  }
  if (typeof requireFunction !== 'undefined') {
    return requireFunction(basePath + moduleName);
  }
  throw new Error('Ask function ' + functionNameToAsk + ' is not foundModule and no external require function provided');
}

if (typeof module !== 'undefined') {
  module.exports = ask_;
}

