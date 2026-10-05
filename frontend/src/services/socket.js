import { io } from 'socket.io-client';
import { auth } from '../config/firebase';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const connectSocket = async () => {
  if (socket?.connected) return socket;

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to connect to socket');
  }

  // Obtain current fresh token
  const token = await currentUser.getIdToken(true);

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
    });

    // Automatically refresh token on reconnect attempt
    socket.on('reconnect_attempt', async () => {
      try {
        const freshUser = auth.currentUser;
        if (freshUser) {
          const freshToken = await freshUser.getIdToken(true);
          socket.auth.token = freshToken;
        }
      } catch (error) {
        console.error('Error refreshing token for socket reconnection:', error);
      }
    });
  } else {
    // If socket exists but was disconnected, update token before reconnecting
    socket.auth.token = token;
  }

  socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
