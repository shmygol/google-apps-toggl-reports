
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

  /**
   * Instantiate libs/toggl object
   * and save as toggl variable in the closure if it's not defined
   *
   * @return {Objqct} libs/toggl object
   * @throws {Error} if config or property toggl_api_key is not defined
   */
  app._getToggl = function() {
    if (typeof toggl === 'undefined') {
      var togglApiKey = this.configs.getProperty('toggl_api_key');
      if (!togglApiKey) {
        throw new Error('Required property toggl_api_key is not set');
      }
      toggl = new Toggl(
        togglApiKey,
        {
          user_agent: this.configs.getProperty('toggl_user_agent'),
          workspace_id: this.configs.getProperty('toggl_workspace_id')
        }
      );
    }
    return toggl;
  };

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
   * TOGGL_REPORT
   */
  app.funcTogglReport = function(workspaceId, since, until, clientIds, projectIds, tagIds) {
    var toggl = this._getToggl(),
        response;

    response = toggl.summary(
      since, until, clientIds, projectIds, tagIds, 
      {workspace_id: workspaceId}
    );
    return response.total_grand;
  };

  /**
   * TOGGL_REPORT_DAY
   */
  app.funcTogglReportDay = function(workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(workspaceId, since, since, clientIds, projectIds, tagIds);
  };

  /**
   * TOGGL_REPORT_WEEK
   */
  app.funcTogglReportWeek = function(workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(workspaceId, since, 'week', clientIds, projectIds, tagIds);
  };

  /**
   * TOGGL_REPORT_MONTH
   */
  app.funcTogglReportMonth = function(workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(workspaceId, since, 'month', clientIds, projectIds, tagIds);
  };

  /**
   * Set application's properties
   */
  app._menuItems = [
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

