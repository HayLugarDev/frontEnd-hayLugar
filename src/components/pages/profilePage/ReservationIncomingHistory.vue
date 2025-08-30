<template>
    <section class="bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
        <div v-if="loading" class="space-y-4">
            <ItemSkeleton />
        </div>
        <ul v-if="reservations.length" class="divide-y divide-gray-300 relative space-y-4">
            <li v-for="(reservation, index) in reservations" :key="index"
                class="relative border border-yellow-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all bg-gray-50 space-y-3">
                <div class="flex flex-col xl:grid xl:grid-cols-4 text-gray-700 font-semibold text-[1rem]">
                    <div class="col-span-4 flex flex-row gap-1">
                        <span class="font-bold">Numero de reserva: </span>
                        <p class="text-gray-500 font-normal">#{{ reservation.id }}</p>
                    </div>
                    <div class="col-span-2 flex flex-row gap-1">
                        <span class="font-bold">Fecha de solicitud: </span>
                        <p class="text-gray-500 font-normal">{{ formatDate(reservation.created_at) }}</p>
                    </div>
                    <div class="col-span-2 flex flex-row gap-1">
                        <span class="font-bold">Nombre del espacio: </span>
                        <p class="text-gray-500 font-normal">{{ reservation.space.name }}</p>
                    </div>
                    <div class="col-span-2 flex flex-row gap-1">
                        <span class="font-bold">Dirección: </span>
                        <p class="text-gray-500 font-normal">{{ reservation.space.location.split(',')[0] }}</p>
                    </div>
                    <div class="col-span-2 flex flex-row gap-1">
                        <span class="font-bold">Usuario: </span>
                        <p class="text-gray-500 font-normal">{{ reservation.client.name }}</p>
                    </div>
                    <div class="col-span-2 flex flex-col gap-1">
                        <div class="flex flex-row justify-start gap-2">
                            <h3 class="font-bold text-lg">Estado de la reserva:</h3>
                            <div
                                :class="`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[reservation.status] || 'bg-gray-200 text-gray-600'}`">
                                {{ getStatusInfo(reservation.status).label }}
                            </div>
                        </div>
                    </div>
                    <div class="col-span-2 flex flex-row gap-1">
                        <span class="font-bold">Vehículo: </span>
                        <p class="text-gray-500 font-normal">{{ getVehicleType(reservation.vehicle.type) }}</p>
                        <p class="text-gray-600">({{ reservation.vehicle.brand }} {{ reservation.vehicle.model }})</p>
                    </div>
                </div>
                <p class="col-span-4 mt-2 text-gray-600 text-sm">
                    {{ getStatusInfo(reservation.status).message }}
                </p>
                <div class="flex flex-col lg:flex-row items-center justify-between">
                    <div class="flex flex-col w-full">
                        <div v-if="reservation.status === 'in_progress'" class="mt-2 text-red-600 font-bold">
                            Tiempo restante: {{ countdowns[reservation.id] || 'Cargando...' }}
                        </div>

                        <!-- Botones para gestionar reservas pendientes -->
                        <div v-if="reservation.status === 'pending'" class="flex flex-row gap-2 w-full md:w-auto mt-4">
                            <button @click="confirmApprovedReservation(reservation)"
                                class="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                                <font-awesome-icon :icon="['fas', 'check']" />
                                Aprobar
                            </button>
                            <button @click="confirmRejectReservation(reservation)"
                                class="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                <font-awesome-icon :icon="['fas', 'xmark']" />
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <p v-else-if="!loading" class="text-gray-500">No tienes reservas entrantes anteriores.</p>

        <!-- Modal de éxito -->
        <transition name="fade">
            <div v-if="showSuccessModal"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
                    <div class="flex flex-col items-center">
                        <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
                        <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
                        <p class="text-lg text-gray-700 text-center mb-6">Verificación exitosa.</p>
                        <button @click="goToReservation"
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
            message="El código ingresado es incorrecto. Intentá nuevamente" icon="/src/assets/logo.png"
            @close="openCheckInModal" />

        <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
            @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import api from '../../../services/apiService';
import { getVehicleType } from '../../../utils/vehicleTypeIconTraslation';
import { reservationMessages, ReservationMessageStatus, statusColors } from '../../../logic/useReservationMessages';
import StatusModal from '../addSpacePage/StatusModal.vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '../../common/ConfirmModal.vue';
import ItemSkeleton from '../../layout/skeletons/ItemSkeleton.vue';

