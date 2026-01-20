<template>
  <section class=" p-8 rounded-lg sm:shadow-lg mb-8 w-full md:w-2/3">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-white">📅 Tus reservas</h2>
        <p class="text-md text-gray-400 px-4">Revisá el estado y detalles de tus reservas activas o pasadas</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <ItemSkeleton />
      <ItemSkeleton />
    </div>

    <div v-if="reservations.length" class="space-y-4">
      <div v-for="reservation in reservations" :key="reservation.id" :class="[
        'rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all backdrop-blur-xl mb-6',
        reservation.status === 'cancelled' ||
          reservation.status === 'failed' ||
          isReservationExpired(reservation)
          ? 'bg-red-900/20 border border-red-700/30'
          : 'bg-gray-900/30 border border-white/10'
      ]">
        <div class="flex justify-between items-center p-4 border-b">
          <div>
            <h3 class="text-lg font-bold text-gray-200 flex items-center gap-2">
              <font-awesome-icon icon="calendar-check" class="text-primary" />
              Reserva #{{ reservation.id }}
            </h3>
            <p class="text-xs text-gray-400">{{ formatDate(reservation.created_at) }}</p>
          </div>
          <span v-if="isReservationExpired(reservation)"
            class="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
            Expirada
          </span>

          <span v-else :class="[
            'px-3 py-1 rounded-full text-xs font-semibold',
            statusColors[reservation.status] || 'bg-gray-100 text-gray-600'
          ]">
            {{ getStatusInfo(reservation.status).label }}
          </span>
        </div>

        <div class="p-5 space-y-3 text-sm text-gray-200">
          <div class="grid md:grid-cols-2 gap-x-4 gap-y-2">
            <p><span class="font-semibold">📍 Espacio:</span> {{ reservation?.space?.name }}</p>
            <p><span class="font-semibold">📫 Dirección:</span> {{ reservation?.space?.location.split(',')[0] }}</p>
            <p><span class="font-semibold">👤 Anfitrión:</span> {{ reservation?.owner?.name }}</p>
            <p>
              <span class="font-semibold">🚘 Vehículo:</span>
              {{ getVehicleType(reservation.vehicle.type) }}
              ({{ reservation.vehicle.brand }} {{ reservation.vehicle.model }})
            </p>
          </div>

          <p class="text-red-400 text-sm italic mt-2">
            <span v-if="isReservationExpired(reservation)">
              ⛔ El tiempo de esta reserva ya finalizó
            </span>
            <span v-else>
              {{ getStatusInfo(reservation.status).message }}
            </span>
          </p>


          <div class="flex flex-wrap justify-between items-center mt-2">
            <div class="text-sm">
              <p><span class="font-semibold">Check-In:</span> {{ formatDate(reservation.start_time) }}</p>
              <p><span class="font-semibold">Check-Out:</span> {{ formatDate(reservation.end_time) }}</p>
              <p v-if="reservation.status === 'in_progress'" class="text-red-600 font-bold mt-1">
                ⏳ Tiempo restante: {{ countdowns[reservation.id] || 'Cargando...' }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="!['cancelled', 'completed', 'failed', 'expired'].includes(reservation.status)">

          <div class="flex flex-wrap justify-end gap-2 p-4">

            <!-- Pagar reserva -->
            <button v-if="reservation.status === 'payment_pending' && reservation.payment_status === 'pending'"
              @click="paymentReservation(reservation)"
              class="flex items-center gap-2 bg-newgreen text-white px-4 py-2 rounded-xl shadow hover:bg-green-600 transition-all">
              <font-awesome-icon icon="credit-card" /> Pagar reserva
            </button>

            <!-- Check-in -->
            <button v-if="reservation.status === 'approved'" @click="checkInInit(reservation)"
              :disabled="!checkInEnabled[reservation.id]"
              class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <font-awesome-icon icon="right-to-bracket" /> Iniciar Check-In
            </button>

            <!-- Check-out -->
            <button v-if="reservation.status === 'in_progress'" @click="checkOutInit(reservation)"
              class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition-all">
              <font-awesome-icon icon="right-from-bracket" /> Iniciar Check-Out
            </button>

            <!-- Cancelar -->
            <button v-if="reservation.status === 'pending' && reservation.payment_status === 'pending'"
              @click="confirmCancelation(reservation)"
              class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition-all">
              <font-awesome-icon icon="ban" /> Cancelar
            </button>

            <!-- Calificar -->
            <button v-if="reservation.status === 'completed' && !reservation.hasRating"
              @click="showRatingModal = true; selectedReservation = reservation"
              class="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl shadow hover:bg-yellow-600 transition-all">
              <font-awesome-icon icon="star" /> Calificar experiencia
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Sin reservas -->
    <div v-else class="text-center text-gray-500 mt-10 flex flex-col items-center justify-center">
      <p class="text-lg font-medium">No tienes ninguna reserva activa.</p>
      <button v-if="!reservations.length" @click="router.push('/dashboard')"
        class="flex items-center gap-2 text-newgreen font-semibold bg-white/10 px-4 py-2 rounded-xl shadow hover:bg-white/20 transition-all mt-4">
        <font-awesome-icon :icon="['fas', 'circle-plus']" />
        ¡Hacé tu primera reserva!
      </button>
    </div>

    <!-- Modal CheckIn -->
    <div v-if="showCheckInModal"
      class="fixed inset-0 flex items-center justify-center bg-white/10 border border-white/10 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 class="text-lg font-bold mb-4">Verificar Check-In</h2>

        <p class="text-sm text-gray-200 mb-2">
          Ingresa el código de verificación proporcionado por el anfitrión (Solo mayúsculas):
        </p>

        <input v-model="checkInCode" type="text" placeholder="Código de verificación"
          class="w-full border rounded-lg p-2 mb-3 focus:ring focus:ring-blue-300" />

        <div class="flex justify-end gap-2">
          <button @click="showCheckInModal = false" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
            Cancelar
          </button>
          <button @click="confirmCheckIn" class="px-4 py-2 rounded-lg bg-newgreen/20 hover:bg-newgreen/30 text-white">
            Confirmar
          </button>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-3">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Modales -->
    <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
      @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />

    <RatingModal :visible="showRatingModal" :reservationId="selectedReservation?.id" @close="showRatingModal = false"
      @submit="handleRatingSubmit" />

    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!"
      message="Ocurrió un error al procesar la acción" :icon="logo" @confirm="showErrorModal = false" />

    <SessionExpired :sessionExpired="isSessionInvalid" />
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
import RatingModal from '../../common/RatingModal.vue';
import { showToast } from '../../../utils/toast';
import logo from "../../../assets/logo.png";
import { verifyActiveSession } from '../../../middleware/verifyToken';
import SessionExpired from '../../common/SessionExpired.vue';
import { useVerifyToken } from '../../../logic/useVerifyToken';
import { useReservationStore } from '../../../store/reservationStore';
import isReservationExpired from '../../../utils/isReservationExpired';

const reservationStore = useReservationStore();

const reservations = ref([]);
const userStore = useUserStore();
const router = useRouter();

const showCheckInModal = ref(false);
const showErrorModal = ref(false);
const showErrorCheckinModal = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const loading = ref(true);

const { verifyToken, isSessionInvalid } = useVerifyToken();

const checkInEnabled = ref<Record<number, boolean>>({});

const checkInCode = ref("");
const selectedReservation = ref<any>(null);
const errorMessage = ref("");

const showRatingModal = ref(false);

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
    const response = await api.get(`reservations/history/${userId}`, { withCredentials: true });
    reservations.value = response.data;
    userStore.setReservations(response.data)
    //userStore.checkReservationsForUpcoming();
  } catch (error) {
    console.error("Error al obtener historial de reservas", error);
  }
  loading.value = false;
};

