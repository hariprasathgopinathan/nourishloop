const request = require('supertest');
const app = require('../app');
const { getAuth } = require('../config/firebaseAdmin');
const User = require('../models/User');

jest.mock('../config/firebaseAdmin', () => ({
  getAuth: jest.fn()
}));

jest.mock('../models/User');

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TEST 7: Valid token + MongoDB User with matching firebaseUid -> 200', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
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
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Authenticated Firebase user is not linked to an application account.');
  });

  it('TEST 8b: legacy user found by matching email and backfills firebaseUid -> 200', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'new_firebase_uid', email: 'legacy@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    const mockLegacyUser = {
      _id: 'mongo_legacy',
      email: 'legacy@test.com',
      role: 'NGO',
      save: jest.fn().mockResolvedValue(true)
    };
    
    // First findOne (firebaseUid) returns null, second (email) returns mockLegacyUser
    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockLegacyUser);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockLegacyUser.firebaseUid).toBe('new_firebase_uid');
    expect(mockLegacyUser.save).toHaveBeenCalled();
  });

  it('TEST 9: Invalid token -> 401', async () => {
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));
    getAuth.mockReturnValue({ verifyIdToken });

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

describe('POST /api/auth/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Valid DONOR profile', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_donor', email: 'donor@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mongo_donor',
      firebaseUid: 'firebase_donor',
      email: 'donor@test.com',
      name: 'Donor Name',
      phone: '1234567890',
      role: 'DONOR'
    });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: 'Donor Name',
        phone: '1234567890',
        role: 'DONOR'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe('DONOR');
  });

  it('2. Valid NGO profile', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_ngo', email: 'ngo@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mongo_ngo',
      firebaseUid: 'firebase_ngo',
      email: 'ngo@test.com',
      name: 'NGO Name',
      phone: '1234567890',
      role: 'NGO',
      organizationName: 'Org'
    });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: 'NGO Name',
        phone: '1234567890',
        role: 'NGO',
        organizationName: 'Org'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe('NGO');
  });

  it('3. Missing name', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ phone: '123', role: 'DONOR' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name is required');
  });

  it('4. Missing phone', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test', role: 'DONOR' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Phone number is required');
  });

  it('5. Missing authenticated email', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123' }); // No email
    getAuth.mockReturnValue({ verifyIdToken });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test', phone: '123', role: 'DONOR' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Verified Firebase email is required to create a profile.');
  });

  it('6. Invalid role', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test', phone: '123', role: 'ADMIN' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Role must be either DONOR or NGO');
  });

  it('7. Existing firebaseUid', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_exist', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    // First findOne is for firebaseUid
    User.findOne.mockResolvedValueOnce({ firebaseUid: 'firebase_exist' });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test', phone: '123', role: 'DONOR' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Existing application profile found and linked');
  });

  it('8b. Existing firebaseUid reuses profile without duplication', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_exist', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValueOnce({ _id: 'exist_mongo', firebaseUid: 'firebase_exist', email: 'test@test.com' });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test', phone: '123', role: 'DONOR' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Existing application profile found and linked');
  });

  it('9 & 10 & 13 & 14. Firebase UID and Email taken from req.user, tampered body ignored', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'REAL_UID', email: 'real@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);
    
    let savedUser = null;
    User.mockImplementation(function(data) {
      savedUser = data;
      this.save = jest.fn().mockResolvedValue({
        _id: 'mongo123',
        ...data
      });
    });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ 
        firebaseUid: 'FAKE_UID', 
        email: 'fake@test.com',
        name: 'Test', 
        phone: '123', 
        role: 'DONOR' 
      });

    expect(response.status).toBe(201);
    expect(savedUser.firebaseUid).toBe('REAL_UID');
    expect(savedUser.email).toBe('real@test.com');
  });

  it('11. Optional organizationName for NGO', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_ngo', email: 'ngo@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);
    let savedUser = null;
    User.mockImplementation(function(data) {
      savedUser = data;
      this.save = jest.fn().mockResolvedValue({ _id: 'mongo123', ...data });
    });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'NGO Name', phone: '1234567890', role: 'NGO', organizationName: 'My NGO Org' });

    expect(response.status).toBe(201);
    expect(savedUser.organizationName).toBe('My NGO Org');
  });

  it('12. DONOR without organizationName is valid', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase_donor', email: 'donor@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue(null);
    let savedUser = null;
    User.mockImplementation(function(data) {
      savedUser = data;
      this.save = jest.fn().mockResolvedValue({ _id: 'mongo123', ...data });
    });

    const response = await request(app)
      .post('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Donor Name', phone: '1234567890', role: 'DONOR' });

    expect(response.status).toBe(201);
    expect(savedUser.organizationName).toBeUndefined();
  });
});

describe('PATCH /api/auth/profile/location', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Valid update changes the authenticated users own profile', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    // Auth middleware finding user
    User.findOne.mockResolvedValue({
      _id: 'mongo123',
      firebaseUid: 'firebase123',
      role: 'NGO'
    });

    const mockUser = {
      _id: 'mongo123',
      firebaseUid: 'firebase123',
      name: 'NGO Name',
      role: 'NGO',
      latitude: 10,
      longitude: 20,
      save: jest.fn().mockResolvedValue({
        _id: 'mongo123',
        firebaseUid: 'firebase123',
        name: 'NGO Name',
        role: 'NGO',
        latitude: 12.34,
        longitude: 56.78
      })
    };

    User.findById.mockResolvedValue(mockUser);

    const response = await request(app)
      .patch('/api/auth/profile/location')
      .set('Authorization', 'Bearer valid-token')
      .send({ latitude: 12.34, longitude: 56.78 });

    expect(response.status).toBe(200);
    expect(response.body.data.user.latitude).toBe(12.34);
    expect(response.body.data.user.longitude).toBe(56.78);
    expect(User.findById).toHaveBeenCalledWith('mongo123');
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('Invalid latitude/longitude values are rejected', async () => {
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    User.findOne.mockResolvedValue({
      _id: 'mongo123',
      firebaseUid: 'firebase123',
      role: 'NGO'
    });

    const response = await request(app)
      .patch('/api/auth/profile/location')
      .set('Authorization', 'Bearer valid-token')
      .send({ latitude: 91, longitude: 56.78 }); // 91 is invalid

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid latitude or longitude values');
  });
});
