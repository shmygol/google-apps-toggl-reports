
/**
 * Wrapper for libs/ask
 * @return {Object}
 */
function ask_libs_configs_() {
  /**
   * @constructor
   * 
   * @param {Object} externalPropertiesContainer Optional container with method getProperty,
   *                                             for example Google Properties Service
   */
  var Configs = function(externalPropertiesContainer) {
    this._data = {};
    this._propertiesContainer = externalPropertiesContainer;

    var envData = ask_('environments/configs') || {};

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
    for (var key in dataToClone) {
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
    var envConfigValue = this._data[key],
        propertyValue;
    if (key[0] != '_' && typeof this._propertiesContainer !== 'undefined') {
      propertyValue = this._propertiesContainer.getProperty(key);
    }
    return propertyValue || envConfigValue;
  };

  return Configs;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_configs_();
}

