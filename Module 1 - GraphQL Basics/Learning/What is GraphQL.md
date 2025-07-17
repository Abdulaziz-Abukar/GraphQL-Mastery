# What is GraphQL?

## 🧠 Definition

**GraphQL** is a query language and runtime for APIs that lets clients ask for exactly the data they need — nothing more, nothing less.

It was created by Facebook in 2012 and open-sourced in 2015.

---

## 🔍 GraphQL vs REST

| Feature        | REST                                | GraphQL                             |
| -------------- | ----------------------------------- | ----------------------------------- |
| Endpoints      | Multiple (`/users`, `/posts`, etc.) | Single (`/graphql`)                 |
| Over-fetching  | Common (gets unnecessary fields)    | Never (asks only for what you need) |
| Under-fetching | Common (need multiple requests)     | Never (combine in one query)        |
| Versioning     | Often required (v1, v2...)          | Usually not needed                  |
| Querying       | Fixed responses                     | Flexible, client-defined queries    |

---

## 💡 Key Concepts

### 1. **Schema**

Defines the shape of your data — like a contract between client and server.

```graphql
type Book {
  id: ID!
  title: String!
  author: String!
}
```

### 2. **Query**

Used to _get_ data from the server

```
{
  books {
    title
    author
  }
}
```

### 3. **Mutation**

Used to _change_ data on the server

```
mutation {
  addBook(title: "1984", author: "George Orwell") {
    id
    title
  }
}
```

### 4. **Resolvers**

Functions that tell GraphQL how to get the data

```
const resolvers = {
  Query: {
    books: () => BookModel.find()
  },
  Mutation: {
    addBook: (_, { title, author }) => BookModel.create({ title, author })
  }
}

```

## How it works

1. Client sends a request to `/graphql` with a query
2. The server uses the schema to validate the query
3. The appropriate resolver is run.
4. The response is sent back - **Only with requested data**

## Summary

- GraphQL is **delcarative** - the client asks for exactly what it wants.
- It reduces API complexity by using a **single endpoint**
- It's schema-driven and **strongly typed**
- GraphQL is great for frontend and mobile apps that need flexibility and efficiency

## Pro Tip

Think of GraphQL like a **buffet** - the client chooses only what it wants to eat. REST is like a **set meal** = it comes with everything, whether you want it or not.
