<template>
  <div v-if="userStore.user" class="relative">
    <!-- Botón de campana -->
    <button @click="toggleMenu"
            class="relative w-12 h-12 flex items-center justify-center hover:shadow-xl bg-gray-50 md:bg-secondary rounded-full border-2 md:border-none transition duration-200">
      <font-awesome-icon icon="bell" class="text-xl text-gray-700 " />
      <!-- Punto rojo si hay notificaciones sin leer -->
      <span v-if="hasUnreadNotifications && !viewNotification"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping">
      </span>
    </button>

    <!-- Dropdown de notificaciones -->
    <ul v-if="openMenu"
        class="absolute right-0 mt-2 text-md md:text-xs text-gray-800 bg-gray-50 border-2 rounded-xl z-50 w-60 max-h-64 overflow-y-auto animate-fade-in">
      <li v-if="pendingNotifications.length === 0" class="p-4 text-center">
        No hay notificaciones nuevas.
      </li>
      <li v-for="notification in pendingNotifications" :key="notification.id"
          class="border border-gray-300 bg-gray-200 rounded-xl p-3 flex justify-between items-start cursor-pointer"
          @click="openNotification(notification.id)">
        <div class="flex-1">
          <p class="text-gray-800">{{ truncate(notification.message, 65) }}</p>
          <small class="text-gray-500">
            {{ formatDate(notification.changed_at) }}
          </small>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../../store/userStore';
import { useRouter } from 'vue-router';

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
  openMenu.value = !openMenu.value;
};

// Abrir notificación completa
const openNotification = (id: number) => {
  userStore.markAsRead(id); // Marcamos como leída en el store
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
