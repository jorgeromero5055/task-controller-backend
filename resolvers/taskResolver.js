const Task = require("../models/taskModel");

const resolvers = {
  Query: {
    getTasks: async (_, __, { userId }) => {
      try {
        const tasks = await Task.find({ userId });
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const updatedTasks = await Promise.all(
          tasks.map(async (task) => {
            if (
              !task.completed &&
              !task.overdue &&
              new Date(task.date) < new Date(currentDate)
            ) {
              task.overdue = true;
              await task.save();
            }
            return task;
          })
        );
        return updatedTasks;
      } catch (error) {
        throw new Error("Error fetching tasks: " + error.message);
      }
    },

    getTask: async (_, { id }, { userId }) => {
      try {
        const task = await Task.findOne({ _id: id, userId });
        if (!task) {
          throw new Error("Task not found");
        }
        const currentDate = new Date();
        if (
          !task.completed &&
          !task.overdue &&
          new Date(task.date) < currentDate
        ) {
          task.overdue = true;
          await task.save();
        }
        return task;
      } catch (error) {
        throw new Error("Error fetching task: " + error.message);
      }
    },
  },

  Mutation: {
    createTask: async (
      _,
      { name, description, date, completed, overdue, priority, subtasks },
      { userId }
    ) => {
      const newTask = new Task({
        userId,
        name,
        description,
        date,
        completed,
        overdue,
        priority,
        subtasks,
      });
      try {
        return await newTask.save();
      } catch (error) {
        throw new Error(
          "An error occurred while creating this item: " + error.message
        );
      }
    },

    updateTask: async (
      _,
      { id, name, description, date, completed, overdue, priority, subtasks },
      { userId }
    ) => {
      try {
        const updatedTask = await Task.findOneAndUpdate(
          { _id: id, userId },
          { name, description, date, completed, overdue, priority, subtasks },
          { new: true }
        );
        return updatedTask;
      } catch (error) {
        throw new Error(
          "An error occurred while updating this item: " + error.message
        );
      }
    },

    deleteTask: async (_, { id }, { userId }) => {
      try {
        const deletedItem = await Task.findOneAndDelete({ _id: id, userId });
        return deletedItem;
      } catch (error) {
        throw new Error(
          "An error occurred while deleting this item: " + error.message
        );
      }
    },
  },
};

module.exports = resolvers;
