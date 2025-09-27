<template>
  <div class="flex flex-col min-h-screen bg-secondary lexend xl:w-11/12 mx-auto">
    <MainHeader />

    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">
      <BackButton class="lg:hidden" />

      <section class="w-full md:grid md:grid-cols-9 flex flex-col gap-6">
        <!-- Título -->
        <h1 class="text-primary text-2xl md:text-3xl py-6 px-6 col-span-9 font-bold">
          Confirmá tu Pago
        </h1>

        <!-- Resumen espacio -->
        <div class="md:col-span-4 flex flex-col gap-4">
          <div class="bg-white p-6 rounded-lg shadow-md flex items-start">
            <img
              v-if="espacio?.images?.[0]"
              :src="espacio.images[0]"
              alt="Imagen del espacio"
              class="w-28 h-28 object-cover rounded-lg shadow-md mr-6"
            />
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ espacio?.name }}</h3>
              <p class="text-gray-600 text-sm">{{ espacio?.location }}</p>
              <div class="flex items-center gap-1 text-gray-700 text-sm mt-1">
                <span><span class="text-yellow-600">★</span> 4,7</span>
                <span>(32)</span>
                <span class="font-medium">Excelente</span>
              </div>
            </div>
          </div>

          <!-- Conceptos facturados -->
          <div class="bg-white p-6 rounded-lg shadow-md border-t-2">
            <p class="text-xl font-semibold pb-2 border-b">Conceptos facturados</p>

            <div class="grid grid-cols-2 gap-y-3 pt-4">
              <p class="text-gray-600">
                Precio por {{ hours }}h {{ minutes }}m
              </p>
              <p class="text-end text-gray-800 font-medium">
                {{ formatARS(baseAmount) }}
              </p>

              <p class="text-gray-600">
                Cargo por servicio ({{ Math.round(SERVICE_FEE_PCT * 100) }}%)
              </p>
              <p class="text-end text-gray-800 font-medium">
                {{ formatARS(serviceFeeAmount) }}
              </p>
            </div>
          </div>

          <!-- Total -->
          <div class="bg-white p-6 rounded-lg shadow-md border-t-2 grid grid-cols-2 items-center">
            <p class="text-lg font-semibold">Total a pagar</p>
            <p class="text-2xl font-bold text-end text-primary">
              {{ formatARS(totalGuestPays) }}
            </p>
            <p class="col-span-2 text-xs text-gray-500 mt-3 leading-snug">
              * Si el estacionamiento se extiende más allá del horario reservado,
              podrían aplicarse cargos adicionales por sobretiempo (penalidad).
            </p>
          </div>
        </div>

        <!-- Datos de facturación -->
        <div class="bg-white p-6 rounded-lg shadow-md md:col-span-5 flex flex-col gap-6">
          <!-- Vehículo seleccionado -->
          <div
            v-if="reserva.vehicle_type"
            class="bg-gray-100 p-4 rounded border border-gray-300 shadow-sm"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-md font-semibold text-gray-700">Vehículo Seleccionado</h3>
              <font-awesome-icon
                :icon="reserva.vehicle_type === 'car'
                  ? 'car'
                  : reserva.vehicle_type === 'motorcycle'
                  ? 'motorcycle'
                  : reserva.vehicle_type === 'bicycle'
                  ? 'bicycle'
                  : 'question' "
                class="text-gray-600"
              />
            </div>
            <div v-if="vehiculoSeleccionado">
              <p>Marca: {{ vehiculoSeleccionado.brand }}</p>
              <p>Modelo: {{ vehiculoSeleccionado.model }}</p>
              <p>Patente: {{ vehiculoSeleccionado.license_plate ?? 'No aplica' }}</p>
            </div>
          </div>

          <!-- Formulario -->
          <div class="flex flex-col gap-2">
            <h2 class="text-lg font-semibold mb-2">Datos de Facturación</h2>
            <FormField v-model="nombre" placeholder="Nombre completo" />
            <FormField v-model="dni" placeholder="Número de documento" />
            <FormField v-model="direccion" placeholder="Domicilio" />
            <FormField v-model="email" placeholder="Correo electrónico" />
          </div>
        </div>

        <!-- Pago con Tarjeta -->
        <div
          v-if="metodoPago === 'tarjeta'"
          class="bg-white p-6 rounded-lg shadow-md md:col-span-full"
        >
          <div id="cardPaymentBrick_container"></div>
        </div>

        <!-- Botón de confirmación para otros métodos -->
        <div
          v-if="metodoPago !== 'tarjeta'"
          class="bg-white p-6 rounded-lg shadow-md sticky bottom-0 md:static"
        >
          <button
            @click="confirmarPagoSimulado"
            class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
          >
            <font-awesome-icon icon="check-circle" class="mr-2" />
            Confirmar y Pagar
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { getSpaceById } from '../services/spaceService';
import { getVehicleById } from '../services/vehicleService';
import BackButton from '../components/common/BackButton.vue';
import MainHeader from "../components/layout/header/MainHeader.vue";
import FormField from '../components/forms/FormField.vue';

