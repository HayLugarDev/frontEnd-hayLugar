<template>
  
  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden absolute top-0 left-0 z-50">
    <BackButton />
  </div>

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(p) => router.push(p)" class="md:hidden" :showMap="false" />

  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] 
              text-white p-6 md:p-10">
    <section class="pt-20 max-w-4xl mx-auto p-6">
      <!-- HEADER -->
      <header class="mb-8">
        <h2 class="text-3xl font-bold text-primary flex items-center gap-2">
          🧾 Reservas entrantes
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Gestioná tus reservas recibidas de forma clara y rápida
        </p>
      </header>

      <!-- LOADING -->
      <div v-if="loading" class="space-y-4">
        <ItemSkeleton />
        <ItemSkeleton />
      </div>

      <!-- LISTA -->
      <div v-else-if="reservations.length">
        <div v-for="reservation in reservations" :key="reservation.id"
          class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all backdrop-blur-xl mb-6">
          <!-- HEADER DEL CARD -->
          <div class="flex justify-between items-center p-4 bg-white/10 border-b border-white/10">
            <div>
              <h3 class="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <font-awesome-icon icon="calendar-check" class="text-primary" />
                Reserva #{{ reservation.id }}
              </h3>
              <p class="text-xs text-gray-400">
                {{ formatDate(reservation.created_at) }}
              </p>
            </div>

            <!-- STATUS TAG -->
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
              statusColors[reservation.status] || 'bg-gray-100 text-gray-600'
            ]">
              {{ getStatusInfo(reservation.status).label }}
            </span>
          </div>

          <!-- CUERPO -->
          <div class="p-5 space-y-4 text-gray-300">
            <!-- DATOS GRID -->
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <p>
                <span class="font-semibold">📍 Espacio:</span>
                {{ reservation.space?.name ?? '—' }}
              </p>
              <p>
                <span class="font-semibold">🗺 Dirección:</span>
                {{ (reservation.space?.location || '—').split(',')[0] }}
              </p>
              <p>
                <span class="font-semibold">👤 Usuario:</span>
                {{ reservation.client?.name ?? '—' }}
              </p>
              <p>
                <span class="font-semibold">🚘 Vehículo:</span>
                <template v-if="reservation.vehicle">
                  {{ getVehicleType(reservation.vehicle.type) }}
                  <span class="text-gray-400">
                    ({{ reservation.vehicle.brand }} {{ reservation.vehicle.model }})
                  </span>
                </template>
                <template v-else>—</template>
              </p>
            </div>

            <!-- MENSAJE / ESTADO -->
            <p class="text-xs text-gray-400 italic">
              {{ getStatusInfo(reservation.status).message }}
            </p>

            <!-- BADGES -->
            <div class="flex flex-wrap gap-2 pt-1">
              <span v-if="hasHold(reservation)" class="badge-success">
                <span class="dot bg-emerald-500"></span> Retención OK
              </span>

              <span v-else-if="reservation.payment_id && !hasHold(reservation)" class="badge-info">
                <span class="dot bg-indigo-500"></span> Pago inmediato
              </span>

              <span v-else-if="isApprovedLike(reservation.status)" class="badge-warn">
                <span class="dot bg-amber-500"></span> Esperando retención
              </span>

              <span v-if="reservation.status === 'completed'" class="badge-blue">
                <span class="dot bg-blue-500"></span> Pago acreditado
              </span>
            </div>

            <!-- COUNTDOWN -->
            <div v-if="reservation.status === 'in_progress'" class="mt-2">
              <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold shadow">
                ⏱ {{ countdowns[reservation.id] || 'Cargando...' }}
              </span>
            </div>
          </div>

          <!-- ACCIONES -->
          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 p-4 bg-white/5">
            <!-- PENDING -->
            <template v-if="isPending(reservation.status)">
              <button @click="confirmApprovedReservation(reservation)" class="btn-primary">
                <font-awesome-icon :icon="['fas', 'check']" /> Aprobar
              </button>
              <button @click="confirmRejectReservation(reservation)" class="btn-danger">
                <font-awesome-icon :icon="['fas', 'xmark']" /> Rechazar
              </button>
            </template>

            <!-- VERIFICAR -->
            <template v-else-if="reservation.status === 'verified'">
              <button @click="confirmCheckinReservation(reservation)" class="btn-green">
                <font-awesome-icon :icon="['fas', 'check']" /> Check-in realizado
              </button>
              <button @click="confirmRejectReservation(reservation)" class="btn-danger">
                <font-awesome-icon :icon="['fas', 'xmark']" /> Rechazar
              </button>
            </template>

            <!-- FINALIZAR -->
            <template v-else-if="canFinalize(reservation)">
              <button @click="confirmFinalizeReservation(reservation)" class="btn-primary-gradient"
                :disabled="quoteLoading && selectedReservation?.id === reservation.id">
                <font-awesome-icon :icon="['fas', 'money-bill']" />
                {{ (quoteLoading && selectedReservation?.id === reservation.id) ? 'Calculando…' : 'Finalizar y cobrar'
                }}
              </button>

              <span v-if="quote && selectedReservation?.id === reservation.id" class="text-sm text-gray-300">
                Total: {{ formatCents(quote.final_cents) }}
                <span v-if="quote.penalty_cents > 0"> • Penalidad: {{ formatCents(quote.penalty_cents) }}</span>
                <span v-if="quote.remainder_cents > 0" class="text-amber-400">
                  • Resto vs hold: {{ formatCents(quote.remainder_cents) }}
                </span>
              </span>
            </template>

            <!-- AVISO -->
            <div v-else class="text-sm text-gray-500 italic">
              <span v-if="isApprovedLike(reservation.status)">
                A la espera de la retención para finalizar.
              </span>
            </div>

            <!-- CANCELAR -->
            <button v-if="!['pending', 'cancelled', 'completed', 'failed', 'verified'].includes(reservation.status)"
              @click="confirmCancelation(reservation)" class="btn-danger">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- SIN RESERVAS -->
      <p v-else class="text-gray-400 text-center py-12 italic">
        No tienes reservas entrantes aún.
      </p>

    </section>
  </div>

  <!-- MODALES -->
  <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage || 'Ocurrió un error'"
    icon="/src/assets/logo.png" @confirm="showErrorModal = !showErrorModal" />

  <StatusModal :visible="showSuccessModal" title="¡Éxito!" :message="'Verificación exitosa.'"
    icon="/src/assets/logo.png" @confirm="goToReservation" />

  <ConfirmModal :visible="showConfirmModal" :message="modalConfig.message" :button-text="modalConfig.buttonText"
    @close="showConfirmModal = false" @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }" />

  <RatingModal :visible="showRatingModal" :reservationId="selectedReservation?.id" @close="showRatingModal = false"
    @submit="handleRatingSubmit" />

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';
import { getVehicleType } from '../utils/vehicleTypeIconTraslation';
import { reservationMessages, ReservationMessageStatus, statusColors } from '../logic/useReservationMessages';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import ItemSkeleton from '../components/layout/skeletons/ItemSkeleton.vue';
import RatingModal from '../components/common/RatingModal.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from '../components/common/BackButton.vue';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import { showToast } from '../utils/toast';
import { formatDate } from '../utils/FormatDate';

