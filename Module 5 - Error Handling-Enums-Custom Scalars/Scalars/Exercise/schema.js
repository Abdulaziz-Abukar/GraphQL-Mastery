const mongoose = require("mongoose");
const User = require("./models/User");
const {
  EmailAddressResolver,
  PhoneNumberResolver,
  DateTimeResolver,
  JSONResolver,
} = require("graphql-scalars");

const typeDefs = `#graphql
    scalar Email
    scalar PhoneNumber
    scalar Date
    scalar JSON

    type User {
        id: ID!
        name: String!
        email: Email!
        phoneNumber: PhoneNumber
        createdAt: Date
        metadata: JSON
    }

    type Query {
        getAllUsers: [User]
        getUser(id: ID!): User
    }

    input UserInput {
        name: String!
        email: Email!
        phoneNumber: PhoneNumber
        metadata: JSON
    }

    type Mutation {
        createUser(input: UserInput!): User
        deleteUser(id: ID!): User
    }
`;

const resolvers = {
  Email: EmailAddressResolver,
  PhoneNumber: PhoneNumberResolver,
  Date: DateTimeResolver,
  JSON: JSONResolver,

  Query: {
    getAllUsers: async () => {
      try {
        const users = await User.find();

        if (users.length === 0) throw new Error("No users in database");

        return users;
      } catch (err) {
        console.error(err.message);
        throw new Error(err.message || "Something went wrong");
      }
    },

    getUser: async (_, { id }) => {
      try {
        const validation = mongoose.Types.ObjectId.isValid(id);
        if (!validation) throw new Error("Invalid ID submitted");

        const user = await User.findById(id);

        if (!user) throw new Error("User doesn't exist in database");

        return user;
      } catch (err) {
        console.error(err.message);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const { name, email, phoneNumber, metadata } = input;

        const userExists = await User.findOne({
          $or: [{ email }, { phoneNumber }],
        });

        if (userExists) throw new Error("User already exists");

        const newUser = new User({ name, email, phoneNumber, metadata });

        return await newUser.save();
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const validation = mongoose.Types.ObjectId.isValid(id);
        if (!validation) throw new Error("Invalid ID Submitted");

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) throw new Error("User doesn't exist in database");

        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
