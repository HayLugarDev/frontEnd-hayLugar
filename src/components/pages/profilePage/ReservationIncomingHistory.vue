<template>
  <section class="lg:bg-white p-2 md:p-8 rounded-lg shadow-lg mb-8 w-full md:w-2/3">
    <div v-if="loading" class="space-y-4">
      <ItemSkeleton />
    </div>

    <ul v-if="reservations.length" class="divide-y divide-gray-200 relative space-y-4">
      <li
        v-for="(reservation, index) in reservations"
        :key="index"
        class="relative border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all bg-gray-50 space-y-4"
        :class="cardDisabled(reservation) ? 'opacity-50 pointer-events-none' : ''"
      >
        <!-- Header -->
        <div class="flex flex-col xl:grid xl:grid-cols-12 gap-3 text-gray-700 font-medium">
          <div class="col-span-12 flex flex-wrap items-center gap-3 justify-between">
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-gray-500">#{{ reservation.id }}</span>
              <span
                class="pill"
                :class="statusColors[reservation.status] || 'bg-gray-200 text-gray-700'"
              >
                {{ getStatusInfo(reservation.status).label }}
              </span>

              <!-- Flow/payment pills -->
              <span v-if="hasHold(reservation)" class="pill bg-emerald-100 text-emerald-700 border-emerald-200">
                Hold autorizado
              </span>
              <span v-else-if="reservation.captured_amount_cents > 0" class="pill bg-primary/10 text-primary border-primary/20">
                Pago inmediato
              </span>
            </div>

            <span class="text-xs text-gray-500">
              Solicitada: {{ formatDate(reservation.created_at) }}
            </span>
          </div>

          <div class="col-span-6 flex items-start gap-3">
            <div class="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <font-awesome-icon :icon="['fas','warehouse']" class="text-primary" />
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ reservation.space.name }}</div>
              <div class="text-sm text-gray-600">{{ (reservation.space.location || '').split(',')[0] }}</div>
              <div class="text-xs text-gray-500">Check-in: {{ formatDate(reservation.start_time) }} · Check-out: {{ formatDate(reservation.end_time) }}</div>
            </div>
          </div>

          <div class="col-span-6 flex items-start gap-3">
            <div class="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <font-awesome-icon :icon="['fas','car-side']" class="text-gray-600" />
            </div>
            <div>
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Vehículo:</span>
                {{ getVehicleType(reservation.vehicle.type) }}
                <span class="text-gray-500">
                  ({{ reservation.vehicle.brand }} {{ reservation.vehicle.model }})
                </span>
              </div>
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Usuario:</span> {{ reservation.client.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje del estado -->
        <p class="text-gray-600 text-sm">
          {{ getStatusInfo(reservation.status).message }}
        </p>

        <!-- Progreso + countdown (solo en curso) -->
        <div v-if="reservation.status === 'in_progress'">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>En curso</span>
            <span>Termina en: <strong class="text-red-600">{{ countdowns[reservation.id] || '—' }}</strong></span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="h-2 bg-primary transition-all"
              :style="{ width: (progress[reservation.id] || 0) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-2">
          <div class="flex flex-wrap gap-2">
            <!-- PENDING -->
            <template v-if="reservation.status === 'pending'">
              <button class="btn-green" @click="askApprove(reservation)">
                <font-awesome-icon :icon="['fas','check']" /> Aprobar
              </button>
              <button class="btn-red" @click="askReject(reservation)">
                <font-awesome-icon :icon="['fas','xmark']" /> Rechazar
              </button>
            </template>

            <!-- APPROVED -->
            <template v-else-if="reservation.status === 'approved'">
              <button class="btn-indigo" @click="askVerifyCheckin(reservation)">
                <font-awesome-icon :icon="['fas','qrcode']" /> Verificar código de ingreso
              </button>
              <button class="btn-red" @click="askReject(reservation)">
                <font-awesome-icon :icon="['fas','xmark']" /> Rechazar
              </button>
            </template>

            <!-- VERIFIED / IN_PROGRESS -->
            <template v-else-if="reservation.status === 'verified' || reservation.status === 'in_progress'">
              <button
                class="btn-primary"
                :disabled="quoteLoading && selectedReservation?.id === reservation.id || extra.show"
                @click="askFinalize(reservation)"
              >
                <font-awesome-icon :icon="['fas','money-bill']" />
                {{ (quoteLoading && selectedReservation?.id === reservation.id) ? 'Calculando…' : 'Finalizar y cobrar' }}
              </button>

              <button
                v-if="quote && selectedReservation?.id === reservation.id && quote.remainder_cents > 0"
                class="btn-amber"
                :disabled="extra.show"
                @click="openExtraChargeModal(quote.remainder_cents, reservation)"
              >
                <font-awesome-icon :icon="['fas','plus-circle']" />
                Cobrar diferencia {{ formatCents(quote.remainder_cents) }}
              </button>

              <button
                class="btn-gray-outline"
                v-if="reservation.status !== 'in_progress'"
                @click="moveToInProgress(reservation)"
              >
                <font-awesome-icon :icon="['fas','circle-play']" />
                Iniciar tiempo (opcional)
              </button>
            </template>

            <!-- COMPLETED -->
            <template v-else-if="reservation.status === 'completed'">
              <span class="text-sm text-gray-500">Reserva finalizada.</span>
            </template>
          </div>

          <!-- Resumen de la quote (solo para la seleccionada) -->
          <div
            v-if="quote && selectedReservation?.id === reservation.id"
            class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 grid grid-cols-2 gap-y-1 min-w-[280px]"
          >
            <div class="text-gray-500">Total</div>
            <div class="text-right font-semibold">{{ formatCents(quote.final_cents) }}</div>
            <div class="text-gray-500" v-if="quote.penalty_cents > 0">Penalidad</div>
            <div class="text-right text-red-600" v-if="quote.penalty_cents > 0">{{ formatCents(quote.penalty_cents) }}</div>
            <div class="text-gray-500" v-if="quote.remainder_cents > 0">Falta cobrar</div>
            <div class="text-right text-amber-600" v-if="quote.remainder_cents > 0">{{ formatCents(quote.remainder_cents) }}</div>
          </div>
        </div>
      </li>
    </ul>

    <p v-else-if="!loading" class="text-gray-500">No tienes reservas entrantes.</p>

    <!-- Confirm modal -->
    <ConfirmModal
      :visible="showConfirmModal"
      :message="modalConfig.message"
      :button-text="modalConfig.buttonText"
      @close="showConfirmModal = false"
      @acept="() => { modalConfig.onConfirm(); showConfirmModal = false }"
    />

    <!-- Error modal -->
    <StatusModal
      :visible="showErrorModal"
      type="error"
      title="¡Atención!"
      :message="errorMessage || 'Ocurrió un error'"
      icon="/src/assets/logo.png"
      @close="showErrorModal = false"
    />

    <!-- Extra-charge modal -->
    <transition name="fade">
      <div v-if="extra.show" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="p-6 border-b">
            <h3 class="text-xl font-semibold text-gray-900">Cobrar diferencia</h3>
            <p class="text-sm text-gray-600 mt-1">
              Importe a cobrar: <strong>{{ formatCents(extra.amountCents) }}</strong>
            </p>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-sm text-gray-700">Email del pagador</label>
                <input v-model="extra.email" type="email" class="input" placeholder="cliente@correo.com" />
              </div>
              <div>
                <label class="text-sm text-gray-700">DNI</label>
                <input v-model="extra.dni" type="text" class="input" placeholder="Documento" />
              </div>
            </div>
            <div class="mt-1">
              <div id="extraChargeBrick_container"></div>
            </div>
          </div>

          <div class="p-6 border-t flex items-center justify-end gap-2">
            <button class="btn-gray" @click="closeExtraModal">Cancelar</button>
            <button class="btn-primary" :disabled="extra.loading || !extra.mpReady" @click="submitExtraCharge">
              {{ extra.loading ? 'Procesando…' : 'Cobrar' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white"
        :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
      >
        {{ toast.text }}
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import api from '../../../services/apiService';
import { getVehicleType } from '../../../utils/vehicleTypeIconTraslation';
import {
  reservationMessages,
  ReservationMessageStatus,
  statusColors
} from '../../../logic/useReservationMessages';
import StatusModal from '../addSpacePage/StatusModal.vue';
import ConfirmModal from '../../common/ConfirmModal.vue';
import ItemSkeleton from '../../layout/skeletons/ItemSkeleton.vue';
import { loadMercadoPago } from '@mercadopago/sdk-js';

const userStore = useUserStore();

const reservations = ref<any[]>([]);
const loading = ref(true);

const showConfirmModal = ref(false);
const showErrorModal = ref(false);

const selectedReservation = ref<any>(null);
const errorMessage = ref('');
const quote = ref<any>(null);
const quoteLoading = ref(false);

// countdown / progress
const countdowns = ref<Record<number, string>>({});
const progress = ref<Record<number, number>>({});
let timer: number | undefined;

// extra-charge
const extra = ref<{
  show: boolean;
  amountCents: number;
  email: string;
  dni: string;
  loading: boolean;
  mpReady: boolean;
  controller?: any;
}>({
  show: false,
  amountCents: 0,
  email: '',
  dni: '',
  loading: false,
  mpReady: false,
  controller: undefined,
});

// modals / toast
const modalConfig = ref({ message: '', buttonText: 'Aceptar', onConfirm: () => {} });
const toast = ref<{ show: boolean; type: 'success' | 'error'; text: string }>({ show: false, type: 'success', text: '' });
function showToast(text: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, type, text };
  setTimeout(() => (toast.value.show = false), 2600);
}

// helpers
const formatDate = (value: string | Date) => new Date(value).toLocaleString();
const formatCents = (c: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format((c || 0) / 100);
const getStatusInfo = (status: ReservationMessageStatus) => ({ label: reservationMessages[status].label, message: reservationMessages[status].owner });
const hasHold = (r: any) => !!r?.payment_id && Number(r?.hold_amount_cents || 0) > 0;
const cardDisabled = (r: any) => extra.value.show && selectedReservation.value?.id === r.id;

// fetch
const fetchReservations = async () => {
  const userId = userStore.user?.id;
  if (!userId) { reservations.value = []; loading.value = false; return; }
  loading.value = true;
  try {
    const { data } = await api.get(`reservations/incoming/${userId}`);
    reservations.value = data || [];
    updateNow(); // primer render del contador
  } catch (e) {
    reservations.value = [];
  } finally {
    loading.value = false;
  }
};

// acciones basicas
function askApprove(res: any) {
  selectedReservation.value = res;
  modalConfig.value = {
    message: '¿Aprobar esta reserva? Quedas comprometido a recibir al usuario.',
    buttonText: 'Confirmar',
    onConfirm: async () => {
      try {
        await api.put(`/reservations/${res.id}/status`, { status: 'approved' });
        await fetchReservations();
        showToast('Reserva aprobada');
      } catch (err: any) {
        errorMessage.value = err?.response?.data?.message || 'Error al aprobar';
        showErrorModal.value = true;
      }
    }
  };
  showConfirmModal.value = true;
}

function askReject(res: any) {
  selectedReservation.value = res;
  modalConfig.value = {
    message: '¿Rechazar esta reserva? El usuario será notificado.',
    buttonText: 'Rechazar',
    onConfirm: async () => {
      try {
        await api.put(`/reservations/${res.id}/cancel`, { status: 'cancelled' });
        await fetchReservations();
        showToast('Reserva cancelada', 'success');
      } catch (err: any) {
        errorMessage.value = err?.response?.data?.message || 'Error al cancelar';
        showErrorModal.value = true;
      }
    }
  };
  showConfirmModal.value = true;
}

function askVerifyCheckin(res: any) {
  selectedReservation.value = res;
  modalConfig.value = {
    message: '¿Confirmar verificación de código de ingreso?',
    buttonText: 'Confirmar',
    onConfirm: async () => {
      try {
        // Paso de "approved" → "verified"
        await api.put(`/reservations/${res.id}/status`, { status: 'verified' });
        await fetchReservations();
        showToast('Check-in verificado');
      } catch (err: any) {
        errorMessage.value = err?.response?.data?.message || 'Error al verificar ingreso';
        showErrorModal.value = true;
      }
    }
  };
  showConfirmModal.value = true;
}

async function moveToInProgress(res: any) {
  try {
    await api.put(`/reservations/${res.id}/status`, { status: 'in_progress' });
    await fetchReservations();
    showToast('Tiempo iniciado');
  } catch {
    showToast('No se pudo iniciar el tiempo', 'error');
  }
}

// finalizar y cobrar
async function askFinalize(res: any) {
  selectedReservation.value = res;
  try {
    quoteLoading.value = true;
    const { data } = await api.get(`/reservations/${res.id}/capture-quote`);
    quote.value = data;

    let message = `Total a cobrar: ${formatCents(data.final_cents)}`;
    if (data.penalty_cents > 0) message += `\nPenalidad: ${formatCents(data.penalty_cents)}`;
    if (data.remainder_cents > 0) message += `\nFalta cobrar: ${formatCents(data.remainder_cents)}`;

    modalConfig.value = {
      message,
      buttonText: 'Finalizar y cobrar',
      onConfirm: () => finalize()
    };
    showConfirmModal.value = true;
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || 'No se pudo calcular el total';
    showErrorModal.value = true;
  } finally {
    quoteLoading.value = false;
  }
}

async function finalize() {
  if (!selectedReservation.value || !quote.value) return;
  try {
    const { data } = await api.post(`/payments/${selectedReservation.value.id}/finalize`, {
      final_amount_cents: quote.value.final_cents,
      reason: quote.value.penalty_cents > 0 ? 'Checkout con penalidad' : 'Checkout normal'
    });

    if (data?.extra_payment_required && data?.missing_cents > 0) {
      openExtraChargeModal(data.missing_cents, selectedReservation.value);
      showToast('Falta cobrar diferencia', 'error');
      return;
    }

    await fetchReservations();
    showToast('Pago acreditado', 'success');
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || 'No se pudo finalizar la reserva';
    showErrorModal.value = true;
  } finally {
    selectedReservation.value = null;
    quote.value = null;
  }
}

// extra-charge
async function openExtraChargeModal(amountCents: number, res: any) {
  extra.value.amountCents = Math.round(Number(amountCents));
  extra.value.email = res?.client?.email || '';
  extra.value.dni = '';
  extra.value.show = true;

  await nextTick();
  await initExtraBrick();
}

function closeExtraModal() {
  extra.value.show = false;
  extra.value.mpReady = false;
  if (extra.value.controller) {
    extra.value.controller.unmount();
    extra.value.controller = undefined;
  }
}

async function submitExtraCharge() {
  if (!extra.value.mpReady) return;
  try {
    await (extra.value.controller as any)?.submit();
  } catch {
    // el onSubmit del Brick hace el submit real
  }
}

async function initExtraBrick() {
  const PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY || 'TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74';
  if (!PUBLIC_KEY) {
    showToast('Falta VITE_MP_PUBLIC_KEY', 'error');
    return;
  }
  await loadMercadoPago();
  const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();

  // limpiar instancia previa si existiera
  if (extra.value.controller) {
    extra.value.controller.unmount();
    extra.value.controller = undefined;
  }

  extra.value.controller = await bricksBuilder.create('cardPayment', 'extraChargeBrick_container', {
    initialization: {
      amount: Number((extra.value.amountCents || 0) / 100),
      payer: { email: extra.value.email || '' },
    },
    customization: {
      visual: { style: { theme: 'default' } },
      paymentMethods: { maxInstallments: 1 },
    },
    callbacks: {
      onReady: () => { extra.value.mpReady = true; },
      onSubmit: async (cardFormData: any) => {
        try {
          extra.value.loading = true;

          const token = cardFormData?.token;
          const method = cardFormData?.payment_method_id;
          if (!token || !method) {
            showToast('Datos de tarjeta inválidos', 'error');
            extra.value.loading = false;
            return;
          }

          // 1) Cobrar diferencia
          await api.post(`/payments/${selectedReservation.value.id}/extra-charge`, {
            amount_cents: extra.value.amountCents,
            description: `Cobro adicional reserva #${selectedReservation.value.id}`,
            token,
            payment_method_id: method,
            installments: 1,
            email: extra.value.email,
            dni: String(extra.value.dni || '')
          });

          // 2) Finalizar con el total calculado previamente
          const finalCents = quote.value?.final_cents || 0;
          await api.post(`/payments/${selectedReservation.value.id}/finalize`, {
            final_amount_cents: finalCents,
            reason: 'Checkout con cobro adicional'
          });

          closeExtraModal();
          await fetchReservations();
          showToast('Diferencia cobrada y reserva finalizada', 'success');
        } catch (err: any) {
          showToast(err?.response?.data?.message || 'No se pudo cobrar la diferencia', 'error');
        } finally {
          extra.value.loading = false;
        }
      },
      onError: () => showToast('Error en el formulario de pago', 'error'),
    },
  });
}

// countdown + progress
function pad(n: number) { return String(n).padStart(2, '0'); }
function diffToHMS(ms: number) {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}
function clamp(v: number, min=0, max=100) { return Math.max(min, Math.min(max, v)); }

function updateNow() {
  const now = Date.now();
  reservations.value.forEach((r) => {
    const start = new Date(r.start_time).getTime();
    const end = new Date(r.end_time).getTime();
    if (r.status === 'in_progress') {
      countdowns.value[r.id] = diffToHMS(end - now);
      const pct = (now - start) / (end - start) * 100;
      progress.value[r.id] = clamp(isFinite(pct) ? pct : 0);
    } else {
      // reset visuales si no aplica
      if (countdowns.value[r.id]) delete countdowns.value[r.id];
      if (progress.value[r.id]) delete progress.value[r.id];
    }
  });
}

onMounted(async () => {
  await fetchReservations();
  timer = window.setInterval(updateNow, 1000) as unknown as number;
});
onUnmounted(() => { if (timer) window.clearInterval(timer); });
</script>

<style scoped>
/* Buttons */
.btn-green { @apply bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2; }
.btn-red { @apply bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2; }
.btn-indigo { @apply bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2; }
.btn-primary { @apply bg-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-amber { @apply bg-amber-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-gray { @apply px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800; }
.btn-gray-outline { @apply px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50; }

/* Pills + inputs */
.pill { @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border; }
.input { @apply mt-1 w-full border rounded-lg px-3 py-2; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
