import * as merge from 'deepmerge';
import * as isPlainObject from 'is-pojo';

export type ActionFn = ((value: any) => any);
export interface Scheme {
  [x: string]: ActionFn | Scheme;
}

export function parseFormToMutation(values: object, scheme: Scheme): object {
  const myValues = merge({}, values);

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

export function invariant(
  condition: boolean,
  message: string = 'Illegal state'
) {
  if (!condition) {
    throw new Error(`[graphql-form-helpers] ${message}`);
  }
}
