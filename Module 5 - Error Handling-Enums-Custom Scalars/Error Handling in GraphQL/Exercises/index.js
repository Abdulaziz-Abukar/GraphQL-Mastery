const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const Skill = require("./models/Skill");

require("dotenv").config();

const typeDefs = `#graphql
    type Skill {
        id: ID!
        title: String!
        status: String
    }

    type Query {
        getAllSkills(): [Skill]
        getSkill(id: ID!): Skill
    }

    type Mutation {
        addSkill(fields: SkillInput): Skill
        deleteSkill(id: ID!): Skill
    }

    input SkillInput {
        title: String!
        status: String
    }
`;

const resolvers = {
  Query: {
    getAllSkills: async () => {
      try {
        const skills = await Skill.find();

        if (skills.length === 0) Error("No skills found in database");
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "something went wrong");
      }
    },

    getSkill: async ({ id }) => {
      try {
        const skill = await Skill.findById(id);

        if (!skill) Error("Skill not in database");

        return skill;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },

  Mutation: {
    addSkill: async ({ fields }) => {
      try {
        const { title, status } = fields;

        if (!status) status = "Planned";

        const newSkill = new Skill(title, status);
        return await newSkill.save();
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    deleteSkill: async ({ id }) => {
      try {
        const deleted = Skill.findByIdAndDelete(id);
        if (!deleted) Error("No skill found in database");
        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },
};

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connection to MongoDB Successful");

    // start server
    const server = new ApolloServer({ typeDefs, resolvers });

    startStandaloneServer(server, {
      listen: { port: Number(process.env.PORT) },
    }).then(({ url }) => {
      console.log(`Server started, ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection failed: ${err.message}`);
  });
