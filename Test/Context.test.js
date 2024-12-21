let req;
const mockToken = "validToken";
const mockSaveUser = jest.fn();
const mockUser = {
  userId: "12345",
  lastActive: new Date().toISOString(),
  save: mockSaveUser,
};

const mockVerifyIdToken = jest.fn().mockResolvedValue({ uid: "12345" });
const mockAuthFunction = jest.fn(() => ({
  verifyIdToken: mockVerifyIdToken,
}));

jest.mock("firebase-admin", () => ({
  auth: mockAuthFunction,
}));

let mockFindOne = jest.fn().mockResolvedValue(mockUser);

jest.mock("../models/userModel", () => ({
  findOne: mockFindOne,
}));

const context = require("../context");

describe("Context Validation", () => {
  beforeEach(() => {
    req = { headers: { authorization: `Bearer ${mockToken}` } };
    jest.clearAllMocks();
  });

  it("Valid token, user found, and active last login", async () => {
    const result = await context({ req });
    expect(result).toEqual({ userId: "12345" });
    expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(mockFindOne).toHaveBeenCalledWith({ userId: "12345" });
    expect(mockSaveUser).toHaveBeenCalled();
  });

  it("No Token Error", async () => {
    req.headers = {};
    await expect(context({ req })).rejects.toThrow("Invalid user");
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSaveUser).not.toHaveBeenCalled();
  });

  it("Invalid Token Error", async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));
    await expect(context({ req })).rejects.toThrow("Invalid user");
    expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockSaveUser).not.toHaveBeenCalled();
  });

  it("Invalid User Error", async () => {
    mockFindOne.mockRejectedValueOnce(new Error("Invalid user"));
    await expect(context({ req })).rejects.toThrow("Invalid user");
    expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(mockFindOne).toHaveBeenCalledWith({ userId: "12345" });
    expect(mockSaveUser).not.toHaveBeenCalled();
  });

  it("Past 30 days User", async () => {
    const overwrittenMockUser = {
      ...mockUser,
      lastActive: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    };
    mockFindOne.mockResolvedValueOnce(overwrittenMockUser);
    await expect(context({ req })).rejects.toThrow("Invalid user");
    expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(mockFindOne).toHaveBeenCalledWith({ userId: "12345" });
    expect(mockSaveUser).not.toHaveBeenCalled();
  });

  it("Saving user fails", async () => {
    mockSaveUser.mockRejectedValueOnce(new Error("Invalid user"));
    await expect(context({ req })).rejects.toThrow("Invalid user");
    expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(mockFindOne).toHaveBeenCalledWith({ userId: "12345" });
    expect(mockSaveUser).toHaveBeenCalled();
  });
});
