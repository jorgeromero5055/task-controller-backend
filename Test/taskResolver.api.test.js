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

let itemId;
describe("Task Resolver Test", () => {
  it("should create a task successfully", async () => {
    const mutation = `
    mutation {
      createTask(
        name: "Test Task",
        description: "A sample task description",
        date: "2024-12-20T00:00:00.000Z",  # Replace with a valid date
        completed: false,
        overdue: false,
        priority: "High",
        subtasks: [{ id:"test",text: "Subtask 1", checked: false }]
      ) {
        id
       name
        }
    }
  `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });

    console.log(
      "response.body.data.createTask",
      response.body.data.createTask.name
    );
    expect(response.status).toBe(200);
    expect(response.body.data.createTask.name).toBe("Test Task");
    itemId = response.body.data.createTask.id;
  });

  it("should update a task successfully", async () => {
    const mutation = `
    mutation {
      updateTask(
        id: "${itemId}"
        name: "Test Task 2",
        description: "A sample task description",
        date: "2024-12-20T00:00:00.000Z",  # Replace with a valid date
        completed: false,
        overdue: false,
        priority: "High",
        subtasks: [{ id:"test",text: "Subtask 1", checked: false }]
      ) {
        id
       name
        }
    }
  `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    console.log("updateTask frfr", itemId, response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.updateTask.name).toBe("Test Task 2");
  });

  it("should get tasks successfully", async () => {
    const mutation = `
    query {
      getTasks{
        name
    }
  }
  `;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.getTasks[0].name).toBe("Test Task 2");
  });

  it("should get task successfully", async () => {
    const mutation = `
    query {
      getTask(
      id: "${itemId}"
      ){
        name
    }
  }
  `;
    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.getTask.name).toBe("Test Task 2");
  });

  it("should delete a task successfully", async () => {
    const mutation = `
    mutation {
      deleteTask(
        id: "${itemId}"
      ) {
        id
       name
        }
    }
  `;

    const response = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${uniqueID}`)
      .send({ query: mutation });
    expect(response.status).toBe(200);
    expect(response.body.data.deleteTask.name).toBe("Test Task 2");
  });
});
