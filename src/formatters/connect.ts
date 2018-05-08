import { invariant } from '../parseFormToMutation';

export function connect(ids?: string | string[] | null) {
  invariant(
    ids == null || Array.isArray(ids) || typeof ids === 'string',
    'Illegal value for connect given'
  );
  if (ids) {
    if (Array.isArray(ids)) {
      return { connect: ids.map(id => ({ id })) };
    }
    return { connect: { id: ids } };
  }
  return undefined;
}
