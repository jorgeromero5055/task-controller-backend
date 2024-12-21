const request = require("supertest");
const uniqueID = `user1 ${new Date().toISOString()}`;

const mockAuth = jest.fn().mockImplementation(() => ({
  verifyIdToken: jest.fn().mockImplementation(async (token) => {
    return { uid: token };
  }),
}));

jest.mock("firebase-admin", () => ({ auth: mockAuth }));

const createTestServer = require("./setupTestServer");

let app, mongoServer;

beforeAll(async () => {
  const serverSetup = await createTestServer();
  app = serverSetup.app;
  mongoServer = serverSetup.mongoServer;
});

afterAll(async () => {
  await mongoServer.stop();
});

describe("User Resolver Test", () => {
  it("should query active user successfully", async () => {
    const mutation = `
      query {
        activeUser
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.activeUser).toBe("Valid user");
  });

  it("should create a user successfully", async () => {
    const mutation = `
      mutation {
        createUser(lastActive: "${new Date().toISOString()}")
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.createUser).toBe("creating user succesful");
  });

  it("should update a user successfully", async () => {
    const lastActive = new Date().toISOString();
    const mutation = `
      mutation {
        updateUser(lastActive: "${lastActive}")
      }
    `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.updateUser).toBe(
      "updating user succesful" + lastActive
    );
  });

  it("should delete a user successfully", async () => {
    const mutation = `mutation {
    deleteUser
    }`;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteUser).toBe("deleting user succesful");
  });
});
