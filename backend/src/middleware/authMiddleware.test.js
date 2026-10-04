const { requireAuth } = require('./authMiddleware');
const admin = require('../config/firebaseAdmin');

jest.mock('../config/firebaseAdmin', () => ({
  auth: jest.fn()
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
    admin.auth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(verifyIdToken).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired authentication token' });
  });

  it('TEST 4: Valid token -> req.user contains verified uid', async () => {
    req.headers.authorization = 'Bearer valid-token';
    const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'firebase123', email: 'test@test.com' });
    admin.auth.mockReturnValue({ verifyIdToken });
    
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
    admin.auth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.uid).toBe('firebase123');
    expect(req.user.email).toBe('test@test.com');
    expect(req.user.privateKey).toBeUndefined();
  });

  it('TEST 6: Firebase verification throws unexpected error -> safe 401/internal auth error', async () => {
    req.headers.authorization = 'Bearer some-token';
    const verifyIdToken = jest.fn().mockRejectedValue(new Error('Firebase internal crash'));
    admin.auth.mockReturnValue({ verifyIdToken });
    
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired authentication token' });
  });
});
