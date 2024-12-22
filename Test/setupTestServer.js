const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");

const userResolvers = require("../resolvers/userResolver");
const userTypeDefs = require("../typeDefs/userTypeDef");
const taskResolvers = require("../resolvers/taskResolver");
const taskTypeDefs = require("../typeDefs/taskTypeDefs");
const typeDefs = mergeTypeDefs([userTypeDefs, taskTypeDefs]);
const resolvers = mergeResolvers([userResolvers, taskResolvers]);
const context = require("../context");

const createTestServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: context,
  });

  await server.start();

  server.applyMiddleware({ app });

  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  return {
    app,

    mongoServer,
  };
};

module.exports = createTestServer;
