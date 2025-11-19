<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white font-lexend w-full max-w-7xl mx-auto px-4">
    <MainHeader />

    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full py-6">
      <BackButton class="lg:hidden mb-2 text-end" />

      <!-- Usamos grid-cols-1 por defecto y md:grid-cols-9 en desktop -->
      <section class="grid grid-cols-1 md:grid-cols-9 gap-6">
        <!-- 🧾 Título -->
        <h1 class="text-primary text-3xl col-span-full font-bold mb-2">
          Confirmá tu Pago
        </h1>

        <!-- 📋 Resumen -->
        <div class="md:col-span-4 flex flex-col gap-5">
          <!-- Espacio -->
          <div class="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md flex items-start gap-5 hover:shadow-lg transition">
            <!-- Imagen responsiva: tamaños relativos a breakpoint -->
            <img v-if="espacio?.images?.[0]" :src="espacio.images[0]"
              class="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg shadow-sm" />
            <div>
              <h3 class="text-lg font-semibold">{{ espacio?.name }}</h3>
              <p class="text-gray-400 text-sm">{{ espacio?.location }}</p>

              <div class="flex items-center gap-1 text-gray-200 text-sm mt-1">
                <span><span class="text-yellow-600">★</span> {{ espacio?.space_reviews > 0 ?
                  espacio.average_rating.toFixed(1) : '5.0' }}</span>
                <span>({{ espacio?.space_reviews?.length || 0 }})</span>
                <span class="font-medium">{{ ratingLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Conceptos -->
          <div class="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md border-t-2">
            <p class="text-xl font-semibold border-b pb-2 mb-2">Conceptos facturados</p>

            <div class="grid grid-cols-2 gap-y-3">
              <p class="text-gray-400">Precio por {{ hours }}:{{ minutes }} hrs</p>
              <p class="text-end font-medium">{{ formatARS(baseAmount) }}</p>

              <p class="text-gray-400">Cargo por servicio</p>
              <p class="text-end font-medium">{{ formatARS(serviceFeeAmount) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md border-t-2 grid grid-cols-2 items-center">
            <p class="text-lg font-semibold">Total a pagar</p>
            <p class="text-2xl font-bold text-end text-primary">
              {{ formatARS(totalGuestPays) }}
            </p>
            <p class="col-span-2 text-xs text-gray-300 mt-3">
              * Si el estacionamiento se extiende más allá del horario reservado, podrían aplicarse cargos adicionales
              por sobretiempo.
            </p>

            <p class="col-span-2 text-xs text-gray-300 mt-4">
              Al confirmar el pago, aceptás nuestros
              <a href="/terminos-y-condiciones" target="_blank" class="text-primary underline">Términos y
                Condiciones</a>
              y
              <a href="/politica-de-privacidad" target="_blank" class="text-primary underline">Política de
                Privacidad</a>.
            </p>
          </div>
        </div>

        <!-- 🧍 Datos de facturación -->
        <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md md:col-span-5 flex flex-col gap-4">
          <!-- Vehículo -->
          <div v-if="reserva.vehicle_type" class="bg-white/10 border-white/10 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-md font-semibold text-white">Vehículo Seleccionado</h3>
              <font-awesome-icon
                :icon="reserva.vehicle_type === 'car' ? 'car' : reserva.vehicle_type === 'motorcycle' ? 'motorcycle' : 'bicycle'"
                class="text-white" />
            </div>
            <div v-if="vehiculoSeleccionado" class="text-gray-200">
              <p>Marca: {{ vehiculoSeleccionado.brand }}</p>
              <p>Modelo: {{ vehiculoSeleccionado.model }}</p>
              <p>Patente: {{ vehiculoSeleccionado.license_plate ?? 'No aplica' }}</p>
            </div>
          </div>

          <!-- Inputs -->
          <div class="flex flex-col gap-2">
            <h2 class="text-lg font-semibold mb-1">Datos de Facturación</h2>
            <FormField v-model="nombre" placeholder="Nombre completo" />
            <FormField v-model="dni" placeholder="Número de documento" />
            <FormField v-model="direccion" placeholder="Domicilio" />
            <FormField v-model="email" placeholder="Correo electrónico" />
            <p v-if="email && !emailValido" class="text-red-500 text-sm">
              Ingresá un correo electrónico válido.
            </p>
          </div>

          <!-- Continuar -->
          <button v-if="datosCompletos" @click="selectedMethod = true"
            class="mt-4 w-full flex justify-center items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-lg font-bold shadow-md hover:shadow-xl transition-all">
            Continuar
          </button>
        </div>
      </section>

      <!-- 💳 Método de pago -->
      <div v-if="datosCompletos && selectedMethod" class="w-full flex flex-col items-center gap-4 mt-10 mb-6">
        <h2 class="text-lg font-semibold text-gray-200">Seleccioná el método de pago</h2>

        <div class="flex flex-wrap justify-center gap-4">
          <button @click="verifyPaymentMethod('tarjeta')" :class="[
            'flex items-center gap-3 px-6 py-3 rounded-2xl font-medium border transition-all duration-300 shadow-sm hover:shadow-lg',
            metodoPago === 'tarjeta'
              ? 'bg-primary text-white border-primary scale-105'
              : 'bg-white/10 border border-white/10 text-gray-200 border-gray-300 hover:border-primary/40'
          ]">
            <font-awesome-icon icon="credit-card" class="text-xl" />
            <span>Tarjeta de crédito / débito</span>
          </button>

          <button @click="verifyPaymentMethod('cuenta_mp')" :class="[
            'flex items-center gap-3 px-6 py-3 rounded-2xl font-medium border transition-all duration-300 shadow-sm hover:shadow-lg',
            metodoPago === 'cuenta_mp'
              ? 'bg-[#009ee3] text-white border-[#009ee3] scale-105'
              : 'bg-white/10 border border-white/10 text-gray-200 border-gray-300 hover:border-[#009ee3]/40'
          ]">
            <img src="../assets/logo-mercadopago.png" alt="Mercado Pago" class="h-8 w-auto" />
            <span>Cuenta Mercado Pago</span>
          </button>
        </div>
      </div>

      <!-- 🔹 Brick dinámico -->
      <transition name="fade">
        <div v-if="datosCompletos" :key="metodoPago" class="mt-4 w-full flex justify-center">
          <div v-show="metodoPago === 'cuenta_mp'" id="walletBrick_container" class="w-full max-w-md"></div>
          <div v-show="metodoPago === 'tarjeta'" id="cardPaymentBrick_container" class="w-full max-w-md"></div>
        </div>
      </transition>
    </main>

    <StatusModal :visible="showErrorModal" type="error" title="Faltan datos" :message="errorMessage"
      icon="/src/assets/logo.png" @confirm="showErrorModal = false" />
  </div>

  <!-- ===== FOOTER ===== -->
  <footer class="text-center text-[#B0BEC5] text-sm py-8 border-t border-white/10">
    © {{ new Date().getFullYear() }} HayLugar — Logística Inteligente
  </footer>

</template>


<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { getSpaceById } from '../services/spaceService';
import BackButton from '../components/common/BackButton.vue';
import MainHeader from "../components/layout/header/MainHeader.vue";
import { getVehicleById } from '../services/vehicleService';
import FormField from '../components/forms/FormField.vue';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';

const router = useRouter();
const reservationStore = useReservationStore();

type PaymentMethod = 'tarjeta' | 'cuenta_mp';

// Datos de facturación y reserva (inputs y query)
const metodoPago = ref<PaymentMethod>();
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");
const total = computed(() => reserva.value.total || 0);
const totalDuration = computed(() => reserva.value?.dead_line ?? 0);
const hours = computed(() => { return totalDuration.value ? Math.floor(totalDuration.value) : 0; });
const minutes = computed(() => { return totalDuration.value ? Math.round((totalDuration.value - hours.value) * 60) : 0; });
const espacio = ref<any>(null);
const vehiculoSeleccionado = ref(null);
const selectedMethod = ref(false);

const errorMessage = ref("");
const showErrorModal = ref(false);

const formatARS = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));

