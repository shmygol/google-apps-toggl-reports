/**
 * 
 * function action() {
 * 
 *   var unamepass = "11111111111111111111111111111111:api_token"; // API token
 *   var digest = Utilities.base64Encode(unamepass);
 *   var digestfull = "Basic " + digest;
 * 
 *   var response = UrlFetchApp.fetch("https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&", {
 *     method: "get",
 *       headers: {
 *         "Authorization": digestfull
 *       }
 *   });
 *   var test = response.getContentText();
 *   var blaat = Utilities.jsonParse(test).data;
 * 
 * 
 *   for (var i = 1; i <= blaat.length; i++) {
 *     blaat[i - 1]["title"]["project"]
 *       blaat[i - 1]["title"]["client"]
 *       blaat[i - 1]["time"]
 *   }
 * }
*/

/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_toggl_() {
  /**
   * @constructor
   */
  var TogglApi = function() {
  };

  TogglApi.prototype.request = function(type, parameters) {
    throw new Error('Not implemented');
  };

  TogglApi.prototype.summary = function(since, until, clientIds, projectIds, tagIds, parameters) {
    throw new Error('Not implemented');
  };

  return TogglApi;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_toggl_();
}

