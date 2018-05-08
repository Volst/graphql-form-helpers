import { connect } from '..';

test('connect - handle empty case correctly', () => {
  expect(connect('')).toEqual(undefined);
});

test('connect - accept arrays', () => {
  const values = ['category-1', 'category-2'];
  const formatted = connect(values);

  expect(formatted).toEqual({
    connect: [{ id: 'category-1' }, { id: 'category-2' }]
  });
});

test('connect - accept string', () => {
  const formatted = connect('category-1');

  expect(formatted).toEqual({
    connect: { id: 'category-1' }
  });
});

test('save - throw error on invalid value', () => {
  expect(() => connect({} as any)).toThrow('Illegal value for connect given');
});
