import * as isPlainObject from 'is-pojo';
import { invariant } from '../parseFormToMutation';

export interface IValues {
  id?: string;
  [key: string]: any;
}

// We don't call it `upsert`, because Prisma has a mutation named that way and we don't want to imply it is that.
export function save(values?: IValues[] | IValues | null) {
  invariant(
    values == null || Array.isArray(values) || isPlainObject(values),
    'Illegal value for save given'
  );

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
