<template>
    <MainHeader />
    <div class="min-h-screen bg-secondary md:px-6 py-20 md:py-6">
        <BackButton class="md:hidden" />
        <section class="bg-white p-4 md:p-8 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-bold text-primary mb-4 flex space-x-2 items-center">
                <font-awesome-icon icon="history" class="mr-2" />
                Notificaciones
            </h2>
            <div v-if="loading" class="space-y-4">
                <ItemSkeleton />
            </div>
            <ul v-else-if="notifications.length" class="grid gap-6">
                <li v-for="(notification, index) in notifications" :key="index"
                    class="flex flex-col gap-2 border border-yellow-200 rounded-2xl bg-gradient-to-b from-yellow-50 to-white shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <font-awesome-icon
                                :icon="notification.reservation_status === 'approved' ? 'check-circle' : 'bell'"
                                class="text-2xl"
                                :class="notification.reservation_status === 'approved' ? 'text-green-500' : 'text-primary'" />
                            <div>
                                <span class="font-bold text-gray-800 text-lg">{{
                                    getSpanishReservationStatus(notification.reservation_status) }}</span>
                                <span class="block text-xs text-gray-500">Recibida: {{
                                    formatDate(notification.changed_at) }}</span>
                            </div>
                        </div>
                        <font-awesome-icon @click="openConfirm(notification, 'delete')" icon="fa-regular fa-trash-can"
                            class="text-lg cursor-pointer text-gray-400 hover:text-red-500 transition"
                            title="Eliminar notificación" />
                    </div>

                    <p class="whitespace-pre-line text-gray-700 mt-2 text-base">
                        {{ notification.message }}
                    </p>

                    <div class="flex flex-row justify-end items-center gap-2 mt-2">
                        <!-- owner -->
                        <button
                            v-if="notification.reservation_status !== 'approved' && notification.reservation_role === 'owner'"
                            @click="goToIncomingReservations"
                            class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold">
                            Verificar ahora
                        </button>
                        <button
                            v-else-if="notification.reservation_status === 'approved' && notification.reservation_role === 'owner'"
                            @click="goToIncomingReservations"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-semibold">
                            Ir a reserva
                        </button>
                        <!-- client -->
                        <button v-if="notification.reservation_role === 'client'" @click="goToReservations"
                            class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold">
                            Ir a reserva
                        </button>
                    </div>
                </li>
            </ul>

            <p v-else-if="!loading" class="text-gray-500">No hay notificaciones.</p>
        </section>

        <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
            @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';
import { getSpanishReservationStatus } from '../utils/ReservationNotificationTraslation';
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from '../components/common/BackButton.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import { statusColors } from '../logic/useReservationMessages';
import loadIcon from "../assets/load-icon_secondary.svg";
import ItemSkeleton from '../components/layout/skeletons/ItemSkeleton.vue';

const router = useRouter();
const notifications = ref([]);
const userStore = useUserStore();
const showConfirmModal = ref(false);
const loading = ref(true);

const modalConfig = ref({
    message: '',
    buttonText: 'Aceptar',
    onConfirm: () => { }
});

const selectedNotification = ref<any>(null);

function openConfirm(notification: any, action: 'delete') {
    selectedNotification.value = notification;

    if (action === 'delete') {
        modalConfig.value = {
            message: '¿Eliminar esta notificación?',
            buttonText: 'Eliminar',
            onConfirm: () => deleteNotification(notification.id)
        };
    }

    showConfirmModal.value = true;
}

const getStatusColor = (status: string) => statusColors[status] || 'text-gray-500';

const deleteNotification = async (notification_id: number) => {
    try {
        await api.delete(`/notifications/${notification_id}`,
            { withCredentials: true }
        );
        notifications.value = notifications.value.filter(n => n.id !== notification_id);
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
    }
}

const fetchNotifications = async () => {
    loading.value = true;
    if (!userStore.user) {
        await userStore.fetchUser()
    }
    const userId = userStore.user?.id;
    if (!userId) {
        console.error("No se encontró el ID de usuario en userStore");
        loading.value = false;
        return;
    }
    try {
        const response = await api.get(`notifications/${userId}`);
        notifications.value = response.data;
        console.log(notifications.value);

        // 🚀 Marcar como leídas
        const unreadIds = notifications.value
            .filter(n => n.status === 'pending')
            .map(n => n.id);

        if (unreadIds.length > 0) {
            await markNotificationsAsRead(unreadIds);
        }
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
    }
    loading.value = false;
};

const goToReservations = () => {
    return router.push('/profile?section=reservas');
};

const goToIncomingReservations = () => {
    return router.push('/profile?section=reservas-entrantes');
};


const markNotificationsAsRead = async (ids: number[]) => {
    try {
        await api.put(`notifications/mark-read`, ids);
        notifications.value = notifications.value.map(n => ({
            ...n,
            status: 'read'
        }));
    } catch (error) {
        console.error("Error al marcar como leídas", error);
    }
};

onMounted(fetchNotifications);

const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
};
</script>
