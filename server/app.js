
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_server_app_() {
  /**
   * Required libs
   */
  var GasApp = ask_('libs/app'),
      Toggl = ask_('libs/toggl'),
      SheetsUtilities = ask_('libs/sheets'),
      toggl;

  /**
   * App instance
   */
  var app = new GasApp();

  app._getToggl = function() {
    if (typeof toggl === 'undefined') {
      toggl = new Toggl(
        this.configs.get('toggl_api_key'),
        {
          user_agent: this.configs.get('toggl_user_agent'),
          workspace_id: this.configs.get('toggl_workspace_id')
        }
      );
    }
    return toggl;
  }

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

  /**
   * 
   */
  app.funcTogglReportDay = function(startDate) {
    return this._getToggl().summary(startDate, startDate).total_grand;
  };

  /**
   * 
   */
  app.funcTogglReportWeek = function(startDate) {
    return this._getToggl().summary(startDate, 'week').total_grand;
  };

  /**
   * 
   */
  app.funcTogglReportMonth = function(startDate) {
    return this._getToggl().summary(startDate, 'month').total_grand;
  };

  /**
   * Menu item callback
   */
  app.onTestButton = function() {
    Logger.log('Test Button. Sheets count: ', app.countSheets());
  };

  /**
   * Menu item callback
   */
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
  app._toggl = new Toggl();

  /**
   * Return prepaired application instance
   */
  return app;
}

if (typeof module !== 'undefined') {
  module.exports = ask_server_app_();
}

