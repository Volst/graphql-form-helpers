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
