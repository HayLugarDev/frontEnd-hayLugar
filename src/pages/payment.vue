<template>
  <!-- Loader mientras verificamos pago -->
  <div v-if="isCheckingPayment"
       class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-6"></div>
    <p class="text-lg font-semibold text-white">
      Procesando tu pago…
    </p>
    <p class="text-sm text-gray-300 mt-2">
      Esto puede tardar unos segundos
    </p>
  </div>

  <div class="flex flex-col min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white font-lexend max-w-7xl mx-auto px-4">
    <MainHeader />

    <main class="py-10">
      <section class="grid grid-cols-1 md:grid-cols-9 gap-6">
        <h1 class="text-primary text-3xl col-span-full font-bold mb-2">
          Confirmá tu Pago
        </h1>

        <!-- RESUMEN -->
        <div class="md:col-span-4 flex flex-col gap-5">

          <div class="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md">
            <h3 class="text-lg font-semibold">{{ espacio?.space?.name }}</h3>
            <p class="text-gray-400 text-sm">{{ espacio?.space?.location }}</p>
          </div>

          <div class="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md">
            <p class="text-xl font-semibold border-b pb-2 mb-2">Conceptos facturados</p>

            <div class="grid grid-cols-2 gap-y-3">
              <p class="text-gray-400">Precio base</p>
              <p class="text-end font-medium">{{ formatARS(baseAmount) }}</p>

              <p class="text-gray-400">Cargo por servicio</p>
              <p class="text-end font-medium">{{ formatARS(serviceFeeAmount) }}</p>
            </div>
          </div>

          <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md grid grid-cols-2 items-center">
            <p class="text-lg font-semibold">Total a pagar</p>
            <p class="text-2xl font-bold text-end text-primary">
              {{ formatARS(totalGuestPays) }}
            </p>
          </div>
        </div>

        <!-- FACTURACIÓN + PAGO -->
        <div class="md:col-span-5">
          <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-6">

            <h2 class="text-lg font-semibold">Datos de Facturación</h2>

            <FormField v-model="nombre" placeholder="Nombre completo" />
            <FormField v-model="dni" placeholder="Número de documento" />
            <FormField v-model="direccion" placeholder="Domicilio" />
            <FormField v-model="email" placeholder="Correo electrónico" />

            <p v-if="email && !emailValido" class="text-red-500 text-sm">
              Ingresá un correo electrónico válido.
            </p>

            <button
              :disabled="!datosCompletos"
              @click="iniciarPago"
              class="mt-4 w-full bg-primary disabled:opacity-40 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-md hover:shadow-xl transition-all"
            >
              Pagar con Mercado Pago
            </button>

            <div id="walletBrick_container" class="mt-6" />
          </div>
        </div>
      </section>
    </main>

    <StatusModal
      :visible="showErrorModal"
      type="error"
      title="Error"
      :message="errorMessage"
      @confirm="showErrorModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import api from "../services/apiService";
import { useReservationStore } from "../store/reservationStore";
import MainHeader from "../components/layout/header/MainHeader.vue";
import FormField from "../components/forms/FormField.vue";
import StatusModal from "../components/pages/addSpacePage/StatusModal.vue";
import { getReservationForPayment } from "../services/reservationService";

const router = useRouter();
const reservationStore = useReservationStore();
const reserva = computed(() => reservationStore.reservation);

const espacio = ref<any>(null);

const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");

const showErrorModal = ref(false);
const errorMessage = ref("");
const isCheckingPayment = ref(false);

const baseAmount = computed(() => Number(reserva.value?.total || 0));
const SERVICE_FEE_PCT = Number(import.meta.env.VITE_SERVICE_FEE_PCT ?? 0.20);
const serviceFeeAmount = computed(() =>
  Math.round(baseAmount.value * SERVICE_FEE_PCT * 100) / 100
);
const totalGuestPays = computed(() =>
  Math.round((baseAmount.value + serviceFeeAmount.value) * 100) / 100
);

const formatARS = (v: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(v || 0));

const emailValido = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value.trim());
});

const datosCompletos = computed(() =>
  nombre.value &&
  dni.value &&
  direccion.value &&
  emailValido.value
);

onMounted(async () => {
  const query = router.currentRoute.value.query;

  // 🔁 Vuelta desde Mercado Pago
  if (query.payment_id || query.status) {
    isCheckingPayment.value = true;
    window.history.replaceState({}, "", "/pago");

    if (reserva.value?.id) {
      await checkPaymentStatus(String(reserva.value.id));
    }
    return;
  }

  if (!reserva.value?.id) {
    router.push("/dashboard");
    return;
  }

  espacio.value = await getReservationForPayment(reserva.value.id);
});

const iniciarPago = async () => {
  try {
    await loadMercadoPago();

    const reservationId = reserva.value?.id;
    if (!reservationId) throw new Error("Reserva inválida");

    reservationStore.setReservationData({
      payment_method: "cuenta_mp",
      payment_data: {
        invoice_name: nombre.value,
        invoice_dni: dni.value,
        invoice_address: direccion.value,
        invoice_email: email.value,
      },
    });

    await reservationStore.syncReservation();

    const res = await api.post(
      "/payments/create-preference",
      { reservation_id: reservationId, email: email.value },
      { withCredentials: true }
    );

    const preferenceId = res.data.preference_id;

    const mp = new window.MercadoPago(
      import.meta.env.VITE_MP_PUBLIC_KEY,
      { locale: "es-AR" }
    );

    const bricksBuilder = mp.bricks();

    await bricksBuilder.create("wallet", "walletBrick_container", {
      initialization: {
        preferenceId,
        redirectMode: "modal",
      },
      customization: {
        theme: "dark",
      },
    });

  } catch (error) {
    console.error(error);
    showErrorModal.value = true;
    errorMessage.value = "No se pudo iniciar el pago.";
  }
};

const checkPaymentStatus = async (reservationId: string) => {
  const maxAttempts = 15;
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    const res = await api.get(`/payments/u/${reservationId}/payment-status`);
    const status = res.data.status;

    if (status === "approved") {
      clearInterval(interval);
      router.push("/confirmacion");
      return;
    }

    if (status === "failed") {
      clearInterval(interval);
      isCheckingPayment.value = false;
      showErrorModal.value = true;
      errorMessage.value = "El pago fue rechazado.";
      return;
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      isCheckingPayment.value = false;
      showErrorModal.value = true;
      errorMessage.value = "No se pudo confirmar el pago.";
    }
  }, 4000);
};
</script>