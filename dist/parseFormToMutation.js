'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _merge = require('deepmerge');
var isPlainObject = require('is-pojo');
var merge = _merge.default || _merge;
function parseFormToMutation(values, scheme) {
  var myValues = merge({}, values);
  function applyParentAction(_values, _scheme, parentKey, parentValues) {
    if (!_scheme.__format) {
      return;
    }
    parentValues[parentKey] = _scheme.__format(_values);
  }
  function traverseScheme(_values, _scheme, parentKey, parentValues) {
    Object.keys(_scheme)
      .filter(function(s) {
        return s !== '__format';
      })
      .forEach(function(key) {
        var action = _scheme[key];
        var currentValue = _values[key];
        if (isPlainObject(action)) {
          if (Array.isArray(currentValue)) {
            applyParentAction(currentValue, action, key, _values);
            currentValue.forEach(function(value) {
              return traverseScheme(value, action, key, _values);
            });
          } else if (currentValue) {
            applyParentAction(currentValue, action, key, _values);
            traverseScheme(currentValue, action, key, _values);
          }
        } else if (_values) {
          _values[key] = action(currentValue);
        }
      });
  }
  traverseScheme(myValues, scheme);
  return myValues;
}
exports.parseFormToMutation = parseFormToMutation;
function invariant(condition, message) {
  if (message === void 0) {
    message = 'Illegal state';
  }
  if (!condition) {
    throw new Error('[graphql-form-helpers] ' + message);
  }
}
exports.invariant = invariant;
