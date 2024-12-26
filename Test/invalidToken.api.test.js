const mongoose = require("mongoose");
const request = require("supertest");
const uniqueID = `user1 ${new Date().toISOString()}`;

const mockVerifyIdToken = jest.fn();
const mockAuth = jest.fn().mockImplementation(() => ({
  verifyIdToken: mockVerifyIdToken,
}));

jest.mock("firebase-admin", () => ({ auth: mockAuth }));

const mockFindOne = jest.fn().mockImplementation(() => ({
  user: {
    lastActive: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
  },
}));

jest.mock("../models/userModel", () => ({ findOne: mockFindOne }));

const createTestServer = require("./setupTestServer");

let app, mongoServer;

beforeAll(async () => {
  const serverSetup = await createTestServer();
  app = serverSetup.app;
  mongoServer = serverSetup.mongoServer;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Resolver Test", () => {
  it("no token error", async () => {
    const mutation = `
      query {
        activeUser
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer `)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toBe("Invalid User");
  });

  it("invalid token error", async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid Token"));
    const mutation = `
      query {
        activeUser
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toBe("Invalid User");
  });

  it("expire user error", async () => {
    const mutation = `
      query {
        activeUser
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toBe("Invalid User");
  });
});
