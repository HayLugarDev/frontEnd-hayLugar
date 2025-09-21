<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
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

        <!-- Badges auxiliares -->
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span v-if="hasHold(reservation)"
            class="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
            title="Pago retenido (hold) listo para captura">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Retención OK
          </span>

          <span v-else-if="isApprovedLike(reservation.status)"
            class="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200"
            title="Aprobada, esperando retención de pago">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            Esperando retención
          </span>

          <span v-if="reservation.status === 'completed'"
            class="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200"
            title="Pago acreditado">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            Pago Acreditado
          </span>
        </div>

        <div class="flex flex-col lg:flex-row items-center justify-between">
          <div class="flex flex-col w-full">
            <div v-if="reservation.status === 'in_progress'" class="mt-2 text-red-600 font-bold">
              Tiempo restante: {{ countdowns[reservation.id] || 'Cargando...' }}
            </div>

            <!-- Botones inferiores -->
            <div class="flex flex-row items-center justify-end gap-1 text-xs">
              <!-- PENDING: aprobar / rechazar -->
              <div v-if="isPending(reservation.status)"
                class="flex flex-row items-center justify-end gap-2 w-full md:w-auto mt-4">
                <button @click="confirmApprovedReservation(reservation)"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <font-awesome-icon :icon="['fas', 'check']" />
                  Aprobar
                </button>
                <button @click="confirmRejectReservation(reservation)"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                  Rechazar
                </button>
              </div>
              <div>
                <button v-if="!['pending','cancelled', 'completed', 'failed','verified'].includes(reservation.status)" @click="confirmCancelation(reservation)"
                  class="bg-red-400 text-white px-4 py-2 rounded-lg shadow hover:bg-red-500 transition-all flex items-center justify-center gap-2 w-full md:w-auto mt-4">
                  <font-awesome-icon :icon="['fas', 'square-xmark']" />
                  Cancelar Reserva
                </button>
              </div>

              <!-- VERIFIED (Anfitrión confirma check-in correcto) -->
              <div v-if="reservation.status === 'verified'"
                class="flex flex-row items-center justify-end gap-2 w-full md:w-auto mt-4">
                <button @click="confirmCheckinReservation(reservation)"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <font-awesome-icon :icon="['fas', 'check']" />
                  Checkin realizado
                </button>
                <button @click="confirmRejectReservation(reservation)"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                  Rechazar
                </button>
              </div>

              <!-- FINALIZAR Y COBRAR (solo si hay hold y ya no es pending) -->
              <div v-else-if="canFinalize(reservation)"
                class="flex flex-col sm:flex-row sm:items-center sm:gap-3 justify-end w-full md:w-auto mt-4">
                <button @click="confirmFinalizeReservation(reservation)"
                  class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="quoteLoading && selectedReservation?.id === reservation.id">
                  <font-awesome-icon :icon="['fas', 'money-bill']" />
                  {{ (quoteLoading && selectedReservation?.id === reservation.id) ? 'Calculando…' : 'Finalizar y cobrar'
                  }}
                </button>

                <!-- Hint con QUOTE si ya está solicitado para esta card -->
                <span v-if="quote && selectedReservation?.id === reservation.id"
                  class="text-sm text-gray-600 mt-2 sm:mt-0">
                  Total: {{ formatCents(quote.final_cents) }}
                  <span v-if="quote.penalty_cents > 0">• Penalidad: {{ formatCents(quote.penalty_cents) }}</span>
                  <span v-if="quote.remainder_cents > 0" class="text-amber-600">
                    • Resto vs hold: {{ formatCents(quote.remainder_cents) }}
                  </span>
                </span>
              </div>

              <!-- Aviso suave si aprobada pero aún sin hold -->
              <div v-else class="mt-4 text-sm text-gray-500">
                <span v-if="isApprovedLike(reservation.status)">
                  A la espera de la retención de pago para poder finalizar.
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <p v-else-if="!loading" class="text-gray-500">No tienes reservas entrantes anteriores.</p>

    <!-- Modal existente -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-primary mb-2">¡Éxito!</h2>
            <p class="text-lg text-gray-700 text-center mb-6">Verificación exitosa.</p>
            <button @click="goToReservation" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage || 'Ocurrió un error'"
      icon="/src/assets/logo.png" @close="openCheckInModal" />

    <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
      @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />

    <!-- ✅ Mini Toast -->
    <transition name="fade">
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white"
        :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'">
        {{ toast.text }}
      </div>
    </transition>
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

