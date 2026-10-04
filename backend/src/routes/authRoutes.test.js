const request = require('supertest');
const app = require('../app');
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

jest.mock('../config/firebaseAdmin', () => ({
  auth: jest.fn()
}));

jest.mock('../models/User');

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TEST 7: Valid token + MongoDB User with matching firebaseUid -> 200', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    admin.auth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue({
      _id: 'mongo123',
      firebaseUid: 'firebase123',
      name: 'Test',
      email: 'test@test.com',
      role: 'NGO'
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe('mongo123');
    expect(response.body.data.user.firebaseUid).toBe('firebase123');
  });

  it('TEST 8: Valid token + no matching MongoDB User -> 404', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase404' });
    admin.auth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Authenticated Firebase user is not linked to an application account.');
  });

  it('TEST 9: Invalid token -> 401', async () => {
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));
    admin.auth.mockReturnValue({ verifyIdToken });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  it('TEST 10: Missing token -> 401', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    expect(response.status).toBe(401);
  });
});
