<template>
  <div class="flex flex-col min-h-screen bg-secondary lexend xl:w-11/12 mx-auto">
    <MainHeader />
    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">
      <BackButton class="lg:hidden" />
      <section class="w-full md:grid md:grid-cols-9 flex flex-col gap-2">
        <h1 class="text-primary text-2xl text-start md:text-3xl py-6 px-6 col-span-5 row-span-1">
          Confirmá tu Pago
        </h1>

        <!-- Resumen del Espacio y Reserva -->
        <div class="md:col-span-4 md:row-start-2 md:col-start-6 h-full">
          <div class="bg-white p-8 rounded-lg shadow-md flex items-start">
            <img
              v-if="espacio && espacio.images && espacio.images[0]"
              :src="`${baseURL}${espacio.images[0]}`"
              alt="Imagen del espacio"
              class="w-28 h-28 object-cover rounded-lg shadow-md mr-6"
            />
            <div>
              <h3 class="text-md font-semibold text-gray-800">{{ espacio?.name }}</h3>
              <p class="text-gray-700 text-sm">{{ espacio?.location }}</p>
              <div class="flex flex-row items-center gap-1 text-gray-800 text-sm">
                <span><span class=" text-yellow-600">★</span>4,70</span>
                <span>(32)</span>
                <span>Excelente</span>
              </div>
            </div>
          </div>

          <!-- CONCEPTOS FACTURADOS (estilo Airbnb) -->
          <div class="md:col-span-4 bg-white p-6 rounded-lg shadow-md items-start border-t-2">
            <p class="text-xl pb-2 border-b col-span-2">CONCEPTOS FACTURADOS</p>

            <div class="grid grid-cols-2 gap-y-3 pt-4">
              <p class="text-lg text-gray-600">
                Precio por {{ hours }} horas y {{ minutes }} minutos
              </p>
              <p class="text-lg text-end text-gray-800 font-medium">
                {{ formatARS(baseAmount) }}
              </p>

              <p class="text-lg text-gray-600">
                Cargo por servicio ({{ Math.round(SERVICE_FEE_PCT * 100) }}%)
              </p>
              <p class="text-lg text-end text-gray-800 font-medium">
                {{ formatARS(serviceFeeAmount) }}
              </p>
            </div>
          </div>

          <div class="col-span-4 grid grid-cols-2 bg-white p-6 rounded-lg shadow-md items-center border-t-2">
            <p class="text-lg font-semibold">Total a pagar</p>
            <p class="text-2xl font-bold text-end text-primary">
              {{ formatARS(totalGuestPays) }}
            </p>
            <p class="col-span-2 text-xs text-gray-500 mt-3">
              * Si el estacionamiento se extiende más allá del horario reservado, podrían aplicarse
              cargos adicionales por sobretiempo al finalizar (penalidad).
            </p>
          </div>
        </div>

        <!-- Datos de Facturación con Vehículo -->
        <div class="bg-white p-6 rounded-lg shadow-md md:col-span-5 flex flex-col gap-6">
          <!-- Vehículo seleccionado -->
          <div v-if="reserva.vehicle_type" class="bg-gray-100 p-4 rounded border border-gray-300 shadow-sm">
            <div class="flex flex-row items-center justify-between">
              <h3 class="text-md font-semibold text-gray-700 mb-1">Vehículo Seleccionado</h3>
              <font-awesome-icon
                :icon="
                  reserva.vehicle_type === 'car'
                    ? 'car'
                    : reserva.vehicle_type === 'motorcycle'
                    ? 'motorcycle'
                    : reserva.vehicle_type === 'bicycle'
                    ? 'bicycle'
                    : 'question'
                "
                class="text-gray-600 mr-2"
              />
            </div>
            <div v-if="vehiculoSeleccionado">
              <p>Marca: {{ vehiculoSeleccionado.brand }}</p>
              <p>Modelo: {{ vehiculoSeleccionado.model }}</p>
              <p>Patente: {{ vehiculoSeleccionado.license_plate ?? 'No aplica' }}</p>
            </div>
          </div>

          <!-- Formulario de Facturación -->
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-semibold mb-2">Datos de Facturación</h2>
            <FormField v-model="nombre" placeholder="Nombre completo" />
            <FormField v-model="dni" placeholder="Número de documento" />
            <FormField v-model="direccion" placeholder="Domicilio" />
            <FormField v-model="email" placeholder="Correo electrónico" />
          </div>
        </div>

        <!-- Pago con Tarjeta (MercadoPago Card Payment Brick) -->
        <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md md:col-span-full">
          <div id="cardPaymentBrick_container"></div>
        </div>

        <!-- Botón de Confirmación para otros métodos (simulado) -->
        <div v-if="metodoPago !== 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
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
import { useRouter, useRoute } from 'vue-router';
import api, { baseURL } from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { getSpaceById } from '../services/spaceService';
import BackButton from '../components/common/BackButton.vue';
import MainHeader from "../components/layout/header/MainHeader.vue";
import { getVehicleById } from '../services/vehicleService';
import FormField from '../components/forms/FormField.vue';

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// ===== UI helpers
const formatARS = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));

// ===== Inputs/estado
const metodoPago = ref("tarjeta");
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");

// Reserva base que viene del store
const reserva = computed(() => reservationStore.reservation);

// Duración
const totalDuration = computed(() => reserva.value?.dead_line ?? 0);
const hours = computed(() => (totalDuration.value ? Math.floor(totalDuration.value) : 0));
const minutes = computed(() => (totalDuration.value ? Math.round((totalDuration.value - hours.value) * 60) : 0));

// Precio base publicado por el anfitrión (lo que antes llamabas total)
const baseAmount = computed(() => Number(reserva.value.total || 0));

