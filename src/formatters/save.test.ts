import { parseFormToMutation, save } from '..';

test('save - handle empty case correctly', () => {
  expect(save(null)).toEqual(undefined);
});

test('save - accept object', () => {
  const values = {
    restaurant: {
      id: 'restaurant-1',
      name: 'Red Wheelbarrow',
      organization: { name: 'fsociety' }
    }
  };
  const scheme = {
    restaurant: {
      __format: save,
      organization: save
    }
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    restaurant: {
      update: {
        name: 'Red Wheelbarrow',
        organization: { create: { name: 'fsociety' } }
      }
    }
  });
});

test('save - accept array', () => {
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
      __format: save,
      items: save
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

test('save - throw error on invalid value', () => {
  expect(() => save(1 as any)).toThrow('Illegal value for save given');
});
