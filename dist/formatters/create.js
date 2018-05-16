'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var isPlainObject = require('is-pojo');
var parseFormToMutation_1 = require('../parseFormToMutation');
function create(values) {
  parseFormToMutation_1.invariant(
    values == null || Array.isArray(values) || isPlainObject(values),
    'Illegal value for create given'
  );
  if (values) {
    return { create: values };
  }
  return undefined;
}
exports.create = create;
