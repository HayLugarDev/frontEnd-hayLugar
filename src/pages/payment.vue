<template>
  <div class="flex flex-col min-h-screen bg-secondary lexend xl:w-11/12 mx-auto">
    <MainHeader />
    <main class="relative flex flex-col lg:rounded-lg overflow-hidden lg:px-10 w-full xl:w-11/12 mx-auto">
      <BackButton class="lg:hidden" />
      <section class="w-full md:grid md:grid-cols-9 flex flex-col p-4 gap-2">
        <h1 class="text-2xl text-center md:text-3xl py-6 col-span-5 row-span-1">Confirmá tu Pago</h1>

        <!-- Resumen del Espacio y Reserva -->
        <div class="md:col-span-4 md:row-start-2 md:col-start-6">
          <div class="bg-white p-8 rounded-lg shadow-md flex items-start">
            <img v-if="espacio && espacio.images && espacio.images[0]"
              :src="`http://localhost:3000${espacio.images[0]}`" alt="Imagen del espacio"
              class="w-28 h-28 object-cover rounded-lg shadow-md mr-6" />
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
          <div class="md:col-span-4 grid grid-cols-2 bg-white p-6 rounded-lg shadow-md items-start border-t-2">
            <p class="text-xl col-span-2 pb-2 border-b">CONCEPTOS FACTURADOS</p>
            <p class="text-lg col-span-1 row-start-2 text-gray-600 pt-4">Precio por {{ hours }} horas y {{
              minutes }} minutos</p>
            <p class="text-lg col-span-1 col-start-2 text-end text-gray-600 pt-4">$ {{ total }}</p>
          </div>
          <div class="col-span-4 grid grid-cols-2 bg-white p-6 rounded-lg shadow-md items-start border-t-2">
            <p class="text-lg col-span-1 row-start-4">Total a pagar</p>
            <p class="text-lg col-span-1 row-start-4 text-end">$ {{ total }}</p>
          </div>
        </div>

        <!-- Datos de Facturación -->
        <div class="bg-white p-6 rounded-lg shadow-md md:col-span-5 flex flex-col justify-around">
          <h2 class="text-lg font-semibold mb-4">Datos de Facturación</h2>
          <input v-model="nombre" type="text" placeholder="Nombre y Apellido" class="border p-2 rounded w-full mb-2" />
          <input v-model="dni" type="text" placeholder="DNI" class="border p-2 rounded w-full mb-2" />
          <input v-model="direccion" type="text" placeholder="Dirección" class="border p-2 rounded w-full mb-2" />
          <input v-model="email" type="email" placeholder="Correo Electrónico" class="border p-2 rounded w-full mb-2" />
        </div>

        <!-- Métodos de Pago -->
        <div class="bg-white p-6 rounded-lg shadow-md col-span-full">
          <h2 class="text-lg font-semibold mb-4">Método de Pago</h2>
          <div class="flex flex-col space-y-4">
            <label class="flex items-center gap-3">
              <input type="radio" v-model="metodoPago" value="tarjeta" class="form-radio" />
              <font-awesome-icon icon="credit-card" class="text-xl" />
              <span>Tarjeta de Crédito/Débito</span>
            </label>
          </div>
        </div>

        <!-- Sección de Pago con Tarjeta usando MercadoPago Card Payment Brick -->
        <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md md:col-span-full">
          <div id="cardPaymentBrick_container"></div>
        </div>

        <!-- Botón de Confirmación para otros métodos (simulado) -->
        <div v-if="metodoPago !== 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
          <button @click="confirmarPagoSimulado"
            class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
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
import { useRouter, useRoute, routeLocationKey } from 'vue-router';
import api from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { getSpaceById } from '../services/spaceService';
import BackButton from '../components/BackButton.vue';
import MainHeader from "../components/MainHeader.vue";

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Datos de facturación y reserva (inputs y query)
const metodoPago = ref("tarjeta");
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");
const total = computed(() => reserva.value.total || 0);
const totalDuration = computed(() => reserva.value?.dead_line ?? 0);
const hours = computed(() => { return totalDuration.value ? Math.floor(totalDuration.value) : 0; });
const minutes = computed(() => { return totalDuration.value ? Math.round((totalDuration.value - hours.value) * 60) : 0; });
const startTime = computed(() => reserva.value.start_time);
const endTime = computed(() => reserva.value.end_time);
const espacio = ref<any>(null);

