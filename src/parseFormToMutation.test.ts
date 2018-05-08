import { create, connect, save, parseFormToMutation } from '.';

test('parseFormToMutation - basic', () => {
  const values = {
    name: 'Summer season',
    organization: 'organization-1'
  };
  const scheme = {
    organization: connect
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    name: 'Summer season',
    organization: { connect: { id: 'organization-1' } }
  });
});

test('parseFormToMutation - advanced', () => {
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
            name: 'Beer',
            toppings: [
              {
                name: 'Lemon'
              }
            ]
          }
        ]
      }
    ]
  };
  const scheme = {
    categories: {
      __format: create,
      items: {
        __format: create,
        toppings: create
      }
    }
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    categories: {
      create: [
        {
          id: 'category-1',
          name: 'Drinks',
          items: {
            create: [
              {
                name: 'Coca cola'
              },
              {
                name: 'Beer',
                toppings: {
                  create: [{ name: 'Lemon' }]
                }
              }
            ]
          }
        }
      ]
    }
  });
});

test('parseFormToMutation - save array relations', () => {
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

test('parseFormToMutation - save object relations', () => {
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
        where: { id: 'restaurant-1' },
        data: {
          name: 'Red Wheelbarrow',
          organization: { create: { name: 'fsociety' } }
        }
      }
    }
  });
});

test('parseFormToMutation - should create new object', () => {
  const values = {
    name: 'Summer season',
    categories: [{ id: 'category-1' }]
  };
  const scheme = {
    categories: create
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).not.toBe(values);
  expect(values.categories[0].id).toBe('category-1');
});

test('parseFormToMutation - formatting should work without a __format present', () => {
  const values = {
    categories: [
      {
        items: [{ name: 'Beer' }]
      }
    ]
  };
  const scheme = {
    categories: {
      items: save
    }
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    categories: [{ items: { create: [{ name: 'Beer' }] } }]
  });
});

test('parseFormToMutation - should handle empty cases correctly', () => {
  const values = {
    restaurant: '',
    organization: null,
    categories: null
  };
  const scheme = {
    restaurant: connect,
    organization: create,
    categories: save
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    restaurant: undefined,
    organization: undefined,
    categories: undefined
  });
});

test('parseFormToMutation - connect should accept arrays', () => {
  const values = {
    categories: ['category-1', 'category-2']
  };
  const scheme = {
    categories: connect
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    categories: { connect: [{ id: 'category-1' }, { id: 'category-2' }] }
  });
});