const obtenerEspacio = async () => {
  try {
    const id = reserva.value.space_id;
    if (!id) throw new Error("No se encontró el espacio");
    const data = await getSpaceById(Number(id));
    espacio.value = data;
    console.log(espacio.value);
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
  }

  const vehicle_id = reservationStore.reservation.vehicle_id;
  if (vehicle_id) {
    const vehicleSelect = await getVehicleById(vehicle_id);
    vehiculoSeleccionado.value = vehicleSelect;
  }
});

const emailValido = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value.trim());
});

const datosCompletos = computed(() =>
  nombre.value.trim() !== "" &&
  dni.value.trim() !== "" &&
  direccion.value.trim() !== "" &&
  email.value.trim() !== "" &&
  emailValido.value
);

watch(datosCompletos, async (newVal) => {
  if (!newVal) {
    const controller = (window as any).walletBrickController;
    if (controller) {
      try {
        controller.unmount();
        console.log("🧹 Wallet Brick desmontado por datos incompletos");
      } catch (e) {
        console.warn("No se pudo desmontar el Brick:", e);
      }
    }
    errorMessage.value = "Por favor, completa todos los datos de facturación antes de pagar.";
  } else {
    errorMessage.value = "";
  }
});

const verifyPaymentMethod = (method: PaymentMethod) => {
  metodoPago.value = method;
  if (method === 'tarjeta') {
    initCardBrick();
  } else if (method === 'cuenta_mp') {
    initWalletBrick(Number(reserva.value.id));
  }
};

