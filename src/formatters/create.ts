import * as isPlainObject from 'is-pojo';
import { invariant } from '../parseFormToMutation';

export function create(values?: object | object[] | null) {
  invariant(
    values == null || Array.isArray(values) || isPlainObject(values),
    'Illegal value for create given'
  );
  if (values) {
    return { create: values };
  }
  return undefined;
}
