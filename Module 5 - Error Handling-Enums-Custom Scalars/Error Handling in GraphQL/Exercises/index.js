require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { StandaloneServer } = require("@apollo/server/standalone");
const Skill = require("./models/Skill");
