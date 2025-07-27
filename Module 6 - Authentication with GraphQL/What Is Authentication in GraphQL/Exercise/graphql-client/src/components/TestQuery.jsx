import { gql, useQuery } from "@apollo/client";

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

export default function TestQuery() {
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User Info</h2>
      <p>ID: {data.me.id}</p>
      <p>Name: {data.me.name}</p>
      <p>Email: {data.me.email}</p>
    </div>
  );
}
