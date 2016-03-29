
var utils = utils || {};

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

