import { parseQueryResultsToForm } from '.';

test('parseQueryResultsToForm - basic', () => {
  const input = {
    __typename: 'Card',
    id: 'card-1',
    name: 'Summer season',
    restaurant: { id: 'restaurant-1', __typename: 'Restaurant' },
    categories: [
      {
        id: 'category-1',
        name: 'Burgers',
        items: [],
        __typename: 'CardCategory'
      },
      {
        id: 'category-2',
        name: 'Drinks',
        items: [
          {
            id: 'item-1',
            name: 'Beer',
            subitems: [],
            __typename: 'CardItem'
          }
        ],
        __typename: 'CardCategory'
      }
    ]
  };
  const output = parseQueryResultsToForm(input, {});

  expect(output).toEqual({
    restaurant: { id: 'restaurant-1' },
    categories: [
      { id: 'category-1', items: [], name: 'Burgers' },
      {
        id: 'category-2',
        items: [{ id: 'item-1', name: 'Beer', subitems: [] }],
        name: 'Drinks'
      }
    ],
    name: 'Summer season'
  });
});
