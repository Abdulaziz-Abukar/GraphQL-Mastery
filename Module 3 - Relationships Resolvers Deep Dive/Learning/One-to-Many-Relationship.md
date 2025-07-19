# Lesson 1 - One-to-Many Relationships

## What is a One-to-Many Relationship?

a **One-to-Many** relationship means:

- One document in **Collection A** can be linked to **many documents** in **Collection B**.
- for example:  
  One `Skill` can have **many** `Modules`

this is super common in apps:

- One `User` -> many `Posts`
- One `Course` -> many `Lessons`
- One `Skill` -> many `Modules`

In MongoDB with Mongoose, we usually model it in two ways:

- **Embedding** the `Module` directly inside `Skill` (not flexible for growing systems)
- **Referencing** the `Module` IDs inside the `Skill` (using `ObjectId`)

We'll use **referencing**

### Example: Skill has many Modules

**New Schema: Module**

```js
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
});

module.exports = mongoose.model("Model", moduleSchema);
```

**Updated Skill Schema:**

```js
const skillSchema = new mongoose.Schema({
  title: String,
  status: String,
  // modules fields is optional; we can use reverse querying instead
});
```

## GraphQL Type Changes

you'll add a `Module` type and a relationship from `Skill` -> `Module[]`.

```graphql
type Module {
  id: ID!
  title: String!
  description: String
  skill: Skill
}

extend type Skill {
  modules: [Modules]
}
```

## Resolver Logic

We'll write a resolver on `Skill.modules` that:

- Finds all modules where `skill === parentSkill._id`
