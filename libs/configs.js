
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

    this._cloneData(envData, true, this._data);
  };

  /**
   * Helper method which creates a clone from the given dataToClone object.
   * Doesn't implement the deep cloning
   * and is not suitable for objects with objects as properties,
   * which configs data is not supposed to be
   * 
   * @param {Object} dataToClone
   * @param {bool} withProtected
   * @param {Object} resultDataObject Optional reference the cloned object
   * @return {Object} The cloned object
   */
  Configs.prototype._cloneData = function(dataToClone, withProtected, resultDataObject) {
    if (typeof resultDataObject === 'undefined') {
      resultDataObject = {};
    }
    for (var key in dataToClone) {
      if (key[0] != '_' || withProtected) {
        resultDataObject[key] = dataToClone[key];
      }
    }
    return resultDataObject;
  };

  /**
   * Returns config value by key.
   * If external properties container is provided and it has the requested property,
   * a value from the container will be returned.
   * Keys starting with '_' are treated as protected and will be not ovewritten by external property.
   * 
   * @param {string} key
   * @return {string|number|bool} The cloned object
   */
  Configs.prototype.getProperty = function(key) {
    if (typeof this._data === 'undefined') {
      this._data = {};
    }
    var envConfigValue = this._data[key],
        propertyValue;
    if (key[0] != '_' && typeof this._propertiesContainer !== 'undefined') {
      propertyValue = this._propertiesContainer.getProperty(key);
    }
    return propertyValue || envConfigValue;
  };

  /**
   * Returns all the configs data as an object.
   * Keys starting with _ are treated as protected and will be not ovewritten by external property.
   * 
   * @return {Object} The cloned object
   */
  Configs.prototype.getProperties = function() {
    var result = {};
    this._cloneData(this._data, true, result);
    if (typeof this._propertiesContainer !== 'undefined') {
      this._cloneData(this._propertiesContainer.getProperties(), false, result);
    }
    return result;
  };

  return Configs;
}

if (typeof module !== 'undefined') {
  module.exports = ask_libs_configs_();
}

