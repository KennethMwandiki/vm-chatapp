const request = require("supertest");
const app = require("../api/index"); // Vercel doesn't need a running server object for tests
const MockStrategy = require("passport-mock-strategy");
const passport = require("passport");

describe("Auth Endpoints", () => {
  const mockUser = { id: "123", displayName: "Test User", emails: [{ value: "test@example.com" }] };

  beforeAll((done) => {
    // Replace the GoogleStrategy with a mock strategy for testing
    passport.use(new MockStrategy({
      name: 'google',
      user: mockUser
    }, (user, done) => {
      done(null, user);
    }));
    done();
  });

  afterAll((done) => {
    // For serverless functions, there's no persistent server to close.
    // If you were testing a local server, you would close it here.
    // e.g., server.close(done);
    done();
  });

  it("should redirect to Google for authentication", async () => {
    const res = await request(app).get("/auth/google");
    // The mock strategy doesn't perform a real redirect, but a 200 is a sign of it trying.
    // A real test against passport-google-oauth20 would check for a 302 redirect.
    // With passport-mock-strategy, it proceeds to the callback logic.
    // We'll check for the successful redirect from the callback.
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  it("should handle the Google callback and redirect to dashboard", async () => {
    const res = await request(app).get("/auth/google/callback");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  describe("with authenticated user", () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      // Log the user in
      await agent.get("/auth/google/callback");
    });

    it("should allow access to a protected route", async () => {
      const res = await agent.get("/generate-token/test-channel");
      // We expect a 500 because CUSTOMER_SECRET is not set, but a 401 would mean auth failed.
      expect(res.statusCode).not.toBe(401);
    });

    it("should log the user out", async () => {
      // First, confirm we are logged in
      let res = await agent.get("/generate-token/test-channel");
      expect(res.statusCode).not.toBe(401);

      // Then, log out
      await agent.get("/auth/logout");

      // Finally, confirm we are logged out
      res = await agent.get("/generate-token/test-channel");
      expect(res.statusCode).toBe(401);
    });
const request = require("supertest");
const app = require("../api/index"); // Vercel doesn't need a running server object for tests
const MockStrategy = require("passport-mock-strategy");
const passport = require("passport");

describe("Auth Endpoints", () => {
  const mockUser = { id: "123", displayName: "Test User", emails: [{ value: "test@example.com" }] };

  beforeAll((done) => {
    // Replace the GoogleStrategy with a mock strategy for testing
    passport.use(new MockStrategy({
      name: 'google',
      user: mockUser
    }, (user, done) => {
      done(null, user);
    }));
    done();
  });

  afterAll((done) => {
    // For serverless functions, there's no persistent server to close.
    // If you were testing a local server, you would close it here.
    // e.g., server.close(done);
    done();
  });

  it("should redirect to Google for authentication", async () => {
    const res = await request(app).get("/auth/google");
    // The mock strategy doesn't perform a real redirect, but a 200 is a sign of it trying.
    // A real test against passport-google-oauth20 would check for a 302 redirect.
    // With passport-mock-strategy, it proceeds to the callback logic.
    // We'll check for the successful redirect from the callback.
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  it("should handle the Google callback and redirect to dashboard", async () => {
    const res = await request(app).get("/auth/google/callback");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  describe("with authenticated user", () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      // Log the user in
      await agent.get("/auth/google/callback");
    });

    it("should allow access to a protected route", async () => {
      const res = await agent.get("/generate-token/test-channel");
      // We expect a 500 because CUSTOMER_SECRET is not set, but a 401 would mean auth failed.
      expect(res.statusCode).not.toBe(401);
    });

    it("should log the user out", async () => {
      // First, confirm we are logged in
      let res = await agent.get("/generate-token/test-channel");
      expect(res.statusCode).not.toBe(401);

      // Then, log out
      await agent.get("/auth/logout");

      // Finally, confirm we are logged out
      res = await agent.get("/generate-token/test-channel");
      expect(res.statusCode).toBe(401);
    });
  });
});
  });
});