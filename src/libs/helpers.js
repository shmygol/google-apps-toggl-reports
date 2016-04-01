
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_helpers_() {
  var utils = {};

  /**
   * Composes the correct URL to open a Google Sheet from Drive by URL.
   * @param {String} fileId Drive file ID for the spreadsheet.
   * @param {String} gid The sheet ID to open.
   *     Value is in "gid=" param in the URL.
   * @return {String} Full URL to open the spreadsheet on Drive.
   */
  utils.getSpreadsheetUrl = function(fileId, gid) {
    if (typeof fileId === 'undefined') {
      throw new TypeError('fileId parameter is undefined');
    }
    if (typeof gid === 'undefined') {
      throw new TypeError('gid parameter is undefined');
    }
    return 'https://docs.google.com/spreadsheets/d/' + fileId +
        '/edit#gid=' + gid;
  };

  /**
   * Logs an Apps Script exception, including the call stack
   * @private
   * @param {Object} e Apps Script runtime error object
   */
  utils.logException = function(e) {
    Logger.log('Apps Script runtime exception:');
    Logger.log(e.message);
    Logger.log('\n' + e.stack + '\n');
  };

  /**
   *  Used to insert any HTML file in the project into an outer HTML file.
   *  Called from within the outer HTML file.
   *  @param {String} filename Name of the file in the project.
   *      Do not include ".html".
   *  @return {String} HTML markup for the requested file.
   */
  utils.includeUiFile = function(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  };

  return utils;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_helpers_();
}
