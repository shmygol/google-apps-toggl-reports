
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
  app.funcTogglReport = function(apiToken, workspaceId, since, until, clientIds, projectIds, tagIds) {
    var toggl = this._getToggl(),
        response;

    toggl.setApiToken(apiToken);
    response = this._getToggl().summary(
      since, until, clientIds, projectIds, tagIds, 
      {workspace_id: workspaceId}
    );
    return response.total_grand;
  };

  /**
   * TOGGL_REPORT_DAY
   */
  app.funcTogglReportDay = function(apiToken, workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(apiToken, workspaceId, since, since, clientIds, projectIds, tagIds);
  };

  /**
   * TOGGL_REPORT_WEEK
   */
  app.funcTogglReportWeek = function(apiToken, workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(apiToken, workspaceId, since, 'week', clientIds, projectIds, tagIds);
  };

  /**
   * TOGGL_REPORT_MONTH
   */
  app.funcTogglReportMonth = function(apiToken, workspaceId, since, clientIds, projectIds, tagIds) {
    return this.funcTogglReport(apiToken, workspaceId, since, 'month', clientIds, projectIds, tagIds);
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

