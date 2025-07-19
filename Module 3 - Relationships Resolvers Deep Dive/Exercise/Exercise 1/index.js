require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Skill = require("./models/Skill");
const Module = require("./models/Module");

// GQL Type Definitions

const typeDefs = gql`
  type Skill {
    id: ID!
    title: String!
    status: String
    modules: [Module]
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

  type Module {
    id: ID!
    title: String!
    description: String
    skill: Skill
  }

  input ModuleInput {
    title: String!
    description: String
    skillId: ID!
  }

  extend type Query {
    getAllModules: [Module]
    getModulesBySkill(skillId: ID!): [Module]
  }

  extend type Mutation {
    addModule(input: ModuleInput!): Module
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

    getAllModules: async () => await Module.find(),
    getModulesBySkill: async (_, { skillId }) => {
      return await Module.find({ skill: skillId });
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
        throw new Error("Failed to add skill");
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

    addModule: async (_, { input }) => {
      const { title, description, skillId } = input;
      const skill = await Skill.findById(skillId);
      if (!skill) throw new Error("Skill not found");
      const newModule = new Module({ title, description, skill: skillId });
      return await newModule.save();
    },
  },

  Skill: {
    modules: async (parent) => {
      return await Module.find({ skill: parent.id });
    },
  },

  Module: {
    skill: async (parent) => {
      return await Skill.findById(parent.skill);
    },
  },
};

// Connect DB
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
    console.log("MongoDB connection failed:", err);
  });
