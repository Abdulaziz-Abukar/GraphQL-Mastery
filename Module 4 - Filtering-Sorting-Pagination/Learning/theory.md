# Module Overview

We'll break it down into 3 parts.

### 1. Filtering

Retrieve specific items based on arguments (e.g. status, skillId)

### 2. Sorting

Control the order of results (e.g. newest first, alphabetical, etc)

### 3. Pagination

Load a limited number of results at a time - useful for performance!

## Filtering theory

In REST, you'd do something like:

```bash
GET /skills?status=InProgress
```

in GraphQL, we achieve this with **arguments** on our query:

```graphql
query {
    getSkillByStatus(status: "InProgress) {
        title
        status
    }
}
```

So we'll add a **custom query** with a `status` argument.

## Sorting Theory

### What is Sorting?

Sorting means arranging results in a certain order - for example:

- A to Z by title
- Newest to oldest
- Reverse Alphabetical, etc

### In MongoDB we use `.sort()`:

```js
Skill.find().sort({ title: 1 }); // ascending (A-Z)
Skill.find().sort({ title: -1 }); // descending (Z-A)
```

### Lets add sorting to Skills

We'll let the user decide:

- Which field to sort by (e.g. `title`)
- What direction (`asc` or `desc`)

## Pagniation In GraphQL

### Why We Need Pagination

Imagine you have 10,000 skills or modules... do you really want to send all of them at once to the client?

Pagniation solves this by letting the client **request data in chunks**, improving performance and user experience.

### Types of Pagination

We'll focus on the most common and easiest to implement: **Offset-based Pagination**

## Theory

We use two parameters:

- `limit`: how many items to return
- `offset`: how many items to skip

Example:

```graphql
query {
  getAllSkillsPaginated(limit: 5, offset: 10) {
    title
    status
  }
}
```

this would:

- skip the first 10 skills
- return the next 5
