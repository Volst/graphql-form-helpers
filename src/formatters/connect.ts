export function connect(ids?: string | string[]) {
  if (ids) {
    if (Array.isArray(ids)) {
      return { connect: ids.map(id => ({ id })) };
    }
    return { connect: { id: ids } };
  }
  return undefined;
}
