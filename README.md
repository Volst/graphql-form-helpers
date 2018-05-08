# GraphQL Form Helpers

[![codecov](https://codecov.io/gh/Volst/graphql-form-helpers/branch/master/graph/badge.svg)](https://codecov.io/gh/Volst/graphql-form-helpers)

A light-weight (1kb) package for dealing with complicated forms that have nested data and use GraphQL.

We use it in combination with [Formik](https://github.com/jaredpalmer/formik), [Apollo Client](https://github.com/apollographql/apollo-client) and [Prisma](https://www.prisma.io/), but it is not specific to one of those.

**Features:**

* Convert data from a form to a GraphQL mutation ([docs](#from-form-to-mutation))
* Convert data from a GraphQL query to suitable form data ([docs](#from-query-to-form))

# Motivation

When dealing with GraphQL you often have to write boilerplate code to load the fetched data in a form and some code so the form data becomes a correct mutation. It might not be so much boilerplate if you have a basic form, but it can quickly become a lot for more complicated forms with nested data. This package intents to reduce that boilerplate code.

# Install

Install with Yarn or npm:

```
yarn add @volst/graphql-form-helpers
npm i @volst/graphql-form-helpers
```

# Usage

## From form to mutation

Imagine you have a form which, when the `onSubmit` event is called, outputs this data:

```js
const data = {
  restaurant: 'kjrrqxy08001309',
  categories: [
    {
      id: 'dgfrqxfaf000v',
      name: 'Drinks'
    },
    {
      name: 'Burgers'
    }
  ]
};
```

First I'll explain what's going on here:

* The `restaurant` field refers to an `ID`, so it already exists and should be connected to the given restaurant.
* The `categories` field is an array of categories, the first one already exists (since it has an `id` field), and the second one doesn't exist yet.

Now we need to write a mutation which saves this data to your backend. Your GraphQL scheme probably looks different from this `data` scheme. For example, if you use [Prisma](https://www.prisma.io/), your mutation data would need to look like this:

```js
const graphqlData = {
  restaurant: { connect: { id: 'kjrrqxy08001309' } },
  categories: {
    create: [
      {
        name: 'Burgers'
      }
    ],
    update: [
      {
        where: { id: 'dgfrqxfaf000v' },
        data: { name: 'Drinks' }
      }
    ]
  }
};
```

As you can see this is a lot different to the data we have above. You could write some custom code everytime to make it look the same, but I'm already sweating even thinking about that. That's where `parseFormToMutation` comes in:

```js
import {
  create,
  connect,
  save,
  parseFormToMutation
} from '@volst/graphql-form-helpers';

const scheme = {
  restaurant: connect,
  categories: save
};

const graphqlData = parseFormToMutation(values, scheme);
```

But what if you have nested data? Imagine that a category can have items and subitems, the schema would look like this:

```js
const scheme = {
  restaurant: connect,
  categories: {
    __format: save,
    items: {
      __format: save,
      subitems: save
    }
  }
};
```

> The `__format` property applies the formatter (`save`) on the parent property.

As you can see, it is now very easy to mutate nested data, even if it's an array of objects.

Currently there are three formatters out of the box:

* `connect` - wraps an object around a `connect` mutation.
* `create` - wraps an object around a `create` mutation.
* `save` - wraps an object around an `update` mutation if there is an `id` field, or `create` if there is none.

> **Psst, want to see a [real-world example](https://github.com/Volst/new-food-order/blob/64a8ccd7c7ffd437016d88d1fe394bb53739e636/frontend/src/screen/RestaurantCardEdit.tsx#L55-L80)?**

### Writing a custom formatter

Writing a custom formatter is very easy!

```js
function decimalToFloat(value: string | number) {
  return parseFloat(value);
}

const scheme = {
  items: {
    price: decimalToFloat // In this example you could even pass `parseFloat` directly
  }
};
```

## From query to form

When performing a GraphQL query, you can't just load the results of the query directly into a form. The results contain some extra info which is not relevant to the form, like `__typename` (Apollo Client adds this field automatically for caching purposes). Stripping this field recursively is painful. Also, the top-level `id` is not relevant since you already have that `id`.

`parseQueryToForm` removes this irrelevant data for you. An example with Formik:

```jsx
import { Query } from 'react-apollo';
import { Formik } from 'formik';
import { parseQueryToForm } from '@volst/graphql-form-helpers';

const GET_RESTAURANT = gql`
  query($id: ID!) {
    restaurant(where: { id: $id }) {
      id
      name
    }
  }
`;

...

<Query query={GET_RESTAURANT} variables={{ id }}>
  {({ data }) => (
    <Formik
      initialValues={parseQueryToForm(data.restaurant, {})}
    />
  )}
</Query>
```

> **Checkout this [real-world example](https://github.com/Volst/new-food-order/blob/64a8ccd7c7ffd437016d88d1fe394bb53739e636/frontend/src/screen/RestaurantCardEdit.tsx#L55-L80)**

# Contributing

This project is still in early phases. Please don't hesistate to create an issue with feedback or send a PR! See [contributing guide](./CONTRIBUTING.md) for more info.
