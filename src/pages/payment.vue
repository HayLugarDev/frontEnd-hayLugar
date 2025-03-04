<template>
    <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
      <!-- Sección Izquierda: Resumen del Pago -->
      <div class="w-full md:w-2/3 space-y-6">
        <h1 class="text-3xl font-bold text-primary">Confirmar Pago</h1>
        
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
          <img :src="espacio.image" alt="Espacio" class="w-32 h-32 object-cover rounded-lg shadow-md mr-6" />
          <div>
            <h2 class="text-xl font-bold">{{ espacio.ubicacion }}</h2>
            <p class="text-gray-600">{{ espacio.descripcion }}</p>
            <p class="text-lg text-primary font-semibold mt-2">💰 Total: ${{ total }}</p>
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
              💳 Tarjeta de Crédito/Débito
            </label>
            <label class="flex items-center gap-3">
              <input type="radio" v-model="metodoPago" value="mercadopago" class="form-radio" />
              🛒 MercadoPago
            </label>
            <label class="flex items-center gap-3">
              <input type="radio" v-model="metodoPago" value="transferencia" class="form-radio" />
              💸 Transferencia Bancaria
            </label>
          </div>
        </div>
        
        <!-- Formulario de Tarjeta (si se selecciona tarjeta) -->
        <div v-if="metodoPago === 'tarjeta'" class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold mb-4">Detalles de la Tarjeta</h2>
          <input v-model="numeroTarjeta" @input="detectarTipoTarjeta" type="text" placeholder="Número de Tarjeta" class="border p-2 rounded w-full mb-2" />
          <div v-if="tipoTarjeta" class="flex items-center gap-2">
            <img :src="obtenerIconoTarjeta()" alt="Tarjeta" class="w-15 h-10" v-if="obtenerIconoTarjeta()" />
          </div>
          <div class="flex gap-4 mt-2">
            <input v-model="expiracion" type="text" placeholder="MM/YY" class="border p-2 rounded w-1/2" />
            <input v-model="cvv" type="text" placeholder="CVV" class="border p-2 rounded w-1/2" />
          </div>
        </div>
        
        <!-- Datos para Transferencia -->
        <div v-if="metodoPago === 'transferencia'" class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold mb-4">Datos de Transferencia</h2>
          <p class="text-gray-600">Banco: Banco Nación</p>
          <p class="text-gray-600">CBU: 2850590940090418135200</p>
          <p class="text-gray-600">Alias: HAYLUGAR.PAY</p>
        </div>
        
        <!-- Botón de Confirmación -->
        <button @click="confirmarPago" class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
          Confirmar y Pagar
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const metodoPago = ref("tarjeta");
  const total = ref(parseFloat(route.query.total) || 500);
  const numeroTarjeta = ref("");
  const expiracion = ref("");
  const cvv = ref("");
  const tipoTarjeta = ref("");
  
  const nombre = ref("");
  const dni = ref("");
  const direccion = ref("");
  const email = ref("");
  
  const espacio = ref({
  ubicacion: route.query.location,
  descripcion: route.query.description,
  precio: route.query.price_per_hour,
  image: route.query.image
});
  
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
  
  const confirmarPago = () => {
    if (metodoPago.value === 'tarjeta' && (!numeroTarjeta.value || !expiracion.value || !cvv.value)) {
      alert("Por favor completa todos los datos de la tarjeta.");
      return;
    }
    alert("Pago confirmado con " + metodoPago.value);
    router.push("/confirmacion");
  };
  </script>