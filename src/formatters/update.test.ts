import { parseFormToMutation, update } from '..';

test('update - handle empty case correctly', () => {
  expect(update(null)).toEqual(undefined);
});

test('update - accept object', () => {
  const values = {
    restaurant: {
      id: 'Beer-id',
      name: 'Red Wheelbarrow'
    }
  };
  const scheme = {
    restaurant: update
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    restaurant: {
      update: {
        name: 'Red Wheelbarrow'
      }
    }
  });
});

test('update - create if no id', () => {
  const values = {
    restaurant: {
      name: 'Red Wheelbarrow'
    }
  };
  const scheme = {
    restaurant: update
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    restaurant: {
      create: {
        name: 'Red Wheelbarrow'
      }
    }
  });
});

test('update - accept array', () => {
  const values = {
    categories: [
      {
        id: 'category-1',
        name: 'Drinks',
        items: [
          {
            name: 'Coca cola'
          },
          {
            id: 'beer-1',
            name: 'Beer'
          }
        ]
      }
    ]
  };
  const scheme = {
    categories: {
      __format: update,
      items: update
    }
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    categories: {
      update: [
        {
          where: { id: 'category-1' },
          data: {
            name: 'Drinks',
            items: {
              create: [
                {
                  name: 'Coca cola'
                }
              ],
              update: [
                {
                  where: { id: 'beer-1' },
                  data: {
                    name: 'Beer'
                  }
                }
              ]
            }
          }
        }
      ]
    }
  });
});
