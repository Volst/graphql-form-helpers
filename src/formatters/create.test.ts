import { create } from '..';

test('create - handle empty case correctly', () => {
  expect(create(undefined)).toEqual(undefined);
});

test('connect - accept object', () => {
  const formatted = create({ name: 'Drinks' });

  expect(formatted).toEqual({
    create: { name: 'Drinks' }
  });
});

test('save - throw error on invalid value', () => {
  expect(() => create(0 as any)).toThrow('Illegal value for create given');
});
