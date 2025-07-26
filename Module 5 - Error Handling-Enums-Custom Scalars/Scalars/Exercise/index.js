const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs, resolvers } = require("./schema");

require("dotenv").config();

const DBEntry = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

mongoose
  .connect(DBEntry)
  .then(() => {
    console.log("MongoDB Connection successful");

    const server = new ApolloServer({ typeDefs, resolvers });

    startStandaloneServer(server, {
      listen: { port: Number(PORT) },
    }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed: ", err);
  });
