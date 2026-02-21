import { io, Socket } from "socket.io-client";
import { useUserStore } from "../store/userStore";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const userStore = useUserStore();

    socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
      auth: {
        token: userStore.token, // 🔐 enviamos JWT
      },
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}