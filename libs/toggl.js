
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_toggl_() {
  /**
   * @constructor
   */
  var TogglApi = function(apiToken, standardParameters) {
    this._apiToken = apiToken;
    this._standardParameters = standardParameters || {};
  };

  TogglApi.prototype._getAuthorization = function() {
    var unamepass = this._apiToken + ':api_token';
    return 'Basic ' + Utilities.base64Encode(unamepass);
  };

  TogglApi.prototype._getApiUrl = function(type, queryParameters) {
    var baseUrl = 'https://www.toggl.com/reports/api/v2/';
        typePathes = {summary: 'summary.json'},
        queryString = '';
    if (!typePathes.hasOwnProperty(type)) {
      throw new TypeError('Request type ' + type + ' doesn\'t exist');
    }

    queryString = '?';
    for (key in queryParameters) {
      queryString += key + '=' + encodeURIComponent(queryParameters[key]) + '&';
    }

    return baseUrl + typePathes[type] + queryString;
  };

  /**
   * Set API Token for authorization
   *
   * @param {String} apiToken
   * @return {undefined}
   */
  TogglApi.prototype.setApiToken = function(apiToken) {
    this._apiToken = apiToken;
  };

  /**
   * Set standard GET parameters which will be by default sent with all request
   *
   * @param {Object} parameters New GET parameters
   * @return {undefined}
   */
  TogglApi.prototype.setStandardParameters = function(parameters) {
    this._standardParameters = parameters;
  };

  /**
   * Performs a request to Toggl API
   *
   * @param {String} type The type of a toggl request, currently can be only 'sammary'
   * @param {Object} parameters GET parameters
   * @return {Object}
   */
  TogglApi.prototype.request = function(type, parameters) {
    var allQueryParameters = {};
    for (key in this._standardParameters) {
      allQueryParameters[key] = this._standardParameters[key];
    }
    for (key in parameters) {
      allQueryParameters[key] = parameters[key];
    }

    var apiUrl = this._getApiUrl(type, allQueryParameters);

    var response = UrlFetchApp.fetch(
      apiUrl,
      {
        method: 'get',
        headers: {
          Authorization: this._getAuthorization(),
        }
      }
    );

    return {
      text: response.getContentText(),
      code: response.getResponseCode(),
      json: Utilities.jsonParse(response.getContentText()),
    };
  };

  /**
   * Performs a request to Toggl Summary API
   *
   * @param {String} since
   * @param {String} until Until date in ISO format or one of the strings 'week', 'month', 'year'
   * @param {String} clientIds
   * @param {String} projectIds
   * @param {String} tagIds
   * @param {Object} parameters Additional GET parameters
   * @return {Object}
   *
   * @throws {TypeError} if until is invalid
   * @throws {Error} if reguest was not successfull
   */
  TogglApi.prototype.summary = function(since, until, clientIds, projectIds, tagIds, parameters) {
    parameters = parameters || {};
    if (since) {
      parameters.since = since;
    }
    if (until) {
      var allowedUntilStrings = ['week', 'month', 'year'],
          dateRegex = /\d{4}-[01]\d-[0-3]\d/;
      if (allowedUntilStrings.indexOf(until) > -1) {
        var sinceDate = new Date(parameters.since.split('-'));
        if (until == 'week') {
          sinceDate.setDate(sinceDate.getDate() + 7);
        } else if (until == 'month') {
          sinceDate.setMonth(sinceDate.getMonth() + 1);
        } else if (until == 'year') {
          sinceDate.setFullYear(sinceDate.getFullYear() + 1);
        }
        parameters.until = sinceDate.toISOString().split('T')[0];
      } else if (dateRegex.test(until)) {
        parameters.until = until;
      } else {
        throw new TypeError('Until date \'' + until + '\' is invalid. Must be \'week\', \'month\', \'year\' or a valid ISO date format');
      }
    }
    if (clientIds) {
      parameters.client_ids = clientIds;
    }
    if (projectIds) {
      parameters.project_ids = projectIds;
    }
    if (tagIds) {
      parameters.tag_ids = tagIds;
    }

    var response = this.request('summary', parameters),
        responseCode = response.code,
        responseJson = response.json;

    if (responseCode < 200 || responseCode > 299) {
      // TODO: Implement specific Exception
      var errorInfo = responseJson.error,
          errorMessage = '';
      if (errorInfo) {
        errorMessage = ': \n' + errorInfo.message + ' \n' + errorInfo.tip;
      }
      throw new Error('API Request Error ' + responseCode.toString() + errorMessage);
    }
    return response.json;
  };

  return TogglApi;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_toggl_();
}

