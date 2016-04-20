
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_configs_() {
  /**
   * @constructor
   * 
   * @param {Object} defaultData Optional default configs data, wich can be
   *                             overwritten by environment specific data 
   */
  var Configs = function(defaultData) {
    var envData = ask_('environments/configs') || {},
        defaultData = defaultData || {};
    this._data = {};

    this._cloneData(defaultData, this._data);
    this._cloneData(envData, this._data);
  };

  /**
   * Helper method which creates a clone from the given dataToClone object.
   * Doesn't implement the deep cloning
   * and is not suitable for objects with objects as properties,
   * which configs data is not supposed to be
   * 
   * @param {Object} dataToClone
   * @param {Object} resultDataObject Optional reference the cloned object
   * @return {Object} The cloned object
   */
  Configs.prototype._cloneData = function(dataToClone, resultDataObject) {
    if (typeof resultDataObject === 'undefined') {
      resultDataObject = {};
    }
    for (key in dataToClone) {
      resultDataObject[key] = dataToClone[key];
    }
    return resultDataObject;
  };

  /**
   * Returns config value by key or
   * all the configs data as an object if no key provided
   * 
   * @param {string} key
   * @return {Object|string|numger|bool} The cloned object
   */
  Configs.prototype.get = function(key) {
    if (typeof this._data === 'undefined') {
      this._data = {};
    }
    if (typeof key === 'undefined') {
      return this._cloneData(this._data);
    }
    return this._data[key];
  };

  return Configs;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_configs_();
}

