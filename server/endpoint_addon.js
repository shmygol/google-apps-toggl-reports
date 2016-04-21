var app = ask_('server/app');
app.registerMenuCallbacks(this);

/**
 * Called when an add-on is installed.
 * @param {Object} e Apps Script onInstall event object
 */
function onInstall(e) {
  app.pluginOnInstall(e);
}


/**
 * Called when a spreadsheet that is associated with this add-on is opened.
 * @param {Object} e Apps Script onInstall event object
 */
function onOpen(e) {
  app.pluginOnOpen(e);
}

function TOGGL_REPORT_DAY() {
  return app.funcTogglReportDay.apply(app, arguments);
}

function TOGGL_REPORT_WEEK() {
  return app.funcTogglReportWeek.apply(app, arguments);
}

function TOGGL_REPORT_MONTH() {
  return app.funcTogglReportMonth.apply(app, arguments);
}
