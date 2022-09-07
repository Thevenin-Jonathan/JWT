const request = require("supertest");
const app = require("../../app/app");

describe("Test the root path", () => {
  test("It should return statusCode 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  })
});