const request = require("supertest");
const app = require("../../app/app");
const User = require("../../app/models/user");

describe("Test the user paths", () => {

  let user = null;
  let cookie = null;
  const credentials = {
    firstname: "test",
    lastname: "jest",
    email: "test@jest.fr",
    password: "123"
  };
  const newPassword = "1234";

  afterAll(async () => {
    await User.deleteByEmail("test@jest.fr");
  });

  describe("Get sign up page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get("/users/signup");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Post sign up form", () => {
    test("It should return a statusCode 201", async () => {
      const response = await request(app)
        .post("/users/signup")
        .send(credentials);
      expect(response.statusCode).toBe(201);
    });
  });

  describe("Sending email verification", () => {
    test("It should return a statusCode 200", async () => {
      user = await User.findByEmail(credentials.email);
      const response = await request(app).get(`/users/sending-email-verification/${ user.id }`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get email verification page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get(`/users/email-verification/${ user.id }/${ user.emailToken }`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get sign in page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get("/users/signin");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Post sign in form", () => {
    test("It should return a statusCode 302", async () => {
      const response = await request(app)
      .post("/users/signin")
      .send(credentials);
      cookie = response.header["set-cookie"];
      expect(response.statusCode).toBe(302);
    }); 
  });

  describe("Get profile page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app)
        .get("/users/profile")
        .set("Cookie", cookie)
        .send(user);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get lost password page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get("/users/lost-password");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Post lost password form", () => {  
    test("It should return a statusCode 204", async () => {
      const response = await request(app)
        .patch("/users/lost-password")
        .send(credentials);
      expect(response.statusCode).toBe(204);
    });
  });

  describe("Get reset password page", () => {
    test("It should return a statusCode 200", async () => {    
      user = await User.findByEmail(credentials.email);
      const response = await request(app).get(`/users/reset-password/${ user.id }/${ user.passwordToken }`);
      expect(response.statusCode).toBe(200);
    })
  });

  describe("Post reset password form", () => {  
    test("It should return a statusCode 204", async () => {
      const response = await request(app)
        .patch(`/users/reset-password/${ user.id }/${ user.passwordToken }`)
        .send({ password: newPassword });
      expect(response.statusCode).toBe(204);
    })
  });

  describe("Get logout", () => {  
    test("It should return a statusCode 302", async () => {
      const response = await request(app).get("/users/logout");
      expect(response.statusCode).toBe(302);
    });
  });

  describe("Post sign in form", () => {
    test("It should return a statusCode 302", async () => {
      const response = await request(app)
      .post("/users/signin")
      .send({ email: credentials.email, password: newPassword });
      expect(response.statusCode).toBe(302);
    });  
  });
});