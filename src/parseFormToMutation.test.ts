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
    restaurant: { name: 'Red Wheelbarrow' },
    organization: { id: 'org-1', name: 'fsociety' }
  };
  const scheme = {
    restaurant: save,
    organization: save
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    restaurant: { create: { name: 'Red Wheelbarrow' } },
    organization: {
      update: { where: { id: 'org-1' }, data: { name: 'fsociety' } }
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
