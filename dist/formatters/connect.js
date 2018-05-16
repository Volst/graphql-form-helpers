'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var parseFormToMutation_1 = require('../parseFormToMutation');
function connect(ids) {
  parseFormToMutation_1.invariant(
    ids == null || Array.isArray(ids) || typeof ids === 'string',
    'Illegal value for connect given'
  );
  if (ids) {
    if (Array.isArray(ids)) {
      return {
        connect: ids.map(function(id) {
          return { id: id };
        })
      };
    }
    return { connect: { id: ids } };
  }
  return undefined;
}
exports.connect = connect;
