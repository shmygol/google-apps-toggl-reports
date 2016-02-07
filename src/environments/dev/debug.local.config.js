// For testing - broadens the OAuth scope to allow opening any
// Spreadsheet on the current user's Drive
/** @NotOnlyCurrentDoc */


/**
 * @param {myproj.json.Configuration} configuration
 *     The current configuration settings.
 * @return {myproj.json.Configuration} configuration
 *     The current configuration settings, updated with test settings.
 */
function provideEnvironmentConfiguration_(configuration) {
  configuration.sheets.debugSpreadsheetId =
      '1pabsGwPo0tTbWA9RLcC1I1A1Ch-fMjsS0f0TyeynjJc';
  configuration.debug = true;
  return configuration;
}
