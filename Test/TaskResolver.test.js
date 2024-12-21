const mockContext = { userId: "12345" };
const mockId = "54321";

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const mockSaveTask1 = jest.fn().mockResolvedValue(true);
const mockSaveTask2 = jest.fn().mockResolvedValue(true);

const mockTasks = [
  {
    _id: "1",
    userId: "12345",
    completed: false,
    overdue: false,
    date: new Date(currentDate - 1).toISOString(), // Date in the past
    save: mockSaveTask1,
  },
  {
    _id: "2",
    userId: "12345",
    completed: true,
    overdue: false,
    date: new Date(currentDate).toISOString(), // Current date
    save: mockSaveTask2,
  },
];

const mockCreateItem = {
  name: "Test Task",
  description: "A sample task description",
  date: "2024-12-16T00:00:00.000Z",
  completed: false,
  overdue: false,
  priority: "High",
  subtasks: ["Subtask 1", "Subtask 2"],
};

const mockExistingItem = { ...mockCreateItem, id: "1" };

const mockSave = jest.fn(); // Save method mock

// Define Task as a function and add methods to it
const mockTask = jest.fn().mockImplementation((data) => ({
  ...data,
  save: mockSave.mockResolvedValue({
    _id: "1",
    userId: mockContext.userId,
    ...data,
  }),
}));

// Attach static methods directly to the function
mockTask.find = jest.fn();
mockTask.findOne = jest.fn();
mockTask.findOneAndUpdate = jest.fn();
mockTask.findOneAndDelete = jest.fn();

jest.mock("../models/taskModel", () => mockTask);
const Task = require("../models/taskModel");
const resolvers = require("../resolvers/taskResolver");

describe("Task Resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks query", () => {
    it("Should fetch tasks, mark overdue tasks, and return them", async () => {
      Task.find.mockResolvedValue(mockTasks.map((item) => ({ ...item })));
      const result = await resolvers.Query.getTasks(null, null, mockContext);
      expect(Task.find).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).toHaveBeenCalled();
      expect(mockSaveTask2).not.toHaveBeenCalled();
      const updatedTasks = mockTasks.map((item, index) => {
        if (index === 0) return { ...item, overdue: true };
        else return { ...item };
      });
      expect(result).toEqual(updatedTasks);
    });

    it("should throw an error when Task.find fails", async () => {
      Task.find.mockRejectedValueOnce(new Error("Error retriving tasks"));
      await expect(
        resolvers.Query.getTasks(null, null, mockContext)
      ).rejects.toThrow("Error fetching tasks: Error retriving tasks");

      expect(Task.find).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).not.toHaveBeenCalled();
      expect(mockSaveTask2).not.toHaveBeenCalled();
    });

    it("should throw an error when task.save fails", async () => {
      Task.find.mockResolvedValue(mockTasks.map((item) => ({ ...item })));

      mockSaveTask1.mockRejectedValueOnce(new Error("Error saving task"));

      await expect(
        resolvers.Query.getTasks(null, null, mockContext)
      ).rejects.toThrow("Error fetching tasks: Error saving task");

      expect(Task.find).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).toHaveBeenCalled();
      expect(mockSaveTask2).not.toHaveBeenCalled();
    });
  });

  describe("getTask query", () => {
    it("Should fetch tasks, mark overdue tasks, and return them", async () => {
      Task.findOne.mockResolvedValue({ ...mockTasks[0] });
      const result = await resolvers.Query.getTask(null, mockId, mockContext);
      expect(Task.findOne).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).toHaveBeenCalled();
      const updatedTask = { ...mockTasks[0], overdue: true };
      expect(result).toEqual(updatedTask);
    });

    it("should throw an error when Task.findOne fails", async () => {
      Task.findOne.mockRejectedValueOnce(new Error("Error retriving task"));
      await expect(
        resolvers.Query.getTask(null, mockId, mockContext)
      ).rejects.toThrow("Error fetching task: Error retriving task");

      expect(Task.findOne).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).not.toHaveBeenCalled();
    });

    it("should throw an error when task.save fails", async () => {
      Task.findOne.mockResolvedValue({ ...mockTasks[0] });
      mockSaveTask1.mockRejectedValueOnce(new Error("Error saving task"));
      await expect(
        resolvers.Query.getTask(null, mockId, mockContext)
      ).rejects.toThrow("Error fetching task: Error saving task");

      expect(Task.findOne).toHaveBeenCalledWith({ userId: "12345" });
      expect(mockSaveTask1).toHaveBeenCalled();
    });
  });

  describe("createTask mutation", () => {
    it("should create new task wih success", async () => {
      const result = await resolvers.Mutation.createTask(
        null,
        mockCreateItem,
        mockContext
      );

      expect(Task).toHaveBeenCalledWith({
        userId: mockContext.userId,
        ...mockCreateItem,
      });

      expect(result).toEqual({
        _id: "1",
        userId: mockContext.userId,
        ...mockCreateItem,
      });
    });

    it("should create new task with faliure", async () => {
      mockSave.mockRejectedValueOnce(new Error("Error saving new task"));
      await expect(
        resolvers.Mutation.createTask(null, mockCreateItem, mockContext)
      ).rejects.toThrow(
        "An error occurred while creating this item: Error saving new task"
      );

      expect(Task).toHaveBeenCalledWith({
        userId: mockContext.userId,
        ...mockCreateItem,
      });
    });
  });

  describe("updateTask mutation", () => {
    it("should update task with success", async () => {
      Task.findOneAndUpdate.mockResolvedValue(mockExistingItem);

      const result = await resolvers.Mutation.updateTask(
        null,
        mockExistingItem,
        mockContext
      );
      expect(result).toEqual(mockExistingItem);

      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockExistingItem.id, userId: mockContext.userId },
        mockCreateItem,
        { new: true }
      );
    });

    it("should update task with faliure", async () => {
      Task.findOneAndUpdate.mockRejectedValueOnce(
        new Error("Error updating new task")
      );
      await expect(
        resolvers.Mutation.updateTask(null, mockExistingItem, mockContext)
      ).rejects.toThrow(
        "An error occurred while updating this item: Error updating new task"
      );
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockExistingItem.id, userId: mockContext.userId },
        mockCreateItem,
        { new: true }
      );
    });
  });

  describe("deleteTask mutation", () => {
    it("should delete task with success", async () => {
      Task.findOneAndDelete.mockResolvedValue(mockExistingItem);

      const result = await resolvers.Mutation.deleteTask(
        null,
        { id: mockExistingItem.id },
        mockContext
      );

      expect(result).toEqual(mockExistingItem);

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockExistingItem.id,
        userId: mockContext.userId,
      });
    });

    it("should delete task with faliure", async () => {
      Task.findOneAndDelete.mockRejectedValueOnce(
        new Error("Error deleting new task")
      );

      await await expect(
        resolvers.Mutation.deleteTask(
          null,
          { id: mockExistingItem.id },
          mockContext
        )
      ).rejects.toThrow(
        "An error occurred while deleting this item: Error deleting new task"
      );

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockExistingItem.id,
        userId: mockContext.userId,
      });
    });
  });
});

