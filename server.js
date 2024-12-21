const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const cors = require("cors");
const context = require("./context");

require("dotenv").config();
const admin = require("firebase-admin");

const taskTypeDefs = require("./typeDefs/taskTypeDefs");
const taskResolvers = require("./resolvers/taskResolver");
const userTypeDefs = require("./typeDefs/userTypeDef");
const userResolvers = require("./resolvers/userResolver");

const mongodbURI = process.env.MONGODB_URI;
const PORT = 4000;

const typeDefs = mergeTypeDefs([taskTypeDefs, userTypeDefs]);
const resolvers = mergeResolvers([taskResolvers, userResolvers]);

const app = express();

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(
    require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  ),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });
    mongoose
      .connect(mongodbURI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.log("MongoDB connection error: ", err));

    app.listen(PORT, () => {
      console.log(
        `Server running on http://192.168.1.153:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
