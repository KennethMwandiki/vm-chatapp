const request = require('supertest');
const MockStrategy = require('passport-mock-strategy');

describe('API Endpoints', () => {

  // Keep a copy of the original environment variables
  const OLD_ENV = process.env;

  let app;
  let passport;

  beforeEach(() => {
    // Reset modules to ensure a fresh state for each test, including process.env
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // Mock Service Adapters to prevent real API calls
    jest.mock('./services/facebookService', () => ({
      startPageStream: jest.fn().mockResolvedValue({ id: 'fb-123', stream_url: 'rtmp://fb-sim' }),
      startInstagramStream: jest.fn().mockResolvedValue({ id: 'ig-123', stream_url: 'rtmp://ig-sim' })
    }));
    jest.mock('./services/youtubeService', () => ({
      startStream: jest.fn().mockResolvedValue({ id: 'yt-123', stream_url: 'rtmp://yt-sim' })
    }));
    jest.mock('./services/linkedinService', () => ({
      startStream: jest.fn().mockResolvedValue({ id: 'li-123', stream_url: 'rtmp://li-sim' })
    }));
    jest.mock('./services/twitterService', () => ({
      startStream: jest.fn().mockResolvedValue({ id: 'tw-123', stream_url: 'rtmp://tw-sim' })
    }));
    jest.mock('./services/wechatService', () => ({
      startStream: jest.fn().mockResolvedValue({ id: 'wx-123', stream_url: 'rtmp://wx-sim' })
    }));
    jest.mock('./services/genericRtmpService', () => ({
      getConfigFor: jest.fn((platform) => {
        if (platform === 'TikTok') return { url: 'rtmp://tiktok', key: 'key' };
        return null;
      }),
      startStream: jest.fn().mockReturnValue({ stream_url: 'rtmp://generic', message: 'Generic Start' })
    }));

    // Mock passport before requiring the app
    passport = require('passport');
    app = require('./index');
  });


  afterAll(() => {
    jest.resetAllMocks();
    // Restore original environment variables after all tests
    process.env = OLD_ENV;
  });

  describe('GET /healthz', () => {
    test('should return a successful health check when Agora variables are set', async () => {
      process.env.AGORA_APP_ID = 'test-app-id';
      process.env.AGORA_CUSTOMER_SECRET = 'test-customer-secret';

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
      const response = await request(app).get('/healthz');
      expect(response.statusCode).toBe(200);
      expect(response.body.agora).toBe('fail');
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Authentication Flow', () => {
    beforeEach(() => {
      // Mock the GoogleStrategy
      passport.use(new MockStrategy({
        name: 'google',
        user: { id: '123', displayName: 'Test User', emails: [{ value: 'test@example.com' }] }
      }, (user, done) => {
        done(null, user);
      }));
    });

    test('GET /auth/google/callback should redirect and establish a session', async () => {
      const agent = request.agent(app); // Use agent to handle cookies/session
      const response = await agent.get('/auth/google/callback');

      expect(response.statusCode).toBe(302); // Redirects to /dashboard
      expect(response.headers.location).toBe('/dashboard');

      // Verify session is created by accessing a protected route
      process.env.AGORA_APP_ID = 'test-app-id';
      process.env.AGORA_CUSTOMER_SECRET = 'test-secret';
      const tokenResponse = await agent.get('/generate-token/test-channel');
      expect(tokenResponse.statusCode).toBe(200);
      expect(tokenResponse.body).toHaveProperty('token');
    });

    test('GET /auth/logout should clear the session and redirect', async () => {
      const agent = request.agent(app);
      await agent.get('/auth/google/callback'); // First, log in
      const logoutResponse = await agent.get('/auth/logout');
      expect(logoutResponse.statusCode).toBe(302); // Redirects to /
      expect(logoutResponse.headers.location).toBe('/');

      // Verify session is destroyed
      const protectedResponse = await agent.get('/generate-token/test-channel');
      expect(protectedResponse.statusCode).toBe(401);
    });

    test('GET /generate-token should fail for unauthenticated users', async () => {
      const response = await request(app).get('/generate-token/test-channel');
      expect(response.statusCode).toBe(401);
    });
  });
});