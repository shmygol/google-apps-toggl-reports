
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_app_() {
  /**
   * @constructor
   */
  var GasApp = function() {
    this._globalScopeCallbacks = [];
  };

  /**
   * Register the method in the provided scope
   * Pay attention, that the method must be called during the compiling proccess
   */
  GasApp.prototype._registerMethodInGlobalScope = function(methodName, scope, methodNameInScope) {
    if (typeof methodNameInScope === 'undefined') {
      methodNameInScope = methodName;
    }
    if (this._globalScopeCallbacks.indexOf(methodNameInScope) > -1) {
      throw new Error(
        'Couldn\'t register a method in the scope: the scope already has a property with name ' + methodNameInScope
      );
    }
    var _this = this;
    scope[methodNameInScope] = function() {
      return _this[methodName].apply(_this, arguments);
    };
  };

  GasApp.prototype.setConfigs = function(newConfigs) {
    this._configs = {};
    this.addConfigs(newConfigs);
  };

  GasApp.prototype.addConfigs = function(newConfigs) {
    this._configs = this._configs || {};
    for (var attrname in newConfigs) {
      this._configs[attrname] = newConfigs[attrname];
    }
  };

  GasApp.prototype.getConfigs = function() {
    this._configs = this._configs || {};
    return this._configs;
  };

  GasApp.prototype.getConfig = function(key) {
    var configs = this.getConfigs();

    return configs[key];
  };

  /**
   * Register menu callbacks in the scope
   * Pay attention, that the method uses GasApp.prototype._registerMethodInGlobalScope, which must be called during the compiling proccess
   */
  GasApp.prototype.registerMenuCallbacks = function(scope) {
    this._menuItems.forEach(function(element, index, array) {
      if (!element.isRegistered) {
        if (typeof element.globalFunctionName !== 'undefined') {
          throw new TypeError(
            'Menu element with index '
            + index
            + ' marked as not registered, but already has a property globalFunctionName'
          );
        }
        var globalFunctionName = element.methodName + '_';
        this._registerMethodInGlobalScope(element.methodName, scope, globalFunctionName);
        element.globalFunctionName = globalFunctionName;
        element.isRegistered = true;
      }
    }.bind(this));
  };

  /**
   * Create the app specific spreadsheet menu
   */
  GasApp.prototype.createMenu = function() {
    var addonMenu = SpreadsheetApp.getUi().createAddonMenu();
    this._menuItems.forEach(function(element, index, array) {
      if (typeof element.globalFunctionName === 'undefined') {
        throw new TypeError(
          'Menu element with index '
          + index
          + ' marked as registered, but doesn\'t have a property globalFunctionName'
        );
      } 
      addonMenu.addItem(element.caption, element.globalFunctionName);
    }.bind(this));
    addonMenu.addToUi();
  };


  return GasApp;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_app_();
}

