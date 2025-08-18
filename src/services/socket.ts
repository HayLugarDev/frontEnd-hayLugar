// src/services/socket.ts
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
export function getSocket(): Socket {
  if (!socket) {
    const base = import.meta.env.VITE_API_WS_BASE || 'http://localhost:3000';
    socket = io(base, {
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
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
