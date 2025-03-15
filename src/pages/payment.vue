<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Resumen del Pago y Formulario de Pago -->
    <section class="w-full md:w-2/3 space-y-6">
      <h1 class="text-3xl font-bold text-primary">Confirmar Pago</h1>
      
      <!-- Resumen del Espacio y Reserva -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img 
          :src="espacio?.image || 'https://source.unsplash.com/400x300/?parking,garage'" 
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
          <label class="flex items-center gap-3">
            <input type="radio" v-model="metodoPago" value="mercadopago" class="form-radio" />
            <font-awesome-icon icon="shopping-cart" class="text-xl" />
            <span>MercadoPago</span>
          </label>
          <label class="flex items-center gap-3">
            <input type="radio" v-model="metodoPago" value="transferencia" class="form-radio" />
            <font-awesome-icon icon="university" class="text-xl" />
            <span>Transferencia Bancaria</span>
          </label>
        </div>
      </div>
      
      <!-- Sección de Pago con Tarjeta usando MercadoPago Card Payment Brick -->
      <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Pago con Tarjeta</h2>
        <!-- Contenedor donde se montará el Brick -->
        <form id="form-checkout" class="flex flex-col max-w-lg">
          <div id="form-checkout__cardNumber" class="container"></div>
          <div id="form-checkout__expirationDate" class="container"></div>
          <div id="form-checkout__securityCode" class="container"></div>
          <input type="text" id="form-checkout__cardholderName" placeholder="Titular de la tarjeta" class="border p-2 rounded my-2"/>
          <select id="form-checkout__issuer" class="border p-2 rounded my-2"></select>
          <select id="form-checkout__installments" class="border p-2 rounded my-2"></select>
          <select id="form-checkout__identificationType" class="border p-2 rounded my-2"></select>
          <input type="text" id="form-checkout__identificationNumber" placeholder="Número del documento" class="border p-2 rounded my-2"/>
          <input type="email" id="form-checkout__cardholderEmail" placeholder="E-mail" class="border p-2 rounded my-2"/>
          <button type="submit" id="form-checkout__submit" class="bg-accent text-white p-2 rounded mt-4">Pagar</button>
          <progress value="0" class="progress-bar mt-2">Cargando...</progress>
        </form>
      </div>
      
      <!-- Botón de Confirmación para métodos distintos a tarjeta -->
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
    
    <!-- Sección Derecha: Imagen Resumen (Opcional) -->
    <aside class="w-full md:w-1/3 flex justify-center items-center">
      <img 
        :src="espacio?.image || 'https://source.unsplash.com/400x300/?parking,garage'" 
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

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Datos de facturación y reserva
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

const obtenerEspacio = async () => {
  try {
    const id = route.query.id || null;
    if (id) {
      const response = await api.get(`/spaces/getbyid/${id}`);
      espacio.value = response.data;
    } else {
      espacio.value = {
        ubicacion: "Calle 123, San Miguel de Tucumán",
        description: "Amplio estacionamiento con seguridad 24 horas.",
        image: "https://source.unsplash.com/400x300/?parking,garage"
      };
    }
  } catch (error) {
    console.error("Error al obtener datos del espacio:", error);
  }
};

onMounted(async () => {
  await obtenerEspacio();
  if (metodoPago.value === 'tarjeta') {
    await nextTick();
    await initCardBrick();
  }
});

watch(metodoPago, async (newVal) => {
  if (newVal === 'tarjeta') {
    await nextTick();
    await initCardBrick();
  }
});

let cardForm: any = null;

const initCardBrick = async () => {
  await loadMercadoPago();
  const mp = new window.MercadoPago('TEST-f39e0ddb-bc5b-491c-9245-0461fdeccb74', { locale: 'es-AR' });
  const brickConfig = {
    amount: total.value.toString(),
    autoMount: true,
    iframe: true,
    form: {
      id: "form-checkout",
      cardNumber: {
        id: "form-checkout__cardNumber",
        placeholder: "Número de tarjeta",
      },
      expirationDate: {
        id: "form-checkout__expirationDate",
        placeholder: "MM/YY",
      },
      securityCode: {
        id: "form-checkout__securityCode",
        placeholder: "Código de seguridad",
      },
      cardholderName: {
        id: "form-checkout__cardholderName",
        placeholder: "Titular de la tarjeta",
      },
      issuer: {
        id: "form-checkout__issuer",
        placeholder: "Banco emisor",
      },
      installments: {
        id: "form-checkout__installments",
        placeholder: "Cuotas",
      },
      identificationType: {
        id: "form-checkout__identificationType",
        placeholder: "Tipo de documento",
      },
      identificationNumber: {
        id: "form-checkout__identificationNumber",
        placeholder: "Número del documento",
      },
      cardholderEmail: {
        id: "form-checkout__cardholderEmail",
        placeholder: "E-mail",
      },
    },
    callbacks: {
      onFormMounted: (error: any) => {
        if (error) {
          console.warn("Error al montar el brick:", error);
          return;
        }
        console.log("Brick montado exitosamente.");
      },
      onSubmit: async (event: Event) => {
        event.preventDefault();
        const cardFormData = cardForm?.getCardFormData();
        if (!cardFormData) return;
        const {
          paymentMethodId: payment_method_id,
          issuerId: issuer_id,
          cardholderEmail: cardholderEmail,
          amount,
          token,
          installments,
          identificationNumber,
          identificationType,
        } = cardFormData;
        
        console.log("Datos del Brick:", {
          payment_method_id,
          issuer_id,
          cardholderEmail,
          amount,
          token,
          installments,
          identificationNumber,
          identificationType,
        });
        
        await confirmarPagoMercadoPago(token, amount);
      },
      onError: (error: any) => {
        console.error("Error en el Brick:", error);
      },
      onFetching: (resource: any) => {
        console.log("Fetching resource:", resource);
        const progressBar = document.querySelector(".progress-bar");
        progressBar?.removeAttribute("value");
        return () => {
          progressBar?.setAttribute("value", "0");
        };
      }
    },
  };

  const container = document.getElementById("form-checkout");
  if (container) {
    container.innerHTML = "";
    cardForm = mp.cardForm(brickConfig);
  } else {
    console.error("No se encontró el contenedor 'form-checkout'");
  }
};

const confirmarPagoMercadoPago = async (token: string, amount: string) => {
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    pay_data: { 
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value 
    }
  });
  
  try {
    const response = await api.post('/payments/process', {
      token,
      amount: Number(amount),
      reservationId: reservationStore.reservation.id,
    });
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

const confirmarPagoSimulado = async () => {
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    alert("Por favor, completa todos los datos de facturación.");
    return;
  }
  
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    pay_data: { 
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
/* Estilos para el formulario del brick */
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

/* Transición para el brick */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
