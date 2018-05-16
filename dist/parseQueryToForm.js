'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _merge = require('deepmerge');
var isPlainObject = require('is-pojo');
var merge = _merge.default || _merge;
function parseQueryToForm(data, defaults) {
  function removeProps(obj, keys) {
    if (obj instanceof Array) {
      obj.forEach(function(item) {
        return removeProps(item, keys);
      });
    } else if (isPlainObject(obj)) {
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        if (keys.indexOf(key) !== -1) delete obj[key];
        else removeProps(obj[key], keys);
      });
    }
  }
  if (data) {
    var myData = merge({}, data);
    removeProps(myData, ['__typename']);
    delete myData.id;
    return myData;
  }
  return defaults || {};
}
exports.parseQueryToForm = parseQueryToForm;
