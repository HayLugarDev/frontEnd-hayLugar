<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <section class="w-full md:w-2/3 space-y-6">
      <h1 class="text-3xl font-bold text-primary">Confirmar Pago</h1>
      <!-- Resumen del Espacio y Reserva -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img 
          :src="`http://localhost:3000${espacio?.images[0]}`" 
          alt="Imagen del espacio" 
          class="w-32 h-32 object-cover rounded-lg shadow-md mr-6" 
        />
        <div>
          <h2 class="text-xl font-bold">{{ espacio?.location }}</h2>
          <p class="text-gray-600">{{ espacio?.description }}</p>
          <p class="text-lg text-primary font-semibold mt-2">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" />
            Total: ${{ total }}
          </p>
          <p class="text-sm text-gray-500" v-if="startTime && endTime">
            Reserva desde: {{ startTime }} hasta: {{ endTime }}
          </p>
        </div>
      </div>

      <!-- Datos de Facturación -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Datos de Facturación</h2>
        <input v-model="nombre" type="text" placeholder="Nombre y Apellido" class="border p-2 rounded w-full mb-2" />
        <input v-model="dni" type="text" placeholder="DNI" class="border p-2 rounded w-full mb-2" />
        <input v-model="direccion" type="text" placeholder="Dirección" class="border p-2 rounded w-full mb-2" />
        <input v-model="email" type="email" placeholder="Correo Electrónico" class="border p-2 rounded w-full mb-2" />
      </div>

      <!-- Métodos de Pago -->
      <div class="bg-white p-6 rounded-lg shadow-md">
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
      <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
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
    <aside class="w-full md:w-1/3 flex justify-center items-center">
      <img 
        :src="`http://localhost:3000${espacio?.images[1]}` || 'https://source.unsplash.com/400x300/?parking,garage'" 
        alt="Imagen del espacio" 
        class="rounded-lg shadow-lg max-w-full" 
      />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { getSpaceById } from '../services/spaceService';

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Datos de facturación y reserva (inputs y query)
const metodoPago = ref("tarjeta");
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");
const totalQuery = Array.isArray(route.query.total) ? route.query.total[0] : route.query.total;
const total = ref(parseFloat(totalQuery || "0"));
const startTime = ref(route.query.start_time || "");
const endTime = ref(route.query.end_time || "");
const espacio = ref<any>(null);

// Función para obtener los datos del espacio
const obtenerEspacio = async () => {
  try {
    const id = route.query.id;
    const data = await getSpaceById(Number(id));
    console.log(data);
    espacio.value = data;
    return data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();
  if (metodoPago.value === 'tarjeta') {
    await nextTick();
    setTimeout(async () => {
      await initCardBrick();
    }, 300);
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

// Inicializa el Brick de MercadoPago
const initCardBrick = async () => {
  await loadMercadoPago();
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
  
  let reservationResponse;
  try {
    reservationResponse = await reservationStore.submitReservation();
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    alert("Ocurrió un error al crear la reserva. Intenta nuevamente.");
    return;
  }
  
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