const reservations = ref<any[]>([]);
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

/** Mini toast */
const toast = ref<{ show: boolean; type: 'success' | 'error'; text: string }>({
  show: false,
  type: 'success',
  text: ''
});
function showToast(text: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, type, text };
  setTimeout(() => (toast.value.show = false), 2500);
}

// ===== formateadores =====
const formatDate = (value: string): string => {
  const date = new Date(value);
  return date.toLocaleString();
};
const formatCents = (c: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format((Math.round(c) / 100) || 0);

// ================== FETCH ==================
const fetchReservations = async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    console.error("No se encontró el ID de usuario en userStore");
    reservations.value = [];
    return;
  }
  loading.value = true;
  try {
    const { data } = await api.get(`reservations/incoming/${userId}`, { withCredentials: true });
    reservations.value = data || [];
  } catch (error) {
    console.error("Error al obtener reservas entrantes", error);
    reservations.value = [];
  } finally {
    loading.value = false;
  }
};

// ================== ESTADO ==================
const getStatusInfo = (status: ReservationMessageStatus) => ({
  label: reservationMessages[status].label,
  message: reservationMessages[status].owner
});

function isPending(status: string) {
  return status === 'pending';
}

function isApprovedLike(status: string) {
  return ['in_progress'].includes(status);
}

function hasHold(reservation: any) {
  const hold = Number(reservation?.hold_amount_cents || 0);
  const pid = reservation?.payment_id;
  return !!pid && hold > 0;
}

function canFinalize(reservation: any) {
  return isApprovedLike(reservation.status) && hasHold(reservation);
}

// ================== ACCIONES (aprobar/rechazar) ==================
function confirmApprovedReservation(reservation: any) {
  selectedReservation.value = reservation;
  modalConfig.value = {
    message: '¿Aprobar esta reserva? Recuerda que te comprometes a recibir al usuario al momento de realizar el check-in.',
    buttonText: 'Confirmar',
    onConfirm: () => approveReservation()
  };
  showConfirmModal.value = true;
}

