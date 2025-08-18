<template>
    <div v-if="userStore.user" class="relative">
        <button @click="toggleMenu"
            class="relative w-12 h-12 flex items-center justify-center hover:shadow-xl hover:bg-gray-50 rounded-full transition duration-200">
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
            class="absolute right-0 mt-2 text-xs text-gray-800 bg-gray-100 border-2 border-gray-300 rounded-xl shadow-lg z-50 w-64 max-h-64 overflow-y-auto animate-fade-in">
            <li v-if="notifications.length === 0" class="p-4 text-center">
                No hay notificaciones.
            </li>
            <li v-for="notification in notifications" :key="notification.id"
                class="border border-gray-300 bg-gray-200 rounded-xl p-2 flex justify-between items-start cursor-pointer"
                @click="openNotification">
                <div class="flex-1">
                    <!-- Mostramos solo preview -->
                    <p class="text-gray-800">{{ truncate(notification.message, 65) }}</p>
                    <small class="text-gray-500">
                        {{ new Date(notification.changed_at).toLocaleString() }}
                    </small>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../store/userStore';
import { useNotifications } from '../../../logic/useNotifications';
import { getNotificationsByUserId } from '../../../services/notificationService';
import router from '../../../router';

const openMenu = ref(false);
const userStore = useUserStore();
const showNotificationBubble = ref(false);
const viewNotification = ref(false);

const notifications = computed(() => userStore.notifications);
const hasNotifications = computed(() => notifications.value.length > 0);

useNotifications();

watch(
    () => userStore.user,
    async (newUser) => {
        if (newUser?.id) {
            const notificationsData = await getNotificationsByUserId(newUser.id);

            // Guardamos las notificaciones en el store
            userStore.setNotifications(notificationsData);

            // Determinar si hay notificaciones pendientes
            notificationsData.some(n => n.status !== 'read');
            viewNotification.value = false;
        }
    }
);


// Función para recortar texto
const truncate = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
};

const toggleMenu = () => {
    openMenu.value = !openMenu.value;
};

// Abrir notificación completa
const openNotification = () => {
    //selectedNotification.value = notification;
    //userStore.markAsRead(notification.id); // se marca como leída recién aquí
    if (!viewNotification.value) {
        viewNotification.value = !viewNotification.value;
    }
    router.push('/profile?section=notifications');
};
</script>
