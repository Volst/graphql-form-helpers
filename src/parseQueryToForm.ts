import deepExtend from 'deep-extend';
import isPlainObject from 'is-pojo';

export function parseQueryToForm(data: any, defaults: object): object {
  function removeProps(obj: object, keys: string[]) {
    if (obj instanceof Array) {
      obj.forEach(item => removeProps(item, keys));
    } else if (isPlainObject(obj)) {
      Object.getOwnPropertyNames(obj).forEach(key => {
        if (keys.indexOf(key) !== -1) delete obj[key];
        else removeProps(obj[key], keys);
      });
    }
  }
  if (data) {
    const myData = deepExtend({}, data);
    removeProps(myData, ['__typename']);
    delete myData.id;
    return myData;
  }

  return defaults;
}
