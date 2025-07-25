# ENUMS in GraphQL - Context, Purpose

## What is Enum?

**Enum** stands for **enumeration** - a special GraphQL type that limits a field to a set of allowed values.

Instead of allowing **any** string, an enum restricts input to only **specific values** you define ahead of time.

## Why Use Enums?

Let's say you have this:

```graphql
input SkillInput {
  title: String!
  status: String
}
```

That `status` can be anything - `"active"`, `"inactive"`, `"delete"`, `"banana`". `"tears"` - no validation.

that's a **data integrity nightmare**

Now here's the enum version:

```graphql
enum SkillStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}
```

And you plug it into:

```graphql
input SkillInput {
  title: String!
  status: SkillStatus
}
```

Now GraphQL **forces** you to use only `ACTIVE`, `INACTIVE`, or `ARCHIVED`. Anything else throws a validation error **before** hitting your resolver.

## Benefits

| Feature          | Enum Behavior                                                        |
| ---------------- | -------------------------------------------------------------------- |
| Validation       | Enforced by GraphQL engine before resolver runs ✅                   |
| Autocompletion   | Works beautifully in tools like Apollo Studio, GraphQL Playground ✅ |
| Code Readability | Makes your schema self-documenting ✅                                |
| Safety           | Prevents weird edge cases like typos ✅                              |
