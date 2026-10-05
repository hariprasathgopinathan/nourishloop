const { initSocket } = require('./socket');
const { getAuth } = require('./firebaseAdmin');
const authService = require('../services/authService');
const { Server } = require('socket.io');

jest.mock('socket.io');
jest.mock('./firebaseAdmin');
jest.mock('../services/authService');

describe('Socket Configuration', () => {
  let mockServer;
  let mockIo;
  let mockUse;
  let mockOn;
  let mockNext;
  let mockSocket;

  beforeEach(() => {
    mockUse = jest.fn();
    mockOn = jest.fn();
    mockIo = {
      use: mockUse,
      on: mockOn
    };
    Server.mockImplementation(() => mockIo);

    mockServer = {};
    mockNext = jest.fn();
    mockSocket = {
      handshake: {
        auth: {}
      },
      data: {},
      join: jest.fn(),
      leave: jest.fn(),
      on: jest.fn()
    };

    getAuth.mockReturnValue({
      verifyIdToken: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('missing token rejected', async () => {
    initSocket(mockServer);
    const middleware = mockUse.mock.calls[0][0];

    await middleware(mockSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toBe('Authentication required');
  });

  test('invalid socket token rejected', async () => {
    initSocket(mockServer);
    const middleware = mockUse.mock.calls[0][0];

    mockSocket.handshake.auth.token = 'invalid-token';
    getAuth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await middleware(mockSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toBe('Invalid or expired authentication token');
  });

  test('valid Firebase socket token authenticates and appUser is derived from MongoDB', async () => {
    initSocket(mockServer);
    const middleware = mockUse.mock.calls[0][0];

    mockSocket.handshake.auth.token = 'valid-token';
    getAuth().verifyIdToken.mockResolvedValue({ uid: 'firebase-uid' });
    authService.findUserByFirebaseUid.mockResolvedValue({
      _id: 'mongo-id',
      firebaseUid: 'firebase-uid',
      role: 'DONOR'
    });

    await middleware(mockSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockSocket.data.appUser).toEqual({
      _id: 'mongo-id',
      firebaseUid: 'firebase-uid',
      role: 'DONOR'
    });
  });

  test('client cannot choose another room (auto-assigned based on _id)', () => {
    initSocket(mockServer);
    const connectionHandler = mockOn.mock.calls[0][1];

    mockSocket.data.appUser = { _id: 'mongo-id' };
    
    connectionHandler(mockSocket);

    expect(mockSocket.join).toHaveBeenCalledWith('user:mongo-id');
    // It does not use any room requested by the client, hardcoded to user:mongo-id
  });
});
