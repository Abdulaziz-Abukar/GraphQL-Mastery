require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const User = require("./models/User");
const { signToken, verifyToken } = require("./utils/auth");
const bcrypt = require("bcrypt");

const DBEntry = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
    }

    type Query {
        findUserByEmail (email: String!): User
        me: User
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        signup(input: SignupInput!): AuthPayload
        login(input: LoginInput!): AuthPayload
    }

    input SignupInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }
`;

const resolvers = {
  Query: {
    findUserByEmail: async (_, { email }) => {
      return await User.findOne({ email });
    },

    me: async (_, __, context) => {
      if (!context.user) throw new Error("Not authenticated");

      const user = await User.findById(context.user.id);
      if (!user) throw new Error("User not found");

      return user;
    },
  },
  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password } = input;

      const existingUser = await User.findOne({ email });

      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = signToken(newUser);

      return {
        token,
        user: newUser,
      };
    },
    login: async (_, { input }) => {
      const { email, password } = input;

      const user = await User.findOne({ email });

      if (!user) throw new Error("Invalid credentials");

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) throw new Error("Invalid credentials");

      const token = signToken(user);

      return {
        token,
        user,
      };
    },
  },
};

async function startServer() {
  try {
    await mongoose.connect(DBEntry);
    console.log("MongoDB connection successful");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const user = verifyToken(token);
        return { user }; // available to resolvers
      },
      listen: { port: Number(PORT) },
    });

    console.log(`Server ready at ${url}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // crash the process on failure
  }
}

startServer();
