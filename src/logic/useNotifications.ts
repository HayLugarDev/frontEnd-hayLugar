// composables/useNotifications.ts
import { io } from 'socket.io-client';
import { onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../store/userStore';

export function useNotifications() {
  const userStore = useUserStore();

  const socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000');

  socket.on("connect", () => {
    console.log("🔌 Conectado", socket.id);

    socket.emit("subscribe", {
      user_id: userStore.user.id // <-- clave para que el handler lo meta en `reservation:ID`
    });
  });

  socket.on("notification", (data) => {
    userStore.addNotification(data.message);
    console.log("📢 Notificación recibida:", data.message);
  });


}
