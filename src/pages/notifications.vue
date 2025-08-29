<template>
    <MainHeader />
    <div class="min-h-screen bg-secondary px-6 py-20 md:py-6">
        <BackButton class="md:hidden" />
        <section class="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-bold text-primary mb-4 flex space-x-2 items-center">
                <font-awesome-icon icon="history" class="mr-2" />
                Notificaciones
            </h2>
            <div v-if="loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse flex flex-col space-y-2 p-6 bg-gray-100 rounded-xl">
                    <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <ul v-else-if="notifications.length" class="divide-y divide-gray-300 space-y-2">
                <li v-for="(notification, index) in notifications" :key="index"
                    class="border border-yellow-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all bg-gray-50 space-y-3">

                    <div class="flex flex-row justify-between items-center">
                        <!-- Fecha -->
                        <p>
                            <font-awesome-icon icon="calendar-alt" class="mr-2 text-primary" />
                            <strong class="text-gray-800 font-bold">Recibida: {{ formatDate(notification.changed_at)
                            }}</strong>
                        </p>
                        <font-awesome-icon @click="openConfirm(notification, 'delete')" icon="fa-regular fa-trash-can"
                            class="text-lg cursor-pointer" />
                    </div>

                    <!-- Mensaje -->
                    <p class="whitespace-pre-line text-gray-700">
                        {{ notification.message }}
                    </p>

                    <div class="flex flex-row justify-between items-center">
                        <p v-if="notification.id" :class="getStatusColor(notification.reservation_status)">
                            {{ getSpanishReservationStatus(notification.reservation_status) }}
                        </p>

                        <!-- owner -->
                        <!-- Si aún no fue aceptada -->
                        <button
                            v-if="notification.reservation_status !== 'approved' && notification.reservation_role === 'owner'"
                            @click="goToIncomingReservations"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                            Verificar ahora
                        </button>

                        <!-- Si ya está aceptada -->
                        <button v-else-if="notification.reservation_status === 'approved' && notification.reservation_role === 'owner'"
                         class="px-4 py-2 bg-primary text-white rounded-lg">
                            Reserva aprobada
                        </button>

                        <!-- client -->
                        <button
                            v-if="notification.reservation_role === 'client'"
                            @click="goToReservations"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                            Ir a detalles de reserva
                        </button>
                    </div>

                </li>
            </ul>

            <p v-else class="text-gray-500">No hay notificaciones.</p>
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

function openConfirm(notification: any, action: 'approve' | 'delete') {
    selectedNotification.value = notification;

    if (action === 'approve') {
        modalConfig.value = {
            message: '¿Estás seguro de que quieres aprobar esta reserva?',
            buttonText: 'Aceptar',
            onConfirm: () => approveReservation()
        };
    }

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

const approveReservation = async () => {
    if (!selectedNotification.value) return;

    try {
        await api.put(`/reservations/${selectedNotification.value.reservation_id}/status`,
            { status: 'approved' },
            { withCredentials: true }
        );
        await api.put(`/notifications/${selectedNotification.value.id}/status`,
            { status: 'approved' },
            { withCredentials: true }
        );

        notifications.value = notifications.value.map(n =>
            n.id === selectedNotification.value.id ? { ...n, status: 'approved' } : n
        );

        showConfirmModal.value = false;
    } catch (error) {
        console.error("Error al aprobar reserva:", error);
    }
};

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
