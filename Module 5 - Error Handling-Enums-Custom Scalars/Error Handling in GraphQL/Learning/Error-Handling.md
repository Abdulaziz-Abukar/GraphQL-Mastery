# Error Handling in GraphQL

## Theory

GraphQL doesn't crash your server on errors - instead, it returns errors in a structured format alongside any successful data.

### Example:

```graphql
query {
  getSkill(id: "invalid_id") {
    title
  }
}
```

if `invalid_id` is not a real MongoDB ObjectId, the response might look like:

```json
{
  "data": { "getSkill": null },
  "errors": [
    {
      "message": "Skill not found",
      "path": ["getSkill"]
    }
  ]
}
```

## Best Practices

- Use `try/catch` blocks in resolvers.
- Throw custom errors using `throw new Error("...")`
- Return partial data where possible with descriptive errors
