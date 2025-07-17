# Schemas and Types in GraphQL

## 🧠 What is a Schema?

A **schema** is the backbone of a GraphQL server.

It tells the server:

- What data types are available
- What queries and mutations are possible
- What fields each type has

Think of it like the blueprint or contract for your API.

---

## 🔤 Scalar Types

These are the **basic building blocks** in GraphQL — like primitive types in other languages.

| GraphQL Type | Description                                   |
| ------------ | --------------------------------------------- |
| `Int`        | Integer (e.g. 1, 2, -5)                       |
| `Float`      | Decimal number (e.g. 3.14)                    |
| `String`     | Text (e.g. "Hello")                           |
| `Boolean`    | True or false                                 |
| `ID`         | Unique identifier (often used for object IDs) |

---

## 📦 Object Types

You define your data shape using **object types**.

```graphql
type Skill {
  id: ID!
  title: String!
  description: String
  status: String
}
```

### Syntax Breakdown

- `type Skill` defines a new object type named `Skill`
- `ID!` means it's a required unique identifier
- `String` means text
- `String!` means required text
- Optional fields (no `!`) can be `null`

## The Root Types

GraphQL has 3 root types:

- `Query`: for fetching data (read)
- `Mutation`: for changing data (write)
- `Subscription`: for real-time updates (advanced, later)

**Example:**

```
type Query {
  getAllSkills: [Skill]
  getSkill(id: ID!): Skill
}

type Mutation {
  addSkill(title: String!, description: String, status: String): Skill
}
```

## Type Arrays

If you want to return a list of items, wrap the type in square brackets:

```
getAllSkills: [Skill]
```

This says: "Return an array of `Skill` objects."

## Required vs Optional Fields

| Syntax    | Meaning                            |
| --------- | ---------------------------------- |
| `String!` | Required string (must be provided) |
| `String`  | Optional string (can be null)      |

## Summary

- A **schema** defines all available types and operations
- GraphQL has scalar types (`String`, `Int`, `Boolean`, etc) and object types (custom data structures).
- Use `Query` for reading and `Mutation` for writing
- Square brackets `[]` define arrays of a type.
- `!` means the field is required

## Developer Tip:

Your schema is like your API's **public interface** - it should be clean, predictable, and easy to read.
