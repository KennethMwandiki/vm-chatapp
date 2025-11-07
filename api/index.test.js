const request = require('supertest');

describe('API Endpoints', () => {

  // Keep a copy of the original environment variables
  const OLD_ENV = process.env;

  let app;

  beforeEach(() => {
    // Reset modules to ensure a fresh state for each test, including process.env
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });


  afterAll(() => {
    // Restore original environment variables after all tests
    process.env = OLD_ENV;
  });
  
  describe('GET /healthz', () => {
    test('should return a successful health check when Agora variables are set', async () => {
      process.env.AGORA_APP_ID = 'test-app-id';
      process.env.AGORA_CUSTOMER_SECRET = 'test-customer-secret';
      app = require('./index'); // Re-require app to use mocked env

      const response = await request(app).get('/healthz');
        expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        agora: 'ok',
        chat: 'ok',
        appId: 'test-app-id',
      });
    });


    test('should indicate Agora failure when credentials are not configured', async () => {
      app = require('./index'); // Re-require app with default (missing) env
      const response = await request(app).get('/healthz');
      expect(response.statusCode).toBe(200);
      expect(response.body.agora).toBe('fail');
      expect(response.body.status).toBe('ok');
      });
  });
});