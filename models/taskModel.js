const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique identifier for each subtask
  text: String, // Subtask description
  checked: { type: Boolean, required: true, default: false }, // Completion status
});

const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: String,
    description: String,
    date: String, // Store date as a string, but you can use Date if necessary
    completed: {
      type: Boolean,
      default: false,
    },
    overdue: {
      type: Boolean,
      default: false,
    },
    priority: String,
    subtasks: {
      type: [subtaskSchema], // Array of subtask objects
      default: [], // Default to an empty array if no subtasks are provided
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
