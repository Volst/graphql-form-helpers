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

test('parseFormToMutation - Nested Scheme with null root', () => {
  const values = {
    name: 'Summer season',
    organization: null
  };
  const scheme = {
    organization: {
      __format: create,
      address: create
    }
  };
  const formatted = parseFormToMutation(values, scheme);

  expect(formatted).toEqual({
    name: 'Summer season',
    organization: null
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
