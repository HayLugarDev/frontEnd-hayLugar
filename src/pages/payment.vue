<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Resumen del Pago y Formulario de Facturación -->
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
      
      <!-- Formulario de Tarjeta (si se selecciona 'tarjeta') -->
      <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Detalles de la Tarjeta</h2>
        <input 
          v-model="numeroTarjeta" 
          @input="detectarTipoTarjeta" 
          type="text" 
          placeholder="Número de Tarjeta" 
          class="border p-2 rounded w-full mb-2" 
        />
        <div v-if="tipoTarjeta" class="flex items-center gap-2 mb-2">
          <img :src="obtenerIconoTarjeta()" alt="Icono de Tarjeta" class="w-12 h-auto" v-if="obtenerIconoTarjeta()" />
          <span class="font-semibold">{{ tipoTarjeta }}</span>
        </div>
        <div class="flex gap-4 mt-2">
          <input 
            v-model="expiracion" 
            type="text" 
            placeholder="MM/YY" 
            class="border p-2 rounded w-1/2" 
          />
          <input 
            v-model="cvv" 
            type="text" 
            placeholder="CVV" 
            class="border p-2 rounded w-1/2" 
          />
        </div>
      </div>
      
      <!-- Simulación de Integración con MercadoPago -->
      <div v-if="metodoPago === 'mercadopago'" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">MercadoPago</h2>
        <p class="text-gray-600 mb-2">
          La integración con MercadoPago no está implementada aún. Se simulará el pago.
        </p>
      </div>
      
      <!-- Datos para Transferencia Bancaria -->
      <div v-if="metodoPago === 'transferencia'" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Datos para Transferencia Bancaria</h2>
        <p class="text-gray-600">Banco: Banco Nación</p>
        <p class="text-gray-600">CBU: 2850590940090418135200</p>
        <p class="text-gray-600">Alias: HAYLUGAR.PAY</p>
      </div>
      
      <!-- Botón de Confirmación -->
      <button 
        @click="confirmarPago" 
        class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
      >
        <font-awesome-icon icon="check-circle" class="mr-2" />
        Confirmar y Pagar
      </button>
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

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';
import { useReservationStore } from '../store/reservationStore';

const router = useRouter();
const route = useRoute();
const reservationStore = useReservationStore();

// Variables para método de pago y datos de facturación
const metodoPago = ref("tarjeta");
const nombre = ref("");
const dni = ref("");
const direccion = ref("");
const email = ref("");
const total = ref(parseFloat(route.query.total) || 0);

// Variables para pago con tarjeta
const numeroTarjeta = ref("");
const expiracion = ref("");
const cvv = ref("");
const tipoTarjeta = ref("");

// Variables para reserva (recibidas desde checkout)
const startTime = ref(route.query.start_time || "");
const endTime = ref(route.query.end_time || "");

// Objeto de espacio (se obtiene desde el detalle de reserva)
const espacio = ref(null);

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

onMounted(obtenerEspacio);
console.log("montado");

// Función para detectar el tipo de tarjeta (simulación básica)
const detectarTipoTarjeta = () => {
  const num = numeroTarjeta.value;
  if (/^4/.test(num)) {
    tipoTarjeta.value = "Visa";
  } else if (/^5[1-5]/.test(num)) {
    tipoTarjeta.value = "MasterCard";
  } else if (/^3[47]/.test(num)) {
    tipoTarjeta.value = "American Express";
  } else if (/^6/.test(num)) {
    tipoTarjeta.value = "Discover";
  } else {
    tipoTarjeta.value = "";
  }
};

const obtenerIconoTarjeta = () => {
  if (tipoTarjeta.value) {
    return `/src/assets/${tipoTarjeta.value.toLowerCase()}.png`;
  }
  return "";
};

const confirmarPago = async () => {
  // Validar datos de facturación
  if (!nombre.value || !dni.value || !direccion.value || !email.value) {
    alert("Por favor, completa todos los datos de facturación.");
    return;
  }
  // Validar datos de tarjeta si se selecciona 'tarjeta'
  if (metodoPago.value === "tarjeta") {
    if (!numeroTarjeta.value || !expiracion.value || !cvv.value) {
      alert("Por favor, completa todos los datos de la tarjeta.");
      return;
    }
  }
  
  // Aquí se actualizaba el reservationStore con los datos de pago, 
  // pero por el momento no queremos incluir esos campos. Se deja comentado:
  
  reservationStore.setReservationData({
    payment_method: metodoPago.value,
    payment_data: { 
      invoice_name: nombre.value,
      invoice_dni: dni.value,
      invoice_address: direccion.value,
      invoice_email: email.value 
    }
  });
 
  
  // Si deseas enviar la reserva sin datos de pago, omite esos campos:
  console.log("Enviando reserva sin datos de pago:", reservationStore.reservation);
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
/* Agrega estilos adicionales si lo requieres */
</style>
