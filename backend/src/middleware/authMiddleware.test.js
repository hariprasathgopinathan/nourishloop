const { requireAuth, requireAppUser, requireRole } = require('./authMiddleware');
const { getAuth } = require('../config/firebaseAdmin');

jest.mock('../config/firebaseAdmin', () => ({
  getAuth: jest.fn()
}));

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('TEST 1: No Authorization header -> 401', async () => {
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Authentication required' });
  });

  it('TEST 2: Malformed Authorization header -> 401', async () => {
    req.headers.authorization = 'Bearer'; // no token
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('TEST 3: Bearer token with invalid verification -> 401', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));
    getAuth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(verifyIdToken).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired authentication token' });
  });

  it('TEST 4: Valid token -> req.user contains verified uid', async () => {
    req.headers.authorization = 'Bearer valid-token';
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    getAuth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe('firebase123');
    expect(req.user.email).toBe('test@test.com');
  });

  it('TEST 5: Valid token + extra decoded fields -> only safe fields are attached', async () => {
    req.headers.authorization = 'Bearer valid-token';
    const verifyIdToken = jest.fn().mockResolvedValue({ 
      uid: 'firebase123', 
      email: 'test@test.com',
      privateKey: 'secret' 
    });
    getAuth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.uid).toBe('firebase123');
    expect(req.user.email).toBe('test@test.com');
    expect(req.user.privateKey).toBeUndefined();
  });

  it('TEST 6: Firebase verification throws unexpected error -> safe 401/internal auth error', async () => {
    req.headers.authorization = 'Bearer some-token';
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Firebase internal crash'));
    getAuth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired authentication token' });
  });
});

const authService = require('../services/authService');
jest.mock('../services/authService');

describe('requireAppUser middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { uid: 'firebase123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Missing req.user -> 401', async () => {
    req.user = null;
    await requireAppUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Valid Firebase UID maps to User -> req.appUser populated', async () => {
    authService.findUserByFirebaseUid.mockResolvedValue({
      _id: 'mongo123',
      firebaseUid: 'firebase123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'DONOR'
    });
    await requireAppUser(req, res, next);
    expect(req.appUser).toBeDefined();
    expect(req.appUser._id).toBe('mongo123');
    expect(req.appUser.role).toBe('DONOR');
    expect(next).toHaveBeenCalled();
  });

  it('Firebase UID not mapped -> 404', async () => {
    authService.findUserByFirebaseUid.mockResolvedValue(null);
    await requireAppUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('requireRole middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { appUser: { role: 'DONOR' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Role matches -> next called', () => {
    requireRole('DONOR')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Role does not match -> 403', () => {
    requireRole('NGO')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('No appUser -> 401', () => {
    req.appUser = null;
    requireRole('DONOR')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
