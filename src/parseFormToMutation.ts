import * as deepExtend from 'deep-extend';
import * as isPlainObject from 'is-pojo';

export type ActionFn = ((value: any) => any);
export interface Scheme {
  [x: string]: ActionFn | Scheme;
}

export function parseFormToMutation(values: object, scheme: Scheme): object {
  const myValues = deepExtend({}, values);

  function applyParentAction(
    _values: object,
    _scheme: Scheme,
    parentKey: string,
    parentValues: object
  ) {
    if (!_scheme.__format) {
      return;
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

export function connect(ids?: string | string[]) {
  if (ids) {
    if (Array.isArray(ids)) {
      return { connect: ids.map(id => ({ id })) };
    }
    return { connect: { id: ids } };
  }
  return undefined;
}

export function create(values?: object) {
  if (values) {
    return { create: values };
  }
  return undefined;
}

// We don't call it `upsert`, because Prisma has a mutation named that way and we don't want to imply it is that.
export function save(values?: any[] | any) {
  if (values) {
    const output: { create?: any; update?: any } = {};
    const creates: any[] = [];
    const updates: any[] = [];
    if (Array.isArray(values)) {
      values.forEach(value => {
        const id = value.id;
        delete value.id;
        if (id) {
          updates.push({ where: { id }, data: value });
        } else {
          creates.push(value);
        }
      });
      if (creates.length > 0) {
        output.create = creates;
      }
      if (updates.length > 0) {
        output.update = updates;
      }
    } else {
      // Assuming `values` is a plain object
      const id = values.id;
      delete values.id;
      if (id) {
        output.update = { where: { id }, data: values };
      } else {
        output.create = values;
      }
    }
    return output;
  }
  return undefined;
}
