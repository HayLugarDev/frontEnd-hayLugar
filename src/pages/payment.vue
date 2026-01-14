<template>

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
    <BackButton />
  </div>

  <div
    class="flex flex-col font-normal min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white font-lexend w-full max-w-7xl mx-auto px-4">
    <MainHeader />

    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full py-10">

      <!-- Usamos grid-cols-1 por defecto y md:grid-cols-9 en desktop -->
      <section class="grid grid-cols-1 md:grid-cols-9 gap-6">
        <!-- 🧾 Título -->
        <h1 class="text-primary text-3xl col-span-full font-bold mb-2">
          Confirmá tu Pago
        </h1>

        <!-- 📋 Resumen -->
        <div class="md:col-span-4 flex flex-col gap-5">
          <!-- Espacio -->
          <div
            class="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md flex items-start gap-5 hover:shadow-lg transition">
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
              <p class="text-gray-400">
                Precio por {{ formattedDuration }}
              </p>
              <p class="text-end font-medium">{{ formatARS(baseAmount) }}</p>

              <p class="text-gray-400">Cargo por servicio</p>
              <p class="text-end font-medium">{{ formatARS(serviceFeeAmount) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div
            class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md border-t-2 grid grid-cols-2 items-center">
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
              <a href="/termsConditions" target="_blank" class="text-primary underline">Términos y
                Condiciones</a>
              y
              <a href="/politica-de-privacidad" target="_blank" class="text-primary underline">Política de
                Privacidad</a>.
            </p>
          </div>
        </div>

        <!-- 🧾 FACTURACIÓN + PAGO (SLIDE HORIZONTAL) -->
        <div class="md:col-span-5 overflow-hidden relative">
          <div class="flex w-[200%] transition-transform duration-500 ease-in-out"
            :class="selectedMethod ? '-translate-x-1/2' : 'translate-x-0'">

            <!-- 🧍 FACTURACIÓN -->
            <div class="w-1/2 pr-4">
              <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md flex flex-col gap-4">

                <!-- Vehículo -->
                <div v-if="reserva.vehicle_type" class="bg-white/10 border-white/10 p-4 rounded-lg border shadow-sm">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="text-md font-semibold text-white">Vehículo Seleccionado</h3>
                    <font-awesome-icon
                      :icon="reserva.vehicle_type === 'car' ? 'car' : reserva.vehicle_type === 'motorcycle' ? 'motorcycle' : 'bicycle'" />
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
                <button :disabled="!datosCompletos" @click="selectedMethod = true"
                  class="mt-4 w-full bg-primary disabled:opacity-40 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-md hover:shadow-xl transition-all">
                  Continuar al pago →
                </button>
              </div>
            </div>

            <!-- 💳 PAGO -->
            <div class="w-1/2 pl-4">
              <div class="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-6">

                <button @click="selectedMethod = false" class="text-sm text-gray-300 hover:text-white w-fit">
                  ← Volver a facturación
                </button>

                <h2 class="flex justify-center">Seleccioná el método de pago</h2>

                <!-- Métodos -->
                <div class="flex justify-center gap-4">
                  <button @click="verifyPaymentMethod('tarjeta')" class="payment-btn">
                    💳 Tarjeta
                  </button>

                  <button @click="verifyPaymentMethod('cuenta_mp')" class="payment-btn mp">
                    <img src="../assets/logo-mercadopago.png" class="h-6" />
                    Mercado Pago
                  </button>
                </div>

                <!-- Bricks -->
                <div>
                  <div v-show="metodoPago === 'cuenta_mp'" id="walletBrick_container" />
                  <div v-show="metodoPago === 'tarjeta'" id="cardPaymentBrick_container" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </main>

    <StatusModal :visible="showErrorModal" type="error" title="Error" :message="errorMessage" :icon="Logo"
      @confirm="showErrorModal = false" />
  </div>

  <!-- ===== FOOTER ===== -->
  <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm">

      <!-- Branding -->
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold tracking-wide">HayLugar</span>
        <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
      </div>

      <!-- Links -->
      <div class="flex gap-6">
        <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
          Política de Privacidad
        </router-link>

        <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
          Términos y Condiciones
        </router-link>
      </div>

      <!-- Extra -->
      <div class="text-xs text-[#78909C]">
        Logística inteligente
      </div>
    </div>
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
import Logo from '../assets/logo.png'
import { getReservationForPayment } from '../services/reservationService';
import { formatDurationFromHours } from '../utils/formatDurationFromHopurs';

const router = useRouter();
const reservationStore = useReservationStore();
const reserva = computed(() => reservationStore.reservation);

type PaymentMethod = 'tarjeta' | 'cuenta_mp';

// Datos de facturación y reserva (inputs y query)
const metodoPago = ref<PaymentMethod>();
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");
const total = computed(() => reserva.value.total || 0);
const totalDuration = computed(() => reserva.value?.deadLine ?? 0);
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
    const id = reserva.value.id;
    if (!id) throw new Error("No se encontró el espacio");
    const data = await getReservationForPayment(id);
    espacio.value = data;
    return data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();

  if (!reserva.value) {
    console.warn('Intento de acceso inválido a pago');
    router.push('/dashboard');
    return;
  }

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

const formattedDuration = computed(() =>
  formatDurationFromHours(reserva.value?.deadLine ?? 0)
)

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
    initWalletBrick();
  }
};

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
const initWalletBrick = async () => {
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

  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value,
    },
  });

  // Sincroniza datos de facturación antes de procesar el pago
  await reservationStore.syncReservation();

  const reservationId = reserva.value.id;

  if (!reservationId) {
    throw new Error("Reserva inválida");
  }

  // 2️⃣ crear preference ya con ID real
  try {
    const res = await api.post("/payments/create-preference", {
      reservation_id: reservationId,
      amount: totalGuestPays.value,
      description: "Reserva de espacio",
      email: email.value,
      userId: reserva.value.user_id,
      metadata: {
        reservationId,
        userId: reserva.value.user_id
      },
    }, { withCredentials: true });

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
        onSubmit: async () => {
          console.log("🕒 Pago enviado a Mercado Pago, esperando webhook...");
          await checkPaymentStatus(reservationId);
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
      router.push({ path: '/confirmacion', query: { id: reserva.value.id } });
    }


    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn("⏰ Tiempo de espera agotado. No se confirmó el pago.");
    }
  }, 5000); // cada 5 segundos
};

// Función para confirmar el pago utilizando el Checkout API
const confirmarPagoTarjeta = async (
  token: string,
  amount: number,
  paymentMethodId: string,
  paymentTypeId?: string,
) => {

  const reservationId = reserva.value.id;
  if (!reservationId) {
    alert("Reserva inválida");
    return;
  }

  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value,
    },
  });

  // Sincroniza datos de facturación antes de procesar el pago
  await reservationStore.syncReservation();

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

.payment-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition text-white font-medium;
}

.payment-btn.mp {
  background-color: #009ee3;
  border-color: #009ee3;
}
</style>