const router = useRouter();
const reservationStore = useReservationStore();

// ==== Helpers
const formatARS = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));

// ==== Inputs
const metodoPago = ref("tarjeta");
const nombre = ref(""); const dni = ref(""); const direccion = ref(""); const email = ref("");

// ==== Reserva del store
const reserva = computed(() => reservationStore.reservation);

// Duración
const totalDuration = computed(() => reserva.value?.dead_line ?? 0);
const hours = computed(() => Math.floor(totalDuration.value));
const minutes = computed(() => Math.round((totalDuration.value - hours.value) * 60));

// Monto base y fee
const baseAmount = computed(() => Number(reserva.value.total || 0));
const SERVICE_FEE_PCT = Number((import.meta as any).env?.VITE_SERVICE_FEE_PCT ?? 0.15);
const serviceFeeAmount = computed(() => Math.round(baseAmount.value * SERVICE_FEE_PCT * 100) / 100);
const totalGuestPays = computed(() => Math.round((baseAmount.value + serviceFeeAmount.value) * 100) / 100);

const espacio = ref<any>(null);
const vehiculoSeleccionado = ref<any>(null);

// ==== Obtener espacio
const obtenerEspacio = async () => {
  try {
    const id = reserva.value.space_id;
    if (!id) throw new Error("No se encontró el espacio");
    espacio.value = await getSpaceById(Number(id));
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();

  if (!reserva.value.space_id || !reserva.value.start_time) {
    router.push('/dashboard');
    return;
  }

  if (metodoPago.value === 'tarjeta') {
    await nextTick();
    setTimeout(initCardBrick, 300);
  }

  if (reserva.value.vehicle_id) {
    vehiculoSeleccionado.value = await getVehicleById(reserva.value.vehicle_id);
  }
});

watch(metodoPago, async (newVal) => {
  if (newVal === 'tarjeta') {
    await nextTick();
    setTimeout(initCardBrick, 300);
  }
});

// ==== MP Brick
const initCardBrick = async () => {
  await loadMercadoPago();
  if (totalGuestPays.value <= 0) return alert("Monto inválido.");

  const PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY || 'TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74';
  const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();

  const settings = {
    initialization: {
      amount: Number(totalGuestPays.value), // ⚠️ total huésped
      payer: { email: email.value || "" },
    },
    customization: {
      visual: { style: { theme: 'default' } },
      paymentMethods: {
        maxInstallments: 1,
        // Permitimos todos, pero controlamos en onSubmit qué hacer
      },
    },
    callbacks: {
      onReady: () => console.log("Brick listo"),
      onSubmit: async (cardFormData: any) => {
        const token = cardFormData?.token;
        const monto = Number(cardFormData?.transaction_amount ?? totalGuestPays.value);
        const method = cardFormData?.payment_method_id;
        await confirmarPagoMercadoPago(token, monto, method);
      },
      onError: (error: any) => console.error("Error en el Brick:", error),
    },
  };

  if ((window as any).cardPaymentBrickController) {
    (window as any).cardPaymentBrickController.unmount();
  }

  await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings)
    .then(ctrl => (window as any).cardPaymentBrickController = ctrl);
};

// ==== Confirmar pago
const confirmarPagoMercadoPago = async (token: string, amount: number, method: string) => {
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    return alert("Completa los datos de facturación.");
  }

  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value
    }
  });

  let reservationResponse: any;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch {
    return alert("Error creando la reserva. Intenta nuevamente.");
  }

  const reservationId = reservationResponse?.reservation?.id;
  if (!reservationId) return alert("Error interno: reserva sin ID.");

  // 🚨 Fallback: si es débito, pedimos captura inmediata
  const isDebit = method?.toLowerCase().includes("deb");
  const payload: any = {
  reservation_id: reservationId,
  transaction_amount: Number(amount),
  description: `Pago para la reserva #${reservationId}`,
  email: email.value,
  payment_method_id: method,
  token,
  payer: {
    email: email.value,
    identification: { type: "DNI", number: dni.value.toString() },
  },
  installments: 1,
  breakdown: {
    service_fee_amount: serviceFeeAmount.value,
    total: totalGuestPays.value
  }
};

  if (isDebit) {
    payload.force_capture = true; // el backend lo interpreta como "cobro directo"
  }

  try {
    const response = await api.post('/payments/hold', payload);
    if (response.status === 201) {
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }
  } catch {
    alert("Error al procesar el pago. Intenta nuevamente.");
  }
};

// ==== Otros métodos simulados
const confirmarPagoSimulado = async () => {
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    return alert("Completa los datos de facturación.");
  }

  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value
    }
  });

  try {
    const response = await reservationStore.submitReservation();
    if (response) {
      alert(`Pago confirmado mediante ${metodoPago.value}`);
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }
  } catch {
    alert("Error al procesar la solicitud. Intenta nuevamente.");
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
