<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-secondary p-6 text-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg">
      <h1 class="text-3xl font-bold text-primary">
        <font-awesome-icon icon="check-circle" class="mr-2" />
        ¡Reserva Confirmada!
      </h1>
      <p class="text-gray-600 mt-4">
        Tu reserva ha sido guardada y recibirás un correo con los detalles.
      </p>
      
      <!-- Detalles de la Reserva -->
      <div class="mt-6 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold mb-2">
          <font-awesome-icon icon="map-marker-alt" class="mr-1" />
          Detalles de la Reserva
        </h2>
        <p class="mt-2">
          <strong>Ubicación:</strong>
          {{ reserva.espacio.location }}
        </p>
        <p>
          <strong>Duración:</strong>
          {{ reserva.cantidad }} {{ reserva.rangoTiempo }}
        </p>
        <p>
          <strong>Total Pagado:</strong> ${{ reserva.total }}
        </p>
      </div>
      
      <!-- Datos del Pago -->
      <div class="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold mb-2">
          <font-awesome-icon icon="credit-card" class="mr-1" />
          Método de Pago
        </h2>
        <p v-if="reserva.metodoPago === 'tarjeta'">
          <font-awesome-icon icon="credit-card" class="mr-1" />
          Tarjeta de Crédito/Débito ({{ reserva.tipoTarjeta }})
        </p>
        <p v-else-if="reserva.metodoPago === 'mercadopago'">
          <font-awesome-icon icon="shopping-cart" class="mr-1" />
          Pago realizado con MercadoPago
        </p>
        <p v-else-if="reserva.metodoPago === 'transferencia'">
          <font-awesome-icon icon="university" class="mr-1" />
          Transferencia Bancaria a alias: HAYLUGAR.PAY
        </p>
      </div>
      
      <!-- Datos de Facturación -->
      <div class="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-left">
        <h2 class="text-lg font-semibold mb-2">
          <font-awesome-icon icon="user" class="mr-1" />
          Datos de Facturación
        </h2>
        <p><strong>Nombre:</strong> {{ reserva.datosFacturacion.nombre }}</p>
        <p><strong>DNI:</strong> {{ reserva.datosFacturacion.dni }}</p>
        <p><strong>Dirección:</strong> {{ reserva.datosFacturacion.direccion }}</p>
        <p><strong>Email:</strong> {{ reserva.datosFacturacion.email }}</p>
      </div>
      
      <!-- Botón para Volver al Dashboard -->
      <button 
        @click="irADashboard" 
        class="mt-6 w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all"
      >
        <font-awesome-icon icon="home" class="mr-1" />
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';

const router = useRouter();
const route = useRoute();
const reserva = ref(null);

const obtenerReserva = async () => {
  try {
    const id = route.query.id; 
    const response = await api.get(`/reservations/${id}`, { withCredentials : true });
    console.log(response.data);
    reserva.value = response.data;
    
    // Simulación (reemplaza esta parte con la llamada real)
    // reserva.value = {
    //   id,
    //   espacio: {
    //     location: "Calle 123, San Miguel de Tucumán",
    //     description: "Amplio estacionamiento con seguridad 24 horas.",
    //     image: "https://source.unsplash.com/400x300/?parking,garage"
    //   },
    //   cantidad: 2,
    //   rangoTiempo: "hora",
    //   total: 1000,
    //   metodoPago: "tarjeta", // "tarjeta", "mercadopago" o "transferencia"
    //   tipoTarjeta: "Visa",
    //   datosFacturacion: {
    //     nombre: "Juan Pérez",
    //     dni: "12345678",
    //     direccion: "Calle Falsa 123",
    //     email: "juan@example.com"
    //   }
    // };
  } catch (error) {
    console.error("Error al obtener la reserva:", error);
  }
};

onMounted(obtenerReserva);

const irADashboard = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
/* Agrega estilos adicionales si es necesario */
</style>
