// src/LoginForm.jsx
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function LoginForm() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        variables: { input: formState },
      });

      const token = res.data.login.token;
      localStorage.setItem("token", token);
      window.location.reload(); // Reload to refetch authenticated data
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formState.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formState.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {data && <p>Welcome back, {data.login.user.name}!</p>}
    </form>
  );
}