const reservations = ref<any[]>([]);
const userStore = useUserStore();
const router = useRouter();

const showCheckInModal = ref(false);
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const errorMessage = ref("");
const loading = ref(true);

const selectedReservation = ref<any>(null);
const showRatingModal = ref(false);

const countdowns = ref<Record<number, string>>({});

const modalConfig = ref({
  message: '',
  buttonText: 'Aceptar',
  onConfirm: () => { }
});

// ===== formateadores =====
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
  return isApprovedLike(reservation.status) && !!reservation.payment_id;
}

// ================== ACCIONES ==================
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

    await fetchReservations();
    showToast('Reserva aprobada', 'success');
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value = error.response?.data?.message || "Error al aprobar la reserva";
    showToast('No se pudo aprobar la reserva', 'error');
  }
}

function confirmCancelation(reservation: any) {
  selectedReservation.value = reservation;
  modalConfig.value = {
    message: '¿Cancelar esta reserva?',
    buttonText: 'Confirmar',
    onConfirm: () => cancelReservation()
  };
  showConfirmModal.value = true;
}

const cancelReservation = async () => {
  try {
    await api.patch(`/reservations/${selectedReservation.value.id}/cancel`, { withCredentials: true });

    reservations.value = reservations.value.map((r: any) =>
      r.id === selectedReservation.value.id ? { ...r, status: 'cancelled' } : r
    );

    showToast('Reserva cancelada', 'success');
    selectedReservation.value = null;
    showErrorModal.value = false;
    showSuccessModal.value = false;
    showCheckInModal.value = false;
    showConfirmModal.value = false;
  } catch (error: any) {
    showToast('No se pudo cancelar la reserva', 'error');
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

  await finalizeWithQuote(reservation);
}

async function finalizeWithQuote(reservation: any) {
  try {
    quoteLoading.value = true;

    const { data } = await api.get(`/reservations/${reservation.id}/capture-quote`, { withCredentials: true });
    quote.value = data;

    const base = formatCents(quote.value.base_cents);
    const pen = formatCents(quote.value.penalty_cents);
    const tot = formatCents(quote.value.final_cents);

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

    // Paso 1: asegurar el cobro
    await api.post(`/payments/${id}/finalize`, {
      final_amount_cents: finalCents,
      reason: quote.value.penalty_cents > 0
        ? 'Checkout manual anfitrión (con penalidad)'
        : 'Checkout manual anfitrión'
    }, { withCredentials: true });



    showConfirmModal.value = false;
    showRatingModal.value = true;

    quote.value = null;
  } catch (error: any) {
    showErrorModal.value = true;
    errorMessage.value =
      error.response?.data?.message || "No se pudo finalizar la reserva";
    showToast('No se pudo finalizar la reserva', 'error');
  }
}

// ================== CALIFICAR CLIENTE ==================
async function handleRatingSubmit(formData: { rating: number; comment?: string }) {
  if (!selectedReservation.value) return;

  const payload = {
    authorId: userStore.user?.id,
    targetId: selectedReservation.value.client.id,
    reservationId: selectedReservation.value.id,
    rating: formData.rating,
    comment: formData.comment,
    role: 'owner'
  };

  try {
    await api.post(`/users/rate/${payload.targetId}`, payload, { withCredentials: true });

    showRatingModal.value = false;
    selectedReservation.value = null;

    await fetchReservations();
    showToast('Calificación enviada con éxito', 'success');
  } catch (err) {
    showToast('No se pudo enviar la calificación', 'error');
  }
}

// ================== CICLO VIDA ==================
onMounted(async () => {
  await fetchReservations();
  setInterval(updateCountdowns, 1000);
});

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

.badge-success {
  @apply inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm;
}

.badge-info {
  @apply inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm;
}

.badge-warn {
  @apply inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm;
}

.badge-blue {
  @apply inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm;
}

.dot {
  @apply w-2 h-2 rounded-full;
}

.btn-primary {
  @apply flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all;
}

.btn-primary-gradient {
  @apply flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all;
}

.btn-danger {
  @apply flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all;
}

.btn-green {
  @apply flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all;
}
</style>
