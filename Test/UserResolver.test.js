const mockContext = { userId: "12345" };
const mockUserObject = {
  id: "1",
  lastActive: new Date().toISOString(),
};

const mockSave = jest.fn(); // Save method mock

const mockUser = jest.fn().mockImplementation((data) => ({
  ...data,
  save: mockSave.mockResolvedValue({
    ...data,
  }),
}));

// Attach static methods directly to the function
mockUser.findOneAndUpdate = jest.fn();

jest.mock("../models/userModel", () => mockUser);
const User = require("../models/userModel");

jest.mock("../models/taskModel", () => ({
  deleteMany: jest.fn().mockResolvedValue({ deletedCount: 2 }),
}));
const Task = require("../models/taskModel");

const resolvers = require("../resolvers/userResolver");

describe("User Resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks mutation", () => {
    it("Create a new user successfully ", async () => {
      const result = await resolvers.Mutation.createUser(
        null,
        mockUserObject,
        mockContext
      );

      expect(User).toHaveBeenCalledWith({
        userId: mockContext.userId,
        lastActive: mockUserObject.lastActive,
      });

      expect(result).toEqual("creating user succesful");
    });

    it("Create a new user with faliure ", async () => {
      mockSave.mockRejectedValueOnce(new Error("Error creating a user"));
      await expect(
        resolvers.Mutation.createUser(null, mockUserObject, mockContext)
      ).rejects.toThrow("Error creating User: Error creating a user");
      expect(User).toHaveBeenCalledWith({
        userId: mockContext.userId,
        lastActive: mockUserObject.lastActive,
      });
    });
  });

  describe("updateUser mutation", () => {
    it("Update a user successfully", async () => {
      User.findOneAndUpdate.mockResolvedValue(mockUserObject);
      const result = await resolvers.Mutation.updateUser(
        null,
        mockUserObject,
        mockContext
      );
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: mockContext.userId,
        },
        { lastActive: mockUserObject.lastActive },
        { new: true }
      );
      expect(result).toEqual(
        "updating user succesful" + mockUserObject.lastActive
      );
    });

    it("Update a user with error", async () => {
      User.findOneAndUpdate.mockRejectedValueOnce(
        new Error("Error updating the user.")
      );

      await await expect(
        resolvers.Mutation.updateUser(null, mockUserObject, mockContext)
      ).rejects.toThrow("Error updating last active: Error updating the user.");

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: mockContext.userId,
        },
        { lastActive: mockUserObject.lastActive },
        { new: true }
      );
    });

    it("No user found error ", async () => {
      User.findOneAndUpdate.mockResolvedValue(false);

      await expect(
        resolvers.Mutation.updateUser(null, mockUserObject, mockContext)
      ).rejects.toThrow(
        "Error updating last active: User not found or access denied."
      );

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: mockContext.userId,
        },
        { lastActive: mockUserObject.lastActive },
        { new: true }
      );
    });
  });

  describe("deleteUser mutation", () => {
    it("Delete the user and their tasks", async () => {
      User.findOneAndDelete.mockResolvedValue(mockUserObject);

      const result = await resolvers.Mutation.deleteUser(
        null,
        null,
        mockContext
      );
      expect(result).toEqual("deleting user succesful");
      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        userId: mockContext.userId,
      });
      expect(Task.deleteMany).toHaveBeenCalledWith({
        userId: mockContext.userId,
      });
    });

    it("Delete the user fails", async () => {
      User.findOneAndDelete.mockRejectedValueOnce(
        new Error("Error deleting the user.")
      );

      await expect(
        resolvers.Mutation.deleteUser(null, null, mockContext)
      ).rejects.toThrow("Error deleting user: Error deleting the user.");
      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        userId: mockContext.userId,
      });
      expect(Task.deleteMany).not.toHaveBeenCalled();
    });

    it("Delete the user tasks fails", async () => {
      Task.deleteMany.mockRejectedValueOnce(
        new Error("Error deleting the user tasks.")
      );

      await expect(
        resolvers.Mutation.deleteUser(null, null, mockContext)
      ).rejects.toThrow("Error deleting user: Error deleting the user tasks.");

      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        userId: mockContext.userId,
      });
      expect(Task.deleteMany).toHaveBeenCalledWith({
        userId: mockContext.userId,
      });
    });
  });
});
