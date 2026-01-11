import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  withCredentials: true,
  autoConnect: false, // ⛔ importantísimo
});

let socketIO = null;
export function getSocket() {
  if (!socketIO) {
    const base = import.meta.env.VITE_API_WS_BASE || 'http://localhost:3000';
    socketIO = io(base, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    });
  }
  return socket;
}
export function disconnectSocket() {
  if (socketIO) {
    socket.disconnect();
    socketIO = null;
  }
}
