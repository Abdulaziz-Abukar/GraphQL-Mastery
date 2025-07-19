# 🧪 Exercise 3: Create a Mutation to Add Skills to MongoDB

## 🎯 Goal:

Write a GraphQL mutation that allows clients to add new skills to the database.

---

## 🧱 What You’ll Build

You’ll be able to run this from Apollo Studio:

```graphql
mutation {
  addSkill(title: "Learn GraphQL", status: "Planned") {
    id
    title
    status
  }
}
```

and get this back:

```graphql
{
  "data": {
    "addSkill": {
      "id": "609e...",
      "title": "Learn GraphQL",
      "status": "Planned"
    }
  }
}
```
