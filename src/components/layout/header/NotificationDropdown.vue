<template>
  <div v-if="userStore.user" class="relative">
    <!-- Botón de campana -->
    <button @click="toggleMenu"
            class="hidden relative w-12 h-12 sm:flex items-center justify-center rounded-full transition duration-200 hover:shadow-xl">
      <font-awesome-icon icon="fa-regular fa-bell" class="text-xl text-gray-300 " />
      <!-- Punto rojo si hay notificaciones sin leer -->
      <span v-if="hasUnreadNotifications && !viewNotification"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping">
      </span>
    </button>

    <!-- Dropdown de notificaciones -->
    <ul v-if="openMenu"
        class="absolute right-0 mt-2 text-md text-gray-200 rounded-xl z-50 w-60 max-h-64 overflow-y-auto animate-fade-in">
      <li v-if="pendingNotifications.length === 0" class="p-4 text-center bg-gray-900/90 border rounded-xl">
        No hay notificaciones nuevas.
      </li>
      <li v-for="notification in pendingNotifications" :key="notification.id"
          class="text-gray-200 bg-gray-900/90 border-2 rounded-xl p-3 flex justify-between items-start cursor-pointer"
          @click="openNotification(notification.id)">
        <div class="flex-1">
          <p class="text-gray-300">{{ truncate(notification.message, 65) }}</p>
          <small class="text-gray-400">
            {{ formatDate(notification.changed_at) }}
          </small>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import { useRouter } from 'vue-router';
import { showToast } from '../../../utils/toast';

const openMenu = ref(false);
const viewNotification = ref(false);
const userStore = useUserStore();
const router = useRouter();

// Computed para las notificaciones
const pendingNotifications = computed(() =>
  userStore.notifications.filter(n => n.status === 'pending')
);

const hasUnreadNotifications = computed(() =>
  pendingNotifications.value.some(n => n.status === 'pending')
);

// Toggle del dropdown
const toggleMenu = () => {
  router.push('/notifications');

  if (hasUnreadNotifications.value) {
    userStore.markAllAsRead();
  } else {
    // flag para animar en la page
    sessionStorage.setItem('blinkNotification', 'true');
  }
};

// Abrir notificación completa
const openNotification = (id: number) => {
  userStore.markAllAsRead(); // Marcamos como leídas en el store
  router.push('/notifications');
};

// Función para recortar texto
const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