async function approveReservation() {
  try {
    await api.put(`/reservations/${selectedReservation.value.id}/status`, { status: 'approved' }, { withCredentials: true });

    showConfirmModal.value = false;
    selectedReservation.value = null;

    // Refetch para traer hold/payment_id si ya quedó calzado por otro flujo
    await fetchReservations();
    showToast('Reserva aprobada', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al aprobar la reserva";
    showToast('No se pudo aprobar la reserva', 'error');
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
    await api.patch(`/reservations/${selectedReservation.value.id}/cancel`, { withCredentials: true });

    // Actualizar localmente el estado de la reserva en el array principal
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

async function inProgressReservation() {
  try {
    await api.put(`/reservations/${selectedReservation.value.id}/status`, { status: 'in_progress' }, { withCredentials: true });

    showConfirmModal.value = false;
    selectedReservation.value = null;

    await fetchReservations();
    showToast('¡Checkin confirmado!', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al confirmar Checkin";
    showToast('No se pudo confirmar Checkin', 'error');
  }
}

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

    showConfirmModal.value = false;
    selectedReservation.value = null;

    await fetchReservations();
    showToast('Reserva cancelada', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al cancelar la reserva";
    showToast('No se pudo cancelar la reserva', 'error');
  }
}

function confirmCheckinReservation(reservation: any) {
  selectedReservation.value = reservation;
  modalConfig.value = {
    message: '¿El usuario estacionó y realizó el Checkin correctamente?',
    buttonText: 'Confirmar',
    onConfirm: () => inProgressReservation()
  };
  showConfirmModal.value = true;
}

// ================== FINALIZAR Y COBRAR ==================
const quote = ref<null | {
  reservation_id: number;
  base_cents: number;
  penalty_cents: number;
  final_cents: number;
  hold_cents: number;
  remainder_cents: number;
  info: string;
}>(null);

const quoteLoading = ref(false);

async function confirmFinalizeReservation(reservation: any) {
  selectedReservation.value = reservation;

  // 1) Verificamos si el tiempo ya finalizó
  const now = new Date().getTime();
  const end = new Date(reservation.end_time).getTime();
  const tiempoNoFinalizo = now < end;

  if (tiempoNoFinalizo) {
    modalConfig.value = {
      message: `¡Atención! El tiempo de la reserva aún no ha finalizado. ¿Desea finalizar y cobrar igual?`,
      buttonText: 'Finalizar y cobrar',
      onConfirm: () => finalizeWithQuote(reservation)
    };
    showConfirmModal.value = true;
    return;
  }

  // 2) Si ya finalizó, seguimos el flujo normal
  await finalizeWithQuote(reservation);
}

// Función que obtiene la quote y abre el modal de confirmación con detalle
async function finalizeWithQuote(reservation: any) {
  try {
    quoteLoading.value = true;

    const { data } = await api.get(`/reservations/${reservation.id}/capture-quote`, { withCredentials: true });
    quote.value = {
      reservation_id: data.reservation_id,
      base_cents: data.base_cents,
      penalty_cents: data.penalty_cents,
      final_cents: data.final_cents,
      hold_cents: data.hold_cents,
      remainder_cents: data.remainder_cents,
      info: data.info,
    };

    const base = formatCents(quote.value.base_cents);
    const pen = formatCents(quote.value.penalty_cents);
    const tot = formatCents(quote.value.final_cents);
    const hold = formatCents(quote.value.hold_cents);
    const rest = formatCents(quote.value.remainder_cents);

    const msg =
      (quote.value.penalty_cents > 0
        ? `Pago con penalidad por sobretiempo.\n`
        : `Pago sin penalidad.\n`) +
      `Base: ${base}\n` +
      `Penalidad: ${pen}\n` +
      `Total a cobrar: ${tot}\n`;


    modalConfig.value = {
      message: msg,
      buttonText: 'Finalizar y cobrar',
      onConfirm: () => finalizeReservation()
    };

    showConfirmModal.value = true;
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.error || "No se pudo calcular el total a capturar.";
    showToast('No se pudo calcular el total', 'error');
  } finally {
    quoteLoading.value = false;
  }
}


async function finalizeReservation() {
  try {
    if (!selectedReservation.value || !quote.value) return;

    const id = selectedReservation.value.id;
    const finalCents = quote.value.final_cents;

    await api.post(
      `/payments/${id}/capture`,
      {
        final_amount_cents: finalCents,
        reason: quote.value.penalty_cents > 0 ? 'Checkout manual anfitrión (con penalidad)' : 'Checkout manual anfitrión'
      },
      { withCredentials: true }
    );

    // Cierro modal, limpio estado, refetch y toast
    showConfirmModal.value = false;
    selectedReservation.value = null;
    quote.value = null;

    await fetchReservations();
    showToast('Pago acreditado', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "No se pudo finalizar la reserva";
    showToast('No se pudo capturar el pago', 'error');
  }
}

// ================== CICLO VIDA ==================
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

// ================== COUNTDOWN ==================
function updateCountdowns() {
  const now = new Date().getTime();

  reservations.value.forEach((reservation: any) => {
    if (reservation.status === "in_progress") {
      const end = new Date(reservation.end_time).getTime();
      const diff = end - now;

      if (diff <= 0) {
        countdowns.value[reservation.id] = "00:00:00";
        // El cierre y la captura la hace el backend (botón o cron).
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
