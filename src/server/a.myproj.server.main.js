
var app = app || {};

/**
 * An example function that does something with the "active" spreadsheet,
 * which may be overridden by the developers debug function.
 * @return {Integer}
 */
app.countSheets = function() {
  var config = Configuration.getCurrent();
  var currentSpreadsheet = new SheetsUtilitiesLibrary(config)
      .getCurrentActiveSpreadsheet();
  var count = currentSpreadsheet.getSheets().length;
  if (config.debug) {
    Logger.log(
        Utilities.formatString('main::countSheets:\nThere %s %d sheet%s.',
        (count > 1) ? 'are' : 'is', count, (count > 1) ? 's' : ''));
  }
  return count;
};

/**
 * Passed into the configuration factory constructor
 * @return {myproj.json.Configuration} Default configuration settings.
 */
function getDefaultConfiguration_() {
  return {
    debug: false,
    sheets: {
      debugSpreadsheetId: null
    }
  };
}