// Función para obtener los datos del espacio
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
  }
  if (metodoPago.value === 'tarjeta') {
    await nextTick();
    setTimeout(async () => {
      await initCardBrick();
    }, 300);
  }
});

const reserva = computed(() => reservationStore.reservation);

watch(metodoPago, async (newVal) => {
  if (newVal === 'tarjeta') {
    await nextTick();
    setTimeout(async () => {
      await initCardBrick();
    }, 300);
  }
});

// watch(email, async (newEmail) => {
//   if (metodoPago.value === 'tarjeta' && newEmail) {
//     await nextTick();
//     await initCardBrick();
//   }
// });

let cardForm: any = null;

// Inicializa el Brick de MercadoPago
const initCardBrick = async () => {
  await loadMercadoPago();

  if (total.value <= 0) {
    alert("El monto a pagar no es válido.");
    return;
  }
  const mp = new window.MercadoPago('TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74', { locale: 'es-AR' });
  const bricksBuilder = mp.bricks();
  const settings = {
    initialization: {
      amount: total.value.toString(),
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
        console.log("Datos del Brick:", cardFormData);
        // Extraer el token, el monto y el payment_method_id real del objeto del Brick
        const tokenGenerado = cardFormData.token;
        const monto = cardFormData.transaction_amount;
        const paymentMethodId = cardFormData.payment_method_id;
        await confirmarPagoMercadoPago(tokenGenerado, monto, paymentMethodId);
      },
      onError: (error: any) => {
        console.error("Error en el Brick:", error);
      },
    },
  };

  if (window.cardPaymentBrickController) {
    window.cardPaymentBrickController.unmount();
  }

  const container = document.getElementById("cardPaymentBrick_container");
  if (container) {
    container.innerHTML = "";
    window.cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
  } else {
    console.error("No se encontró el contenedor 'cardPaymentBrick_container'");
  }
};

// Función para confirmar el pago utilizando el Checkout API
// Ahora se recibe paymentMethodReal
const confirmarPagoMercadoPago = async (token: string, amount: number, paymentMethodReal: string) => {

  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    alert("Por favor, completa todos los datos de facturación antes de pagar.");
    return;
  }

  // Guardamos el token recibido en una variable local
  const tokenValue = token;

  // Actualizamos el store con los datos de facturación
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: {
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value
    }
  });

  // Creamos la reserva en estado "pending" y capturamos el resultado
  let reservationResponse;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    alert("Ocurrió un error al crear la reserva. Intenta nuevamente.");
    return;
  }
  // Extraemos el id desde axiosResponse.data
  const reservationId = reservationResponse.reservation.id;
  if (!reservationId) {
    console.error("reservationId no encontrado en la respuesta:", reservationResponse);
    alert("Error interno: no se pudo obtener el ID de la reserva.");
    return;
  }

  // Construir el payload para enviar a nuestro endpoint que procesa el pago,
  // asegurándonos de incluir el payment_method_id real y otros campos requeridos.
  const payload = {
    reservation_id: reservationId,
    transaction_amount: Number(amount),
    description: `Pago para la reserva #${reservationId}`,
    email: email.value,  // Debe venir de req.user.email en el backend
    payment_method_id: paymentMethodReal,  // Ahora se usa el valor real (ej.: "visa")
    token: tokenValue,
    issuer_id: 310, // Valor fijo o dinámico según corresponda
    payer: {
      email: email.value,
      identification: {
        type: "DNI",
        number: dni.value.toString(),
      },
    },
    installments: 1
  };
  console.log("Payload a enviar:", payload);

  // Procesamos el pago mediante nuestro endpoint (ejemplo: /payments/create)
  try {
    const response = await api.post('/payments/process_payment', payload);
    if (response.status === 201) {
      console.log("Pago procesado exitosamente");
      router.push({
        path: '/confirmacion',
        query: { id: espacio.value.id }
      });
    }
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    alert("Ocurrió un error al procesar el pago. Intenta nuevamente.");
  }
};

// Función para el caso simulado (otros métodos de pago)
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

  console.log("Enviando reserva:", reservationStore.reservation);
  try {
    const response = await reservationStore.submitReservation();
    if (response) {
      alert("Pago confirmado mediante " + metodoPago.value);
      router.push({
        path: '/confirmacion',
        query: { id: espacio.value.id }
      });
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
