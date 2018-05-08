import deepExtend from 'deep-extend';
import isPlainObject from 'is-pojo';

export type ActionFn = ((value: any) => any);
export interface Scheme {
  [x: string]: ActionFn | Scheme;
}

export function parseFormToMutation(values: object, scheme: Scheme): object {
  const myValues = deepExtend({}, values);

  function applyParentAction(
    _values: object,
    _scheme: Scheme,
    parentKey?: string,
    parentValues?: object
  ) {
    if (!_scheme.__format) {
      return;
    }
    if (!parentKey || !parentValues) {
      throw new Error('Cannot use `__format` at root-level.');
    }
    parentValues[parentKey] = (_scheme.__format as ActionFn)(_values);
  }

  function traverseScheme(
    _values: object,
    _scheme: Scheme,
    parentKey?: string,
    parentValues?: object
  ) {
    Object.keys(_scheme)
      .filter(s => s !== '__format')
      .forEach(key => {
        const action = _scheme[key];
        const currentValue = _values[key];
        if (isPlainObject(action)) {
          if (Array.isArray(currentValue)) {
            applyParentAction(currentValue, action as Scheme, key, _values);
            currentValue.forEach(value =>
              traverseScheme(value, action as Scheme, key, _values)
            );
          } else {
            applyParentAction(currentValue, action as Scheme, key, _values);
            traverseScheme(currentValue, action as Scheme, key, _values);
          }
        } else {
          _values[key] = (action as ActionFn)(currentValue);
        }
      });
  }

  traverseScheme(myValues, scheme);

  return myValues;
}

// TODO: should this also handle arrays?
export function connect(id?: string) {
  if (id) {
    return { connect: { id } };
  }
  return;
}

export function create(values?: object) {
  if (values) {
    return { create: values };
  }
  return undefined;
}

// We don't call it `upsert`, because Prisma has a mutation named that way and we don't want to imply it is that.
// TODO: doesn't handle non-arrays.
export function save(values?: any[]) {
  if (values) {
    const creates: any[] = [];
    const updates: any[] = [];
    values.forEach(value => {
      const id = value.id;
      delete value.id;
      if (id) {
        updates.push({ where: { id }, data: value });
      } else {
        creates.push(value);
      }
    });
    const output: { create?: any; update?: any } = {};
    if (creates.length > 0) {
      output.create = creates;
    }
    if (updates.length > 0) {
      output.update = updates;
    }
    return output;
  }
  return undefined;
}
