# Section 1: How Authentication Works in GraphQL

## What is Authentication?

Authentication is verifying **who the user is**. Common flow:

- User sends credentials (like email + password)
- Backend checks them and responds with a **JWT** (JSON Web Token)
- That token is stored client-side (e.g. in localStorage)
- Every future request includes that token in the **Authorization** header
- Backend verifies the token and grants access.

## Why JWT?

JWT = JSON Web Token, a secure, compact token with:

- Header: type (JWT) + algorithm (e.g. HS256)
- Payload: user data (e.g. userId, email)
- Signature: signed with a secret so it can't be forged

Example token payload:

```json
{
  "id": "abc123",
  "email": "user@email.com",
  "iat": 1712352352,
  "exp": 1712957152
}
```

## The Flow in GraphQL:

1. **Signup/Login Mutation** -> Generate and return token
2. **Client stores token** -> Usually in localStorage or a cookie
3. **Client sends token in headers** -> `Authorization: Bearer <token>`
4. **GraphQL middlware reads token, verifies it**, verifies it
5. If valid -> attaches `user` to the context so all resolvers can access

## Recap Anology

Think of it like a concert:

- You buy a ticket (JWT) at the entrance (login)
- Guards (middlware) check your ticket everytime you enter a VIP area (protected resolver)
- You don't need to re-buy, just show the valid ticket each time.
