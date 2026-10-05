const request = require('supertest');
const app = require('./app');
const User = require('./models/User');
const { getAuth } = require('./config/firebaseAdmin');

jest.mock('./config/firebaseAdmin', () => ({
  getAuth: jest.fn()
}));

jest.mock('./models/User');
jest.mock('./models/Donation');
jest.mock('./services/locationService');
jest.mock('./services/notificationService');
jest.mock('./config/socket', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  }))
}));

describe('Security and Hardening Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupAuthMock = (role = 'DONOR', uid = 'test-uid') => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid, email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue({
      _id: 'mongo123',
      firebaseUid: uid,
      role: role,
      latitude: 10,
      longitude: 10
    });
  };

  test('Protected endpoint without token -> 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('Protected endpoint with invalid token -> 401', async () => {
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));
    getAuth.mockReturnValue({ verifyIdToken });

    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });

  test('DONOR accessing NGO route -> 403', async () => {
    setupAuthMock('DONOR');
    const res = await request(app).get('/api/donations/nearby').set('Authorization', 'Bearer token');
    expect(res.status).toBe(403);
  });

  test('NGO accessing DONOR route -> 403', async () => {
    setupAuthMock('NGO');
    const res = await request(app).post('/api/donations').set('Authorization', 'Bearer token').send({
      foodName: 'Test',
      category: 'Test',
      quantity: 1,
      unit: 'kg',
      pickupAddress: 'Test',
      latitude: 10,
      longitude: 10,
      availableUntil: new Date(Date.now() + 10000).toISOString()
    });
    expect(res.status).toBe(403);
  });

  test('Invalid geographic boundaries are rejected (latitude)', async () => {
    setupAuthMock('DONOR');
    const res = await request(app).post('/api/donations').set('Authorization', 'Bearer token').send({
      foodName: 'Test',
      category: 'Test',
      quantity: 1,
      unit: 'kg',
      pickupAddress: 'Test',
      latitude: 100, // Invalid
      longitude: 10,
      availableUntil: new Date(Date.now() + 10000).toISOString()
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid geographic/);
  });

  test('Invalid geographic boundaries are rejected (profile location)', async () => {
    setupAuthMock('DONOR');
    const res = await request(app).patch('/api/auth/profile/location').set('Authorization', 'Bearer token').send({
      latitude: 'abc', // Invalid
      longitude: 10,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid latitude or longitude/);
  });
});
