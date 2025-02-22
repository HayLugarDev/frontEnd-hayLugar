<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-secondary p-6 text-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg">
      <h1 class="text-3xl font-bold text-primary">¡Reserva Confirmada! 🎉</h1>
      <p class="text-gray-600 mt-4">Tu reserva ha sido confirmada y recibirás un correo con los detalles.</p>
      
      <div class="mt-6 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold">Detalles de la Reserva</h2>
        <p class="mt-2"><strong>Ubicación:</strong> {{ espacio.ubicacion }}</p>
        <p><strong>Duración:</strong> {{ cantidad }} {{ rangoTiempo }}</p>
        <p><strong>Total Pagado:</strong> ${{ total }}</p>
      </div>
      
      <!-- Datos del Pago -->
      <div class="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold">Método de Pago</h2>
        <p v-if="metodoPago === 'tarjeta'">
          💳 Tarjeta de Crédito/Débito ({{ tipoTarjeta }})
        </p>
        <p v-if="metodoPago === 'mercadopago'">🛒 Pago realizado con MercadoPago</p>
        <p v-if="metodoPago === 'transferencia'">💸 Transferencia Bancaria a alias: HAYLUGAR.PAY</p>
      </div>
      
      <!-- Datos de Facturación -->
      <div class="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold">Datos de Facturación</h2>
        <p><strong>Nombre:</strong> {{ nombre }}</p>
        <p><strong>DNI:</strong> {{ dni }}</p>
        <p><strong>Dirección:</strong> {{ direccion }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </div>
      
      <button @click="irADashboard" class="mt-6 w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const metodoPago = ref(route.query.metodoPago || "");
const tipoTarjeta = ref(route.query.tipoTarjeta || "");
const total = ref(parseFloat(route.query.total) || 500);
const nombre = ref(route.query.nombre || "");
const dni = ref(route.query.dni || "");
const direccion = ref(route.query.direccion || "");
const email = ref(route.query.email || "");
const cantidad = ref(route.query.cantidad || 1);
const rangoTiempo = ref(route.query.rangoTiempo || "hora");

const espacio = ref({
  ubicacion: route.query.ubicacion || "Calle desconocida",
});

const irADashboard = () => {
  router.push("/dashboard");
};
</script>
