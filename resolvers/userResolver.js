const Task = require("../models/taskModel");
const User = require("../models/userModel");

const userResolver = {
  Query: {
    activeUser: async () => {
      return "Valid user";
    },
  },

  Mutation: {
    createUser: async (_, { lastActive }, { userId }) => {
      try {
        const newUser = new User({ userId, lastActive });
        await newUser.save();
        return "creating user succesful";
      } catch (error) {
        console.log("Error creating User: " + error.message);
        throw new Error("Error creating User: " + error.message);
      }
    },

    updateUser: async (_, { lastActive }, { userId }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { userId },
          { lastActive },
          { new: true }
        );
        if (!updatedUser) {
          console.log("no user");
          throw new Error("User not found or access denied.");
        }
        return "updating user succesful" + updatedUser.lastActive;
      } catch (error) {
        console.log("delete error");
        throw new Error("Error updating last active: " + error.message);
      }
    },

    deleteUser: async (_, __, { userId }) => {
      try {
        const deletedUser = await User.findOneAndDelete({ userId });
        if (!deletedUser) {
          throw new Error("User not found or access denied.");
        }
        const deletedTasks = await Task.deleteMany({ userId });
        console.log(
          `Deleted ${deletedTasks.deletedCount} tasks for user ${userId}`
        );
        console.log("return set to hit");
        return "deleting user succesful";
      } catch (error) {
        throw new Error("Error deleting user: " + error.message);
      }
    },
  },
};

module.exports = userResolver;
