import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000', {
      withCredentials: true,
      autoConnect: false, // 🔒 CLAVE
      transports: ['websocket'], // evita polling raro
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