const reserva = computed(() => reservationStore.reservation);

const ratingLabel = computed(() => {
  const rating = espacio.value?.average_rating || 0;

  if (rating >= 4.5) return "Excelente ⭐";
  if (rating >= 3.5) return "Muy bueno 👍";
  if (rating >= 2.5) return "Bueno 🙂";
  if (rating > 0) return "Regular 😐";
  return "Sin calificaciones";
});

// Monto base y fee

const baseAmount = computed(() => Number(reserva.value.total || 0));
const SERVICE_FEE_PCT = Number((import.meta as any).env?.VITE_SERVICE_FEE_PCT ?? 0.20);
const serviceFeeAmount = computed(() => Math.round(baseAmount.value * SERVICE_FEE_PCT * 100) / 100);
const totalGuestPays = computed(() => Math.round((baseAmount.value + serviceFeeAmount.value) * 100) / 100);

// Inicia Brick MercadoPago Wallet
const initWalletBrick = async (reservationId: number) => {
  await loadMercadoPago();

  if (total.value <= 0) {
    alert("El monto a pagar no es válido.");
    return;
  }

  const PUBLIC_KEY =
    (import.meta as any).env?.VITE_MP_PUBLIC_KEY ||
    'TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74';

  const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();

  // Primero pedimos la preference al backend
  try {
    const res = await api.post("/payments/create-preference", {
      reservation_id: reservationId,
      amount: totalGuestPays.value,
      description: "Reserva de espacio",
      email: email.value,
      userId: reserva.value.user_id,
    });

    const preferenceId = res.data.preference_id;
    console.log("🟢 Preferencia creada:", preferenceId);

    await bricksBuilder.create("wallet", "walletBrick_container", {
      initialization: {
        preferenceId,
        redirectMode: "modal",
      },
      customization: {
        theme: "dark",
        texts: { valueProp: "smart_option" },
      },
      callbacks: {
        onReady: () => {
          console.log("🟢 Wallet Brick listo");
        },
        onError: (error: any) => {
          console.error("❌ Error en Wallet Brick:", error);
          showErrorModal.value = true;
          errorMessage.value = "Ocurrió un error al inicializar el pago.";
        },
        onSubmit: () => {
          console.log("💳 Iniciando pago con Wallet...");
          confirmarPagoConCuentaMP(preferenceId);
        },
      },
    });

  } catch (error: any) {
    console.error("❌ Error al crear la preferencia:", error);
    showErrorModal.value = true;
    errorMessage.value = "No se pudo iniciar el proceso de pago. Intenta nuevamente.";
  }
};



