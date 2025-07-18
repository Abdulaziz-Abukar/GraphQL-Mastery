require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Skill = require("./models/Skill");

// GraphQL type definitions
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

// GraphQL resolvers
const resolvers = {
  Query: {
    getAllSkills: async () => {
      try {
        return await Skill.find();
      } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch skills");
      }
    },
    getSkill: async (_, { id }) => {
      try {
        return await Skill.findById(id);
      } catch (err) {
        console.error(err);
        throw new Error("Skill not found");
      }
    },
  },
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    // Start Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
