# Queries in GraphQL

## What is a Query?

In GraphQL, a **query** is how a client **asks for data** from the server.

Unlike REST where you'd use:

```
GET /skills
GET /users/123
```

GraphQL uses one endpoint (`/graphql`) and you send a **query object** that describes exactly what you want.

## 📘 Example Query

```graphql
{
  getAllSkills {
    id
    title
    status
  }
}
```

This is asking:

> "Hey server, give me all the skills and include their `id`, `title`, and `status` fields only."

## Resolvers

Resolvers are the **functions** that run when you request a field.

Example (in Node.js):

```
const resolver = {
    Query: {
        getAllSkills: () => SkillModel.find()
    }
}
```

Each query name in your schema must have a resolver with the same name.

## Query with Parameters

Sometimes, you want to fetch **specific data**, like a skill by ID.

### Schema:

```
type Query {
    getSkill(id: ID!) Skill
}
```

### Example Query:

```
{
    getSkill(id: "abc123") {
        title
        description
    }
}
```

## Summary

- GraphQl queries always begin with `{ ... }`
- You specify exactly which fields you want - no more, no less
- The schema defines available queries
- Resolvers handle the actual logic
- Arguments are passed like function parameters

## Developer Tip

GraphQL queries are **shaped like the response**. You don't need to memorize response formats - just **ask for what you want** and that's exactly what you get.
