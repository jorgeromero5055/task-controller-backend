const Task = require("../models/taskModel");
const User = require("../models/userModel");

const userResolver = {
  Query: {
    activeUser: async (_, __, { userId }) => {
      if (userId === "Invalid User") throw new Error("Invalid User");
      return "Valid user";
    },
  },

  Mutation: {
    createUser: async (_, { lastActive }, { userId }) => {
      if (userId === "Invalid User") throw new Error("Invalid User");
      try {
        const newUser = new User({ userId, lastActive });
        await newUser.save();
        return "creating user succesful";
      } catch (error) {
        throw new Error("Error creating User: " + error.message);
      }
    },

    updateUser: async (_, { lastActive }, { userId }) => {
      if (userId === "Invalid User") throw new Error("Invalid User");
      try {
        const updatedUser = await User.findOneAndUpdate(
          { userId },
          { lastActive },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("User not found or access denied.");
        }
        return "updating user succesful" + updatedUser.lastActive;
      } catch (error) {
        throw new Error("Error updating last active: " + error.message);
      }
    },

    deleteUser: async (_, __, { userId }) => {
      if (userId === "Invalid User") throw new Error("Invalid User");
      try {
        const deletedUser = await User.findOneAndDelete({ userId });
        if (!deletedUser) {
          throw new Error("User not found or access denied.");
        }
        await Task.deleteMany({ userId });

        return "deleting user succesful";
      } catch (error) {
        throw new Error("Error deleting user: " + error.message);
      }
    },
  },
};

module.exports = userResolver;
