# Scalars in GraphQL

## What are Scalars?

Scalars are the **basic data types** in GraphQL - the building blocks of data. They represent **primitive values**, not objects. Think of them like JavaScript's string, number, boolean, etc.

## Builtin Scalar Types (standard ones)

| GraphQL Type | Description                             | Maps To (JS/Mongoose) |
| ------------ | --------------------------------------- | --------------------- |
| `Int`        | Integer (32-bit signed)                 | `Number`              |
| `Float`      | Decimal (double-precision)              | `Number`              |
| `String`     | Text                                    | `String`              |
| `Boolean`    | true or false                           | `Boolean`             |
| `ID`         | Unique identifier, serialized as String | `String/ObjectId`     |

You've already used many of these:

```graphql
type Skill {
  id: ID!
  title: String!
  status: String
}
```

## Why/When Use Custom Scalars?

GraphQL doesn't come with things like:

- **Date / DateTime**
- **Email**
- **URL**
- **PhoneNumber**
- **Decimal with precision**
- or even **JSON**

These aren't built-in because they're too specific.

> So when your app needs to **validate or parse** a specific format like a date or email address, you define a **Custom Scalar**

## Real Use Case: Custom Date Scalar

Let's say you want to track when a skill was created:

```graphql
type Skill {
  id: ID!
  title: String!
  createdAt: Date
}
```

But GraphQL doesn't know what a `Date` is by default - you'll get an error.

So when we define a **custom scalar** called `Date`:

### Custom Scalar Setup (High-Level Steps)

1. **Define scalar in typeDefs**

```graphql
scalar Date
```

2. **Use it in your types**

```graphql
type Skill {
  id: ID!
  title: String!
  createdAt: Date
}
```

3. **Implement the Date scalar logic**

```js
const { GraphQLScalarType, Kind } = require("graphql");

const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar for ISO-formatted date strings",
  serialize(value) {
    return value.toISOString(); // outgoing data
  },
  parseValue(value) {
    return new Date(value); // incoming data from variables
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // incoming data from inline query
    }
    return null;
  },
});
```

4. **Register it in your resolvers**

```js
const resolvers = {
  Date: DateScalar,
  Query: {
    /* ... */
  },
  Mutation: {
    /* ... */
  },
};
```

Thats it. You can now send/recieve ISO date strings.

## Other Example Custom Scalars You Could Use

- `Email` - valid email format
- `URL` - valid HTTP/HTTPS URLs
- `NonEmptyString` - string that's not blank
- `PositiveInt` - integer > 0
- `JSON` - flexible nested object structure

## Real World Benefit

Custom scalars allow you to enforce **tight validation** at the GraphQL layer - before your app or DB even gets the request. They act like "smart primitives"

This is really useful when:

- You're working on public APIs
- or building forms that must accept strict formats
- or for writing clean, strongly typed frontend code with confidence

## Popular GraphQL Custom Scalars - and Their Mongoose Equivalents

| GraphQL Scalar | Description                              | GraphQL Input Format                     | Mongoose Equivalent                      | Stored As    |
| -------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------ |
| `Date`         | ISO 8601 date-time string                | `"2025-07-16T15:00:00Z"`                 | `type: Date`                             | BSON Date    |
| `Email`        | Valid email address                      | `"user@example.com"`                     | `type: String`, with regex               | String       |
| `URL`          | Valid web address                        | `"https://google.com"`                   | `type: String`, with regex               | String       |
| `PhoneNumber`  | Valid phone number (E.164 or local)      | `"+1234567890"`                          | `type: String`, with regex               | String       |
| `JSON`         | Arbitrary JSON object                    | `{ key: "value" }`                       | `type: mongoose.Mixed`                   | Mixed Object |
| `UUID`         | Universally Unique Identifier (v4, etc.) | `"f47ac10b-58cc-4372-a567-0e02b2c3d479"` | `type: String`, with regex               | String       |
| `BigInt`       | Large integers (beyond JS safe int)      | `"1234567890123456789"`                  | `type: mongoose.Schema.Types.Decimal128` | Decimal128   |
| `IPAddress`    | IPv4 or IPv6                             | `"192.168.0.1"`                          | `type: String`, with regex               | String       |
