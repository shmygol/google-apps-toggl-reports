
/**
 * Wrapper to emulate require
 * @return {Object}
 */
function require_lib_app_() {
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
    if (this._globalScopeCallbacks.indexOf(methodNameInScope) < 0) {
      // TODO NOW: make sure that there are no methods with the same name in the scope, otherwise throw an exception
      var _this = this;
      scope[methodNameInScope] = function() {
        return _this[methodName].apply(_this, arguments);
      };
    }
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
          // TODO NOW: make sure that element has no globalFunctionName index, otherwise throw an exception
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
        // TODO NOW: make sure that element has globalFunctionName index, otherwise throw an exception
      } 
      addonMenu.addItem(element.caption, element.globalFunctionName);
    }.bind(this));
    addonMenu.addToUi();
  };


  return GasApp;
}

if (typeof module !== 'undefined') {
    module.exports = require_lib_app_();
}

