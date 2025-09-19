import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store/userStore';
import { watch } from 'vue';

let socket: Socket | null = null;

export function useNotifications() {
  const userStore = useUserStore();

  watch(
    () => userStore.user,
    (user) => {
      if (user && user.id && !socket) {
        socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000');

        socket.on("connect", () => {
          console.log("🔌 Conectado", socket.id);
          socket.emit("subscribe", { user_id: user.id });
        });

        socket.on("notification", (data) => {
          userStore.addNotification(data);
          console.log("📢 Notificación recibida:", data);
        });
      }
    },
    { immediate: true }
  );
}
