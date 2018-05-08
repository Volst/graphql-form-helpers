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