// Inicializa el Brick Tarjeta
const initCardBrick = async () => {
  await loadMercadoPago();

  if (total.value <= 0) {
    alert("El monto a pagar no es válido.");
    return;
  }

  // Clave pública desde ENV con fallback
  const PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY || 'TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74';

  const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();

  const settings = {
    initialization: {
      amount: Number(totalGuestPays.value), // número
      payer: {
        email: email.value || "",
      },
    },
    customization: {
      visual: {
        style: {
          theme: 'default',
        },
      },
      paymentMethods: {
        maxInstallments: 1,
      },
    },
    callbacks: {
      onReady: () => {
        console.log("Brick is ready");
      },
      onSubmit: async (cardFormData: any) => {
        const tokenGenerado = cardFormData?.token;
        const monto = Number(cardFormData?.transaction_amount ?? Number(totalGuestPays.value)); // fallback
        const paymentMethodId = cardFormData?.payment_method_id;
        const paymentTypeId = cardFormData?.payment_type_id;
        await confirmarPagoTarjeta(tokenGenerado, monto, paymentMethodId, paymentTypeId);
      },
      onError: (error: any) => {
        console.error("Error en el Brick:", error);
      },
    },
  };

  if ((window as any).cardPaymentBrickController) {
    (window as any).cardPaymentBrickController.unmount();
  }

  await nextTick();
  const container = document.getElementById("cardPaymentBrick_container");
  if (container) {
    container.innerHTML = "";
    (window as any).cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
  } else {
    console.error("No se encontró el contenedor 'cardPaymentBrick_container'");
  }
};

const checkPaymentStatus = async (reservationId: number) => {
  const maxAttempts = 10;
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    const res = await api.get(`/payments/payment-status/${reservationId}`);
    const status = res.data.status;

    console.log("🔎 Estado de pago:", status);

    if (status === "approved") {
      clearInterval(interval);
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn("⏰ Tiempo de espera agotado. No se confirmó el pago.");
    }
  }, 5000); // cada 5 segundos
};

// Función para confirmar el pago con cuenta MP
const confirmarPagoConCuentaMP = async (preferenceId: string) => {
  // Persistir datos de facturación
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value
    }
  });

  // Crear reserva pendiente si no existe
  let reservationResponse: any;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch (err) {
    console.error("Error al crear la reserva:", err);
    alert("Ocurrió un error al crear la reserva. Intenta nuevamente.");
    return;
  }

  const reservationId =
    reservationResponse?.reservation?.id ||
    reservationResponse?.data?.reservation?.id;

  if (!reservationId) {
    console.error("reservationId no encontrado:", reservationResponse);
    alert("Error interno: no se pudo obtener el ID de la reserva.");
    return;
  }

  try {
    await api.post('/payments/confirm-wallet-payment', {
      reservation_id: reservationId,
      preference_id: preferenceId,
    });

    return await checkPaymentStatus(reservationId);
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    alert("Ocurrió un error al procesar el pago. Intenta nuevamente.");
  }
};

// Función para confirmar el pago utilizando el Checkout API
const confirmarPagoTarjeta = async (
  token: string,
  amount: number,
  paymentMethodId: string,
  paymentTypeId?: string,
) => {

  // Persistir datos de facturación
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value
    }
  });

  // Crear reserva pendiente si no existe
  let reservationResponse: any;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch (err) {
    console.error("Error al crear la reserva:", err);
    alert("Ocurrió un error al crear la reserva. Intenta nuevamente.");
    return;
  }

  const reservationId =
    reservationResponse?.reservation?.id ||
    reservationResponse?.data?.reservation?.id;

  if (!reservationId) {
    console.error("reservationId no encontrado:", reservationResponse);
    alert("Error interno: no se pudo obtener el ID de la reserva.");
    return;
  }

  const idemKey = `rsv-${reservationId}-${Date.now()}`;

  // 🔹 Payload base
  const payload: any = {
    reservation_id: reservationId,
    transaction_amount: Number(amount),
    description: `Pago para la reserva #${reservationId}`,
    email: email.value,
    payment_method_id: paymentMethodId,
    token,
    installments: 1,
    payer: {
      email: email.value,
      identification: { type: "DNI", number: dni.value.toString() }
    },
    breakdown: {
      base_amount: Number(baseAmount.value),
      service_fee_amount: Number(serviceFeeAmount.value),
      total: Number(totalGuestPays.value),
      service_fee_pct: SERVICE_FEE_PCT
    },
    idemKey,
    force_capture: paymentTypeId === "debit_card"
  };

  try {
    const response = await api.post('/payments/hold', payload);

    if (response.status === 201 || response.status === 200) {
      router.push({ path: '/confirmacion', query: { id: espacio.value.id } });
    }
    return response.data;

  } catch (error) {
    console.error("Error al procesar el pago:", error);
    alert("Ocurrió un error al procesar el pago. Intenta nuevamente.");
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
