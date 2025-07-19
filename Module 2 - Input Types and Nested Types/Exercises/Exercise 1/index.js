require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Skill = require("./models/Skill");

// graphQL type defintions

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

  input SkillInput {
    title: String!
    status: String
  }

  type Mutation {
    addSkill(input: SkillInput!): Skill
    updateSkill(id: ID!, title: String, status: String): Skill
    deleteSkill(id: ID!): Skill
  }
`;

const resolvers = {
  Query: {
    getAllSkills: async () => {
      try {
        return await Skill.find();
      } catch (err) {
        console.error(err);
        throw new Error("Skills not found");
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

  Mutation: {
    addSkill: async (_, { input }) => {
      try {
        let { title, status } = input;

        if (!status || status.trim() === "") {
          status = "Planned";
        }

        const titleDupeFinder = await Skill.findOne({ title });

        if (titleDupeFinder) {
          throw new Error("Duplicate skill title found");
        }

        const newSkill = new Skill({ title, status });
        return await newSkill.save();
      } catch (err) {
        console.error(err);
        throw new Error("failed to add skill");
      }
    },

    updateSkill: async (_, { id, title, status }) => {
      try {
        const updates = {};
        if (title) updates.title = title;
        if (status) updates.status = status;

        const updated = await Skill.findByIdAndUpdate(id, updates, {
          new: true,
        });
        if (!updated) throw new Error("Skill not found");
        return updated;
      } catch (err) {
        console.error(err);
        throw new Error("Skill not found");
      }
    },

    deleteSkill: async (_, { id }) => {
      try {
        const deleted = await Skill.findByIdAndDelete(id);
        if (!deleted) throw new Error("Skill not found");
        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error("Skill not found");
      }
    },
  },
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
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
