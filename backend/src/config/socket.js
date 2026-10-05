const { Server } = require('socket.io');
const { getAuth } = require('./firebaseAdmin');
const authService = require('../services/authService');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decodedToken = await getAuth().verifyIdToken(token);
      
      if (!decodedToken || !decodedToken.uid) {
        return next(new Error('Invalid authentication token'));
      }

      const user = await authService.findUserByFirebaseUid(decodedToken.uid);
      
      if (!user) {
        return next(new Error('Authenticated user is not linked to an application account'));
      }

      // Attach verified application user
      socket.data.appUser = {
        _id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        role: user.role
      };

      next();
    } catch (error) {
      next(new Error('Invalid or expired authentication token'));
    }
  });

  io.on('connection', (socket) => {
    const { _id } = socket.data.appUser;
    
    // Automatically join the user's private room
    const roomName = `user:${_id}`;
    socket.join(roomName);

    socket.on('disconnect', () => {
      socket.leave(roomName);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO
};
