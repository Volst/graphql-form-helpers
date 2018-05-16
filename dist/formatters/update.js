'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var isPlainObject = require('is-pojo');
var parseFormToMutation_1 = require('../parseFormToMutation');
// We don't call it `upsert`, because Prisma has a mutation named that way and we don't want to imply it is that.
function update(values) {
  parseFormToMutation_1.invariant(
    values == null || Array.isArray(values) || isPlainObject(values),
    'Illegal value for update given'
  );
  if (values) {
    var output = {};
    var creates_1 = [];
    var updates_1 = [];
    if (Array.isArray(values)) {
      values.forEach(function(value) {
        var id = value.id;
        delete value.id;
        if (id) {
          updates_1.push({ where: { id: id }, data: value });
        } else {
          creates_1.push(value);
        }
      });
      if (creates_1.length > 0) {
        output.create = creates_1;
      }
      if (updates_1.length > 0) {
        output.update = updates_1;
      }
    } else {
      // Assuming `values` is a plain object
      var id = values.id;
      delete values.id;
      if (id) {
        output.update = values;
      } else {
        output.create = values;
      }
    }
    return output;
  }
  return undefined;
}
exports.update = update;