// % de cargo por servicio visible al huésped (controlable por .env del front)
const SERVICE_FEE_PCT =
  Number((import.meta as any).env?.VITE_SERVICE_FEE_PCT ?? 0.15);

// Monto del cargo de servicio y total a pagar por el huésped
const serviceFeeAmount = computed(() => {
  // redondeo a 2 decimales para UI; MercadoPago aceptará el número normalizado
  return Math.round(baseAmount.value * SERVICE_FEE_PCT * 100) / 100;
});
const totalGuestPays = computed(() => {
  return Math.round((baseAmount.value + serviceFeeAmount.value) * 100) / 100;
});

const startTime = computed(() => reserva.value.start_time);
const endTime = computed(() => reserva.value.end_time);
const espacio = ref<any>(null);
const vehiculoSeleccionado = ref<any>(null);

// Cargar info espacio
const obtenerEspacio = async () => {
  try {
    const id = reserva.value.space_id;
    if (!id) throw new Error("No se encontró el espacio");
    const data = await getSpaceById(Number(id));
    espacio.value = data;
    return data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();

  if (!reservationStore.reservation.space_id || !reservationStore.reservation.start_time) {
    console.error('Error en envío de datos.');
    router.push('/dashboard');
    return;
  }

  if (metodoPago.value === 'tarjeta') {
    await nextTick();
    setTimeout(async () => {
      await initCardBrick();
    }, 300);
  }

  const vehicle_id = reservationStore.reservation.vehicle_id;
  if (vehicle_id) {
    const vehicleSelect = await getVehicleById(vehicle_id);
    vehiculoSeleccionado.value = vehicleSelect;
  }
});

watch(metodoPago, async (newVal) => {
  if (newVal === 'tarjeta') {
    await nextTick();
    setTimeout(async () => {
      await initCardBrick();
    }, 300);
  }
});

let cardForm: any = null;

// ======= MP Brick
const initCardBrick = async () => {
  await loadMercadoPago();

  if (totalGuestPays.value <= 0) {
    alert("El monto a pagar no es válido.");
    return;
  }

  const PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY || 'TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74';
  const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();

  const settings = {
    initialization: {
      // ⚠️ Ahora cobramos el TOTAL al huésped (base + fee)
      amount: Number(totalGuestPays.value),
      payer: {
        email: email.value || "",
      },
    },
    customization: {
      visual: { style: { theme: 'default' } },
      paymentMethods: { maxInstallments: 1 },
    },
    callbacks: {
      onReady: () => { console.log("Brick is ready"); },
      onSubmit: async (cardFormData: any) => {
        const tokenGenerado = cardFormData?.token;
        const monto = Number(cardFormData?.transaction_amount ?? totalGuestPays.value);
        const paymentMethodId = cardFormData?.payment_method_id;
        await confirmarPagoMercadoPago(tokenGenerado, monto, paymentMethodId);
      },
      onError: (error: any) => { console.error("Error en el Brick:", error); },
    },
  };

  if ((window as any).cardPaymentBrickController) {
    (window as any).cardPaymentBrickController.unmount();
  }

  const container = document.getElementById("cardPaymentBrick_container");
  if (container) {
    container.innerHTML = "";
    (window as any).cardPaymentBrickController = await bricksBuilder.create(
      'cardPayment',
      'cardPaymentBrick_container',
      settings
    );
  } else {
    console.error("No se encontró el contenedor 'cardPaymentBrick_container'");
  }
};

// ======= Confirmar pago (crea reserva + hold en backend)
const confirmarPagoMercadoPago = async (token: string, amount: number, paymentMethodReal: string) => {
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    alert("Por favor, completa todos los datos de facturación antes de pagar.");
    return;
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

  // 1) crear reserva en pending
  let reservationResponse: any;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    alert("Ocurrió un error al crear la reserva. Intenta nuevamente.");
    return;
  }

  const reservationId = reservationResponse?.reservation?.id || reservationResponse?.data?.reservation?.id;
  if (!reservationId) {
    console.error("reservationId no encontrado en la respuesta:", reservationResponse);
    alert("Error interno: no se pudo obtener el ID de la reserva.");
    return;
  }

  // 2) Enviar HOLD (total base + fee) al backend
  const payload = {
    reservation_id: reservationId,
    transaction_amount: Number(amount), // total cobrado al huésped
    description: `Pago para la reserva #${reservationId}`,
    email: email.value,
    payment_method_id: paymentMethodReal,
    token,
    issuer_id: 310,
    payer: {
      email: email.value,
      identification: { type: "DNI", number: dni.value.toString() },
    },
    installments: 1,
    // (Opcional) Enviamos desglose para logging/analítica del BE
    breakdown: {
      base_amount: Number(baseAmount.value),
      service_fee_amount: Number(serviceFeeAmount.value),
      total: Number(totalGuestPays.value),
      service_fee_pct: SERVICE_FEE_PCT
    }
  };

  try {
    const response = await api.post('/payments/hold', payload);
    if (response.status === 201) {
      console.log("Hold autorizado correctamente");
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    alert("Ocurrió un error al procesar el pago. Intenta nuevamente.");
  }
};

// Otros métodos simulados
const confirmarPagoSimulado = async () => {
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    alert("Por favor, completa todos los datos de facturación.");
    return;
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
      alert("Pago confirmado mediante " + metodoPago.value);
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }
    return response.data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    alert("Ocurrió un error al procesar la solicitud. Por favor, intenta nuevamente más tarde");
  }
};
</script>

<style scoped>
#form-checkout {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.container {
  height: 18px;
  display: inline-block;
  border: 1px solid rgb(118, 118, 118);
  border-radius: 2px;
  padding: 1px 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