const reservations = ref([]);
const userStore = useUserStore();
const router = useRouter();

const showCheckInModal = ref(false);
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const loading = ref(true);

const checkInCode = ref("");
const selectedReservation = ref<any>(null);
const errorMessage = ref("");

const countdowns = ref<Record<number, string>>({});

const modalConfig = ref({
    message: '',
    buttonText: 'Aceptar',
    onConfirm: () => { }
});

const fetchReservations = async () => {
    loading.value = true;
    const userId = userStore.user?.id;
    if (!userId) {
        console.error("No se encontró el ID de usuario en userStore");
        loading.value = false;
        return;
    }
    try {
        const response = await api.get(`reservations/incoming/${userId}`, { withCredentials: true });
        reservations.value = response.data;
        userStore.setReservations(response.data)
        //userStore.checkReservationsForUpcoming();
    } catch (error) {
        console.error("Error al obtener historial de reservas", error);
    }
    loading.value = false;
};

function confirmApprovedReservation(reservation: any) {
    selectedReservation.value = reservation;
    modalConfig.value = {
        message: '¿Aprobar esta reserva? Recuerda que te comprometes a recibir al usuario al momento de realiar el check-in',
        buttonText: 'Confirmar',
        onConfirm: () => approveReservation()
    };
    showConfirmModal.value = true;
}

async function approveReservation() {
    try {
        await api.put(`/reservations/${selectedReservation.value.id}/status`, { status: 'approved' }, { withCredentials: true });

        // Actualizar localmente el estado de la reserva en el array principal
        reservations.value = reservations.value.map((r: any) =>
            r.id === selectedReservation.value.id ? { ...r, status: 'approved' } : r
        );

        selectedReservation.value = null;
        showErrorModal.value = false;
        showSuccessModal.value = false;
        showCheckInModal.value = false;
        showConfirmModal.value = false;
    } catch (error: any) {
        showErrorModal.value = true;
        errorMessage.value = error.response?.data?.message || "Error al aprobar la reserva";
    }
};

function confirmRejectReservation(reservation: any) {
    selectedReservation.value = reservation;
    modalConfig.value = {
        message: '¿Rechazar esta reserva? El usuario será notificado.',
        buttonText: 'Rechazar',
        onConfirm: () => rejectReservation()
    };
    showConfirmModal.value = true;
}

async function rejectReservation() {
    try {
        await api.put(`/reservations/${selectedReservation.value.id}/cancel`, { status: 'cancelled' }, { withCredentials: true });

        reservations.value = reservations.value.map((r: any) =>
            r.id === selectedReservation.value.id ? { ...r, status: 'cancelled' } : r
        );

        selectedReservation.value = null;
        showErrorModal.value = false;
        showSuccessModal.value = false;
        showCheckInModal.value = false;
        showConfirmModal.value = false;
    } catch (error: any) {
        showErrorModal.value = true;
        errorMessage.value = error.response?.data?.message || "Error al cancelar la reserva";
    }
};

onMounted(async () => {
    await fetchReservations();
    setInterval(updateCountdowns, 1000);
});

function openCheckInModal() {
    showErrorModal.value = false;
    showSuccessModal.value = false;
    showCheckInModal.value = true;
}

function goToReservation() {
    router.push('/profile?section=reservas')
}

const getStatusInfo = (status: ReservationMessageStatus) => ({
    label: reservationMessages[status].label,
    message: reservationMessages[status].owner
});

// setInterval(() => {
//     userStore.checkReservationsForUpcoming();
// }, 60000);

const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
};

function updateCountdowns() {
    const now = new Date().getTime();

    reservations.value.forEach((reservation: any) => {
        if (reservation.status === "in_progress") {
            const end = new Date(reservation.end_time).getTime();
            const diff = end - now;

            if (diff <= 0) {
                countdowns.value[reservation.id] = "00:00:00";
                reservation.status = "completed"; // opcional, si querés marcarlo finalizado automáticamente
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                countdowns.value[reservation.id] =
                    `${String(hours).padStart(2, "0")}:` +
                    `${String(minutes).padStart(2, "0")}:` +
                    `${String(seconds).padStart(2, "0")}`;
            }
        }
    });
}

</script>
