export function create(values?: object) {
  if (values) {
    return { create: values };
  }
  return undefined;
}
