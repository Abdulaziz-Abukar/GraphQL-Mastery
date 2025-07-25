const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const Skill = require("./models/Skill");

require("dotenv").config();

const DBEntry = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const typeDefs = `#graphql
    type Skill {
        id: ID!
        title: String!
        status: SkillStatus
    }

    type Query {
        getAllSkills: [Skill]
        getSkill(id: ID!): Skill
    }

    type Mutation {
        addSkill(fields: SkillInput!): Skill
        deleteSkill(id: ID!): Skill
    }

    
    enum SkillStatus {
        PLANNED
        INPROGRESS
        DONE
    }

    input SkillInput {
        title: String!
        status: SkillStatus
    }
`;

const resolvers = {
  Query: {
    getAllSkills: async () => {
      try {
        const skills = await Skill.find();
        if (skills.length === 0) throw new Error("No skills in the database");
        return skills;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    getSkill: async (_, { id }) => {
      try {
        const validation = mongoose.Types.ObjectId.isValid(id);

        if (!validation) throw new Error("Invalid ID submitted.");

        const skill = await Skill.findById(id);

        if (!skill) throw new Error("Skill doesn't exist in database");

        return skill;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },

  Mutation: {
    addSkill: async (_, { fields }) => {
      try {
        const { title, status } = fields;

        const newSkill = new Skill({ title, status });

        return await newSkill.save();
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    deleteSkill: async (_, { id }) => {
      try {
        const validation = mongoose.Types.ObjectId.isValid(id);

        if (!validation) throw new Error("Invalid ID Submitted.");

        const deleted = Skill.findByIdAndDelete(id);

        if (deleted) throw new Error("Skill was not found in database");

        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },
};

mongoose
  .connect(DBEntry)
  .then(() => {
    console.log("Connection to MongoDB successful");

    // Create server
    const server = new ApolloServer({ typeDefs, resolvers });

    startStandaloneServer(server, {
      listen: { port: Number(PORT) },
    }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection failed: ${err}`);
  });
