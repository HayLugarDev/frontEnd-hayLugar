<template>
    <MainHeader />
    <div class="min-h-screen bg-secondary md:px-6 py-20 md:py-8">

        <section class="bg-white rounded-2xl shadow-lg p-4 md:p-8 max-w-3xl mx-auto border border-gray-100">
            <!-- Título -->
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
                    <font-awesome-icon icon="history" />
                    Notificaciones
                </h2>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <ItemSkeleton />
            </div>

            <!-- Lista -->
            <ul v-else-if="notifications.length" class="flex flex-col gap-4">
                <li v-for="(notification, index) in notifications" :key="index"
                    class="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-5 flex flex-col gap-3">
                    <!-- Header -->
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-full flex items-center justify-center" :class="notification.reservation_status === 'approved'
                                ? 'bg-green-100 text-green-500'
                                : 'bg-blue-100 text-blue-600'">
                                <font-awesome-icon :icon="notification.reservation_status === 'approved'
                                    ? 'check-circle'
                                    : 'bell'" class="text-xl" />
                            </div>

                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800 text-base leading-tight">
                                    {{ getSpanishReservationStatus(notification.reservation_status) }}
                                </span>
                                <span class="text-xs text-gray-500">
                                    Recibida: {{ formatDate(notification.changed_at) }}
                                </span>
                            </div>
                        </div>

                        <button @click="openConfirm(notification, 'delete')"
                            class="text-gray-400 hover:text-red-500 transition" title="Eliminar notificación">
                            <font-awesome-icon icon="fa-regular fa-trash-can" class="text-lg" />
                        </button>
                    </div>

                    <!-- Mensaje -->
                    <p class="text-gray-700 text-xs leading-relaxed">
                        {{ notification.message }}
                    </p>

                    <!-- Botones -->
                    <div class="flex justify-end flex-wrap gap-2 mt-2">
                        <!-- owner -->
                        <button
                            v-if="notification.reservation_status !== 'approved' && notification.reservation_role === 'owner'"
                            @click="goToIncomingReservations"
                            class="px-4 py-2 bg-primary text-white text-sm rounded-lg font-semibold shadow hover:bg-blue-700 transition active:scale-95">
                            Verificar ahora
                        </button>

                        <button
                            v-else-if="notification.reservation_status === 'approved' && notification.reservation_role === 'owner'"
                            @click="goToIncomingReservations"
                            class="px-4 py-2 bg-green-500 text-white text-sm rounded-lg font-semibold shadow hover:bg-green-600 transition active:scale-95">
                            Ir a reserva
                        </button>

                        <!-- client -->
                        <button v-if="notification.reservation_role === 'client'" @click="goToReservations"
                            class="px-4 py-2 bg-primary text-white text-sm rounded-lg font-semibold shadow hover:bg-blue-700 transition active:scale-95">
                            Ir a reserva
                        </button>
                    </div>
                </li>
            </ul>

            <!-- Sin notificaciones -->
            <div v-else class="text-center py-10 text-gray-500 space-y-2">
                <font-awesome-icon icon="bell-slash" class="text-3xl text-gray-400" />
                <p>No hay notificaciones.</p>
            </div>
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
