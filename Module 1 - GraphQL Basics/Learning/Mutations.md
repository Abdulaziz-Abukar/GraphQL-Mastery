# Mutations in GraphQL

## What is a Mutation?

A **mutation** is used in GraphQL to **change data** - like creating, updating, or deleting records.

In REST, you'd use:

```
POST /skills
PUT /skills/123
DELETE /skills/123
```

In GraphQL, you use a **mutation block** like this:

```graphql
mutation {
  addSkill(
    title: "Learn GraphQL"
    description: "Basics to Advanced"
    status: "Planned"
  ) {
    id
    title
  }
}
```

This sends the data and also tells the server what to return _after the change is made_

## Defining a Mutation in the Schema

```graphql
type Mutation {
  addSkill(title: String!, description: String, status: String): Skill
}
```

This declares a mutation called `addSkill` with three arguments. It returns a `Skill` object.

## Resolver for the Mutation

Example (in Node.js):

```js
const resolver = {
  Mutation: {
    addSkill: async (_, { title, description, status }) => {
      const newSkill = new SkillModel({ title, description, status });
      return await newSkill.save();
    },
  },
};
```

- `_` = placeholder for `parent` (not used here)
- The secodn argument = the input fields
- You save to MongoDB and return the new record

## Example Mutation Query

```graphql
mutation {
  addSkill(
    title: "React"
    description: "Learn the basics"
    status: "In Progress"
  ) {
    id
    title
    status
  }
}
```

You'll get a response like:

```json
{
  "data": {
    "addSkill": {
      "id": "64d...",
      "title": "React",
      "status": "In Progress"
    }
  }
}
```

## Required vs Optional Fields

If a field in the schema is defined as `String!`, you **must** pass it. Otherwise, you'll get an error.

## Summary

- Use `mutation` to change data (add, update, delete)
- Arguments are defined in the schema
- The resolver handles logic and DB saving
- The response is shaped by what you ask for in the mutation

## Pro Tip

Mutations don't just change the data - they're also **queries** in disguise. You can immediately return the updated record or related data, all in one call.
