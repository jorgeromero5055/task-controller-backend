const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type SubTask {
    id: String
    text: String
    checked: Boolean!
  }

  input SubTaskInput {
    id: String
    text: String
    checked: Boolean!
  }

  type Task {
    id: ID!
    name: String
    description: String
    date: String
    completed: Boolean
    overdue: Boolean
    priority: String
    subtasks: [SubTask]
  }

  type Query {
    getTasks: [Task]
    getTask(id: ID!): Task
  }

  type Mutation {
    createTask(
      name: String
      date: String
      description: String
      completed: Boolean
      overdue: Boolean
      priority: String
      subtasks: [SubTaskInput]
    ): Task

    updateTask(
      id: ID!
      name: String
      description: String
      date: String
      completed: Boolean
      overdue: Boolean
      priority: String
      subtasks: [SubTaskInput]
    ): Task

    deleteTask(id: ID!): Task
  }
`;

module.exports = typeDefs;
