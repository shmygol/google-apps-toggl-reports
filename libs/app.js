
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_app_() {
  /**
   * Required libs
   */
  var Configs = ask_('libs/configs');

  /**
   * @constructor
   */
  var GasApp = function() {
    this.configs = new Configs();
  };

  /**
   * Register the method in the provided scope
   * Pay attention, that the method must be called during the compiling proccess
   */
  GasApp.prototype._registerMethodInGlobalScope = function(methodName, scope, methodNameInScope) {
    if (typeof methodNameInScope === 'undefined') {
      methodNameInScope = methodName;
    }
    if (typeof scope[methodNameInScope] !== 'undefined') {
      throw new Error(
        'Couldn\'t register a method in the scope: the scope already has a property with name ' + methodNameInScope
      );
    }
    var _this = this;
    scope[methodNameInScope] = function() {
      return _this[methodName].apply(_this, arguments);
    };
  };

  /**
   * Get the application's UI object
   */
  GasApp.prototype.getUi = function() {
    return SpreadsheetApp.getUi();
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
            'Menu element with index ' +
            index +
            ' marked as not registered, but already has a property globalFunctionName'
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
    var addonMenu = this.getUi().createAddonMenu();
    this._menuItems.forEach(function(element, index, array) {
      if (typeof element.globalFunctionName === 'undefined') {
        throw new TypeError(
          'Menu element with index ' +
          index +
          ' marked as registered, but doesn\'t have a property globalFunctionName'
        );
      } 
      addonMenu.addItem(element.caption, element.globalFunctionName);
    }.bind(this));
    addonMenu.addToUi();
  };

  /**
   * Show a prompt with the given text and Ok, Cancel buttons.
   * If Ok button is clicked, text from user will be returned, otherwise undefined.
   *
   * @param {String} message The message to display in the dialog box
   * @return {string|undefined}
   */
  GasApp.prototype.simplePrompt = function(message) {
    var ui = this.getUi(),
        buttonSet = ui.ButtonSet.OK_CANCEL,
        okButton = ui.Button.OK;

    var result = ui.prompt(message, buttonSet);
    if (result.getSelectedButton() == okButton) {
      return result.getResponseText();
    } else {
      return undefined;
    }
  };

  return GasApp;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_app_();
}

