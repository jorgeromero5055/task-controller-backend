const { gql } = require("apollo-server-express");

// prettier-ignore
const userDef = gql`
  type User {
    id: ID!
    userId: String!
    lastActive: String!
  }

  type Query {
    activeUser: String!
  }
  
  type Mutation {
    createUser(
     lastActive: String!
     ): String

    updateUser(
    lastActive: String!): String!

    deleteUser: String!
  }
`;

module.exports = userDef;
