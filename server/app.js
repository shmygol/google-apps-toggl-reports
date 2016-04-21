
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_server_app_() {
  /**
   * Required libs
   */
  var GasApp = ask_('libs/app'),
      SheetsUtilities = ask_('libs/sheets');

  /**
   * App instance
   */
  var app = new GasApp();

  /**
   * onInstall
   * @param {Object} e Apps Script onInstall event object
   */
  app.pluginOnInstall = function(e) {
    app.pluginOnOpen(e);
  };

  /**
   * onOpen
   * @param {Object} e Apps Script onOpen event object
   */
  app.pluginOnOpen = function(e) {
    this.createMenu();
  };

  app.onTestButton = function() {
    Logger.log('Test Button. Sheets count: ', app.countSheets());
  };

  app.onTestButtonToo = function() {
    Logger.log('Another test Button clicked');
  };

  /**
   * An example function that calculates the count of sheets
   * @return {Integer}
   */
  app.countSheets = function() {
    var sheetsUtilities = new SheetsUtilities(this.configs.get()),
        currentSpreadsheet = sheetsUtilities.getCurrentActiveSpreadsheet();
    var count = currentSpreadsheet.getSheets().length;
    if (this.configs.get('debug')) {
      Logger.log(
          Utilities.formatString('main::countSheets:\nThere %s %d sheet%s.',
            (count > 1) ? 'are' : 'is', count, (count > 1) ? 's' : ''));
    }
    return count;
  };

  /**
   * Set application's properties
   */
  app._menuItems = [
    {
      'caption': 'Test Button',
      'methodName': 'onTestButton',
      'globalFunctionName': undefined,
      'isRegistered': false,
    },
    {
      'caption': 'Test Button2',
      'methodName': 'onTestButtonToo',
      'globalFunctionName': undefined,
      'isRegistered': false,
    },
  ];

  /**
   * Return prepaired application instance
   */
  return app;
}

if (typeof module !== 'undefined') {
  module.exports = ask_server_app_();
}

