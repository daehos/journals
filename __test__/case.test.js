const {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const request = require("supertest");
const {app} = require("../app");
const { sequelize } = require("../models");
const { User, Journal } = require("../models");
const { signToken } = require("../helpers/jwt");

let token;

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    token = signToken({ id: user.id }); // Generate JWT token
  } catch (error) {
    console.log(error, "<-- dari setup test case");
    
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("Journals API", () => {
  test(" Should create a new journal", async () => {
    const res = await request(app)
      .post("/journals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Test journal",
        ai_insight: "This is an AI-generated insight",
        date: "2025-01-29",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.content).toBe("Test journal");
  });

  test(" Should not create journal without content", async () => {
    const res = await request(app)
      .post("/journals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ai_insight: "Missing content",
        date: "2025-01-29",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Content Required");
  });

  test("Should get all journals", async () => {
    const res = await request(app)
      .get("/journals")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
