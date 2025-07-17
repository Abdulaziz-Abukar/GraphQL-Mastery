const { ApolloServer, gql } = require("apollo-server");

const skills = [
  { id: "1", title: "GraphQL", status: "In Progress" },
  { id: "2", title: "React", status: "Planned" },
];

const typeDefs = gql`
  type Skill {
    id: ID!
    title: String!
    status: String
  }

  type Query {
    getAllSkills: [Skill]
    getSkill(id: ID!): Skill
  }
`;

const resolvers = {
  Query: {
    getAllSkills: () => skills,
    getSkill: (_, args) => {
      return skills.find((skill) => skill.id === args.id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
