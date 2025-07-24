<template>
    <div class="relative">
        <button @click="toggleMenu"
            class="relative w-12 h-12 flex items-center justify-center hover:shadow-xl hover:bg-white rounded-full transition duration-200">
            <font-awesome-icon icon="bell" class="text-xl text-gray-700 dark:text-white" />
            <span v-if="hasNotifications && !viewNotification"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping">
            </span>
            <div v-if="showNotificationBubble"
              class="absolute right-10 top-1 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in">
              Tienes notificaciones!
            </div>
        </button>

        <!-- Dropdown de notificaciones -->
        <ul v-if="openMenu"
            class="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-50 w-64 max-h-64 overflow-y-auto animate-fade-in">
            <li v-if="notifications.length === 0" class="p-4 text-sm text-gray-500 text-center">
                No hay notificaciones.
            </li>
            <li v-for="(notif, index) in notifications" :key="index"
                class="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-default border-b last:border-b-0">
                <button @click="router.push('/profile')">{{ notif }}</button>
            </li>
            <li v-if="notifications.length" @click="clearAll"
                class="text-center text-blue-600 hover:underline text-sm py-2 cursor-pointer">
                Limpiar todas
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../store/userStore';
import router from '../../../router';

const openMenu = ref(false);
const userStore = useUserStore();
const showNotificationBubble = ref(false);
const viewNotification = ref(false);

const notifications = computed(() => userStore.notifications);
const hasNotifications = computed(() => notifications.value.length > 0);

watch(
  () => userStore.notifications.length,
  (newVal) => {
    if (newVal > 0) {
      showNotificationBubble.value = true;

      setTimeout(() => {
        showNotificationBubble.value = false;
      }, 4000); // Oculta el globo tras 4 segundos
    }
  }
);

const toggleMenu = () => {
    openMenu.value = !openMenu.value;
    if(!viewNotification.value) {
      viewNotification.value  = !viewNotification.value;
    }
};

const clearAll = () => {
    userStore.clearNotifications();
    openMenu.value = false;
};

</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>