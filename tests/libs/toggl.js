var appRoot = require('app-root-path'),
    ask = require(appRoot + '/libs/ask.js'),
    chai = require('chai'),
    expect = chai.expect;

/*
 * Tests
 */
var togglApi, UrlFetchAppMock, UtilitiesMock;
suite('libs/toggl', function() {
  var urlFetchAppSecondArgument = {
    method: 'get',
    headers: {
      Authorization: "Basic 64coded_token"
    }
  };

  setup(function() {
    var TogglApi = ask('libs/toggl');

    UrlFetchAppMock = {};

    UtilitiesMock = {
      base64Encode: function(stringArg1) {
        var defaultResult,
            valueMap = {'token:api_token': '64coded_token'};
        return valueMap[stringArg1] || defaultResult; 
      },
      jsonParse: function(jsonString) {
        return JSON.parse(jsonString);
      },
    };

    global.UrlFetchApp = undefined;
    global.Utilities = UtilitiesMock;

    togglApi = new TogglApi(
      'token',
      {user_agent: 'trilliput', workspace_id: '96143'});
  });

  suite('#request', function() {
    test('should call UrlFetchAppMock.fetch() with summary url without additional parameters', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.request('summary', {});

      expect(actualResult).to.deep.equal({
        text: '{"data": ["foo0", "foo1"]}',
        json: {data: ['foo0', 'foo1']},
        code: 202,
      });
    });

    test('should call UrlFetchAppMock.fetch() with summary url and given GET parameters', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-03&until=2016-04-03&client_ids=3&project_ids=4%2C5&tag_ids=100%2C101%2C102&group=projects&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.request('summary', {
        since: '2016-03-03', 
        until: '2016-04-03',
        client_ids: '3',
        project_ids: '4,5',
        tag_ids: '100,101,102',
        group: 'projects',
      });

      expect(actualResult).to.deep.equal({
        text: '{"data": ["foo0", "foo1"]}',
        json: {data: ['foo0', 'foo1']},
        code: 202,
      });
    });

    test('should call UrlFetchAppMock.fetch() with given workspace_id instead of the one from standard parameters', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=1000000&' +
            'since=2016-03-03&until=2016-04-03&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.request('summary', {
        since: '2016-03-03', 
        until: '2016-04-03',
        workspace_id: '1000000',
      });

      expect(actualResult).to.deep.equal({
        text: '{"data": ["foo0", "foo1"]}',
        json: {data: ['foo0', 'foo1']},
        code: 202,
      });
    });

    test('should return a hash with information about an error', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-03&until=2016-04-03&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 500;
            },
            getContentText: function() {
              return '{"error": {"message": "foo", "code": 500}}';
            },
          };
        }
      };

      var actualResult = togglApi.request('summary', {
        since: '2016-03-03', 
        until: '2016-04-03',
      });

      expect(actualResult).to.deep.equal({
        text: '{"error": {"message": "foo", "code": 500}}',
        json: {error: {message: 'foo', 'code': 500}},
        code: 500,
      });
    });

    test('should throw TypeError', function() {
      expect(togglApi.request.bind(togglApi, 'all', {})).to.throw(TypeError, 'Request type all doesn\'t exist');
    });
  });

  suite('#setApiToken', function() {
    test('should set the API token as a given string without validation', function() {
      togglApi.setApiToken('New API token');
      expect(togglApi._apiToken).to.equal('New API token');
    });

    test('should set the API token as undefined', function() {
      togglApi.setApiToken(undefined);
      expect(togglApi._ApiToken).to.be.a('undefined');
    });
  });

  suite('#setStandardParameters', function() {
    test('should set the standard parameters as a given hash object', function() {
      togglApi.setStandardParameters({foo: 'foo'});
      expect(togglApi._standardParameters).to.deep.equal({foo: 'foo'});
    });

    test('should set the standard parameters as undefined', function() {
      togglApi.setStandardParameters(undefined);
      expect(togglApi._standardParameters).to.be.a('undefined');
    });
  });

  suite('#summary', function() {
    test('should call UrlFetchAppMock.fetch() with summary url without additional parameters', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary();

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should call UrlFetchAppMock.fetch() with unchanged arguments as parameters', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'group=projects&project_ids=4%2C5&since=2016-03-03&until=2016-04-03&client_ids=3&tag_ids=100%2C101%2C102&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary('2016-03-03', '2016-04-03', '3', '4,5', '100,101,102', {group: 'projects', project_ids: '1,2'});

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should call UrlFetchAppMock.fetch() with until argument as a date parameter, if until is "week"', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-30&until=2016-04-05&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary('2016-03-30', 'week');

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should call UrlFetchAppMock.fetch() with until argument as a date parameter, if until is "month"', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-30&until=2016-04-29&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary('2016-03-30', 'month');

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should call UrlFetchAppMock.fetch() with until argument as a date parameter, if until is "month" and since is 2016-03-31', function() {
      // TODO: test with 2016-03-31
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-31&until=2016-04-30&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary('2016-03-31', 'month');

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should call UrlFetchAppMock.fetch() with until argument as a date parameter, if until is "year"', function() {
      var expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-30&until=2017-03-29&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 202;
            },
            getContentText: function() {
              return '{"data": ["foo0", "foo1"]}';
            },
          };
        }
      };

      var actualResult = togglApi.summary('2016-03-30', 'year');

      expect(actualResult).to.deep.equal({data: ['foo0', 'foo1']});
    });

    test('should throw an exception if since argument is not valid string', function() {
      expect(togglApi.summary.bind(togglApi, '03/01/2016', '2016-03-03')).to.throw(TypeError, 'Since date \'03/01/2016\' is invalid. Must be a valid ISO date string');
    });

    test('should throw an exception if until argument is not valid string', function() {
      expect(togglApi.summary.bind(togglApi, '2016-03-03', 'soon')).to.throw(TypeError, 'Until date \'soon\' is invalid. Must be \'week\', \'month\', \'year\' or a valid ISO date string');
    });

    test('should throw an exception with the text from the response', function() {
      var methodToTest = togglApi.summary.bind(togglApi, '2016-03-03', '2016-04-05'),
          expectedFetchArg2 = urlFetchAppSecondArgument,
          expectedFetchArg1 =
            'https://www.toggl.com/reports/api/v2/summary.json?user_agent=trilliput&workspace_id=96143&' +
            'since=2016-03-03&until=2016-04-05&';

      global.UrlFetchApp = {
        fetch: function(arg1, arg2) {
          expect(arg1).to.equal(expectedFetchArg1);
          expect(arg2).to.deep.equal(urlFetchAppSecondArgument);

          return responseMock = {
            getResponseCode: function() {
              return 500;
            },
            getContentText: function() {
              return '{"error": {"message": "Internal Error", "tip": "Contact Us", "code": 500}}';
            },
          };
        }
      };

      expect(methodToTest).to.throw(Error, 'API Request Error 500: \nInternal Error \nContact Us');

    });
  });

});

