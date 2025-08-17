<template>
    <section class="bg-white p-8 rounded-lg shadow-lg mb-8 md:w-2/3">
        <h2 class="text-2xl font-bold text-primary mb-4 flex space-x-2 items-center">
            <font-awesome-icon icon="history" class="mr-2" />
            Notificaciones
        </h2>
        <ul v-if="notifications.length" class="divide-y divide-gray-300">
            <li v-for="(notification, index) in notifications" :key="index"
                class="border border-yellow-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all bg-gray-50 space-y-1">
                <p class="flex items-center">
                    <font-awesome-icon icon="calendar-alt" class="mr-2 text-primary" />
                    <strong class="text-gray-800">{{ formatDate(notification.changed_at) }}</strong>
                </p>
                <p class="flex items-center">
                    {{ notification.message }}
                </p>
            </li>
        </ul>
        <p v-else class="text-gray-500">No hay notificaciones.</p>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import api from '../../../services/apiService';

const notifications = ref([]);
const userStore = useUserStore();

const fetchNotifications = async () => {
    const userId = userStore.user?.id;
    if (!userId) {
        console.error("No se encontró el ID de usuario en userStore");
        return;
    }
    try {
        const response = await api.get(`notifications/${userId}`);
        notifications.value = response.data;

        // 🚀 Marcar todas como leídas
        const unreadIds = notifications.value
            .filter(n => n.status === 'pending')
            .map(n => n.id);

        if (unreadIds.length > 0) {
            await markNotificationsAsRead(unreadIds);
        }

    } catch (error) {
        console.error("Error al obtener historial de reservas", error);
    }
};

const markNotificationsAsRead = async (ids: number[]) => {
    try {
        // Aquí depende de tu backend, puede ser PATCH o PUT
        await api.put(`notifications/mark-read`, ids);
        // Opcional: actualizar localmente
        notifications.value = notifications.value.map(n => ({
            ...n,
            status: 'read'
        }));
    } catch (error) {
        console.error("Error al marcar notificaciones como leídas", error);
    }
};

onMounted(async () => {
    await fetchNotifications();
});

const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
};
</script>