onMounted(async () => {
  await verifyToken();
  if (isSessionInvalid.value) return;

  await fetchReservations();
  updateCheckInEnabled(); // inicial
  setInterval(updateCountdowns, 1000);
  setInterval(updateCheckInEnabled, 1000); // actualización en tiempo real
});

async function confirmCheckIn() {
  if (!selectedReservation.value) return;

  try {
    await api.post(`/reservations/u/${selectedReservation.value.id}/verify-checkin`,
      { code: checkInCode.value },
      { withCredentials: true }
    );

    selectedReservation.value.status = "verified";
    showCheckInModal.value = false;

    showToast('Check-In verificado con éxito. ¡Yá podés estacionar!', 'success');

  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Error al verificar código";
  }
}

function paymentReservation(reservation: any) {
  if (isReservationExpired(reservation)) {
    showToast('Esta reserva ya expiró y no puede pagarse', 'error');
    return;
  }

  if (
    reservation.status !== 'payment_pending' ||
    reservation.payment_status !== 'pending'
  ) {
    showToast('Esta reserva no puede pagarse en este momento', 'error');
    return;
  }

  reservationStore.setReservationData(reservation);
  router.push('/reservations/pago');
}

function checkInInit(reservation: any) {
  selectedReservation.value = reservation;
  checkInCode.value = "";
  errorMessage.value = "";
  showCheckInModal.value = true;
}

