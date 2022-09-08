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
    test("It should be a user test in DB", async () => {
      user = User.findByEmail(credentials.email);
      expect(user).toBeInstanceOf(User);
      expect(user).toHaveProperty("firstname", "Test");
      expect(user).toHaveProperty("lastname", "Jest");
      expect(user).toHaveProperty("email", "test@jest.fr");
      expect(user.password).toHaveLength(60);
      expect(user).toHaveProperty("emailVerified", 0);
      expect(user).toHaveProperty("isBanned", 0);
    });
  });

  describe("Sending email verification", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get(`/users/sending-email-verification/${user.id}`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get email verification page", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app).get(`/users/email-verification/${user.id}/${user.emailToken}`);
      expect(response.statusCode).toBe(200);
    });
    test("It should validate the email address", async () => {
      user = User.findByEmail(credentials.email);
      expect(user).toHaveProperty("emailVerified", 1);
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
    test("It should return a statusCode 200", async () => {
      const response = await request(app)
        .post("/users/lost-password")
        .send(credentials);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get reset password page", () => {
    test("It should return a statusCode 200", async () => {
      user = User.findByEmail(credentials.email);
      const response = await request(app).get(`/users/reset-password/${user.id}/${user.passwordToken}`);
      expect(response.statusCode).toBe(200);
    })
  });

  describe("Post reset password form", () => {
    test("It should return a statusCode 200", async () => {
      const response = await request(app)
        .post(`/users/reset-password/${user.id}/${user.passwordToken}`)
        .send({ password: newPassword });
      expect(response.statusCode).toBe(200);
    })
    test("It should change the password", async () => {
      user = User.findByEmail(credentials.email);
      expect(user.comparePassword(newPassword)).toBe(true);
    });
  });

  describe("Get logout", () => {
    test("It should return a statusCode 302 and delete JWT token", async () => {
      const response = await request(app)
        .get("/users/logout")
        .set("Cookie", cookie);
      expect(response.statusCode).toBe(302);
      expect(response.header["set-cookie"][0].split(";")[0]).toBe("jwt=");
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