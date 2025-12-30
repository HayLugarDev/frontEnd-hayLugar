<template>
  <MainHeader />
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] p-6 pt-10 lg:pt-0">
    <div class="flex flex-col space-y-2 md:bg-white/10 md:border border-white/10 p-8 rounded-lg md:shadow-md w-full max-w-lg">
      <!-- Título principal -->
      <h1 class="text-3xl font-bold text-newgreen flex items-center">
        <font-awesome-icon icon="clock" class="mr-2" />
        ¡Solicitud de reserva confirmada!
      </h1>
      <p class="text-gray-200 mt-2">
        Tu solicitud de reserva ha sido enviada exitosamente y está pendiente de aprobación.
      </p>
      <p class="text-gray-400 text-sm">
        Una vez que el anfitrión apruebe la reserva, podrás abonarla a través de nuestros canales de pago
        para poder utilizar el espacio en la franja horaria seleccionada.
      </p>

      <p class="text-xs text-gray-500">Para más Información ingresá
        <span class="text-primary">
          <RouterLink to="/Help">acá</RouterLink>
        </span>
      </p>

      <!-- Resumen de la reserva -->
      <div v-if="reservation" class="mt-6 space-y-2 text-gray-200">
        <p><strong>Ingreso:</strong> {{ formatDate(reservation.start_time) }}</p>
        <p><strong>Salida:</strong> {{ formatDate(reservation.end_time) }}</p>
      </div>
      <div v-else class="mt-6 text-red-400">
        No se encontró información de la reserva.
      </div>

      <!-- Botón final -->
      <div class="flex justify-end mt-8">
        <button
          @click="router.push('/profile?section=reservas-anteriores')"
          class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          Mis reservas
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { useReservationStore } from '../store/reservationStore';
import router from '../router';
import MainHeader from '../components/layout/header/MainHeader.vue';

const reservationStore = useReservationStore();
const reservation = computed(() => reservationStore.reservation);

// Helpers
const formatARS = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));

const formatDate = (value: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
};

const formatMethod = (m: string) => {
  if (m === "tarjeta") return "Tarjeta de crédito/débito";
  if (m === "cuenta_mp") return "MercadoPago";
  return m || "-";
};
</script>