function checkOutInit(reservation: any) {
  selectedReservation.value = reservation;
  modalConfig.value = {
    message: '¿Finalizar reserva y retirar vehículo?',
    buttonText: 'Confirmar',
    onConfirm: () => completeReservation()
  };
}

function updateCheckInEnabled() {
  const now = new Date().getTime();

  reservations.value.forEach((reservation: any) => {
    const start = new Date(reservation.start_time).getTime();
    const end = new Date(reservation.end_time).getTime();

    // Habilitado 10 minutos antes del inicio hasta el final de la reserva
    checkInEnabled.value[reservation.id] = now >= start - 10 * 60 * 1000 && now <= end;
  });
}



const completeReservation = async () => {
  if (!selectedReservation.value) return;

  try {
    await api.put(`/reservations/u/${selectedReservation.value.reservation_id}/finalize`, { withCredentials: true });

    // Actualizar localmente el estado de la reserva
    selectedReservation.value = selectedReservation.value.map((r: { id: number; }) =>
      r.id === selectedReservation.value.id ? { ...r, status: 'completed' } : r
    );

    showErrorModal.value = false;
    showErrorCheckinModal.value = false;
    showSuccessModal.value = false;
    showCheckInModal.value = false;
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al finalizar la reserva";
  }
};

async function handleRatingSubmit(formData: { rating: number; comment?: string }) {
  if (!selectedReservation.value) return;

  const payload = {
    authorId: userStore.user?.id,               // quién califica (logueado)
    targetId: selectedReservation.value.owner.id, // quién recibe la review
    reservationId: selectedReservation.value.id,
    rating: formData.rating,
    comment: formData.comment,
    role: 'client' // usuario que califica como cliente
  };

  try {
    await api.post(`/users/rate/${payload.targetId}`, payload, { withCredentials: true });

    // Marcar localmente que ya fue calificada
    selectedReservation.value.hasRating = true;

    showRatingModal.value = false;
    selectedReservation.value = null;

    await fetchReservations();
    showToast('Calificación enviada con éxito', 'success');
  } catch (err) {
    showToast('No se pudo enviar la calificación', 'error');
  }
}


function confirmCancelation(reservation: any) {
  showConfirmModal.value = true;
  selectedReservation.value = reservation;
  modalConfig.value = {
    message: '¿Cancelar esta reserva?',
    buttonText: 'Confirmar',
    onConfirm: () => cancelReservation()
  };
}

const cancelReservation = async () => {
  try {
    await api.put(`/reservations/u/${selectedReservation.value.id}/cancel`, { role: 'client' }, { withCredentials: true });

    // Actualizar localmente el estado de la reserva en el array principal
    reservations.value = reservations.value.map((r: any) =>
      r.id === selectedReservation.value.id ? { ...r, status: 'cancelled' } : r
    );

    selectedReservation.value = null;
    showErrorCheckinModal.value = false;
    showSuccessModal.value = false;
    showCheckInModal.value = false;
    showConfirmModal.value = false;
    showToast('Reserva cancelada con éxito', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al cancelar la reserva";
  }
};

const getStatusInfo = (status: ReservationMessageStatus) => ({
  label: reservationMessages[status].label,
  message: reservationMessages[status].client
});

// setInterval(() => {
//   userStore.checkReservationsForUpcoming();
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

<style scoped>
section {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
