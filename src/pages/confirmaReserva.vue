<template>
  <MainHeader />
  <div class="flex flex-col items-center justify-center min-h-screen bg-secondary p-6">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h1 class="text-3xl font-bold text-primary">
        <font-awesome-icon icon="check-circle" class="mr-2" />
        ¡Reserva Confirmada!
      </h1>
      <p class="text-gray-600 mt-4">
        Tu reserva ha sido guardada y recibirás un correo con los detalles.
      </p>
      <div v-if="reservation">
        <p class="mb-2"><strong>ID de Reserva:</strong> {{ reservation.id }}</p>
        <p class="mb-2"><strong>Fecha y Hora de Inicio:</strong> {{ reservation.start_time }}</p>
        <p class="mb-2"><strong>Fecha y Hora de Finalización:</strong> {{ reservation.end_time }}</p>
        <p class="mb-2"><strong>Total a Pagar:</strong> ${{ reservation.total }}</p>
        <p class="mb-2"><strong>Método de Pago:</strong> {{ reservation.payment_method }}</p>
        <div v-if="reservation.payment_data" class="mt-4">
          <h2 class="text-xl font-semibold">Datos de Facturación</h2>
          <p><strong>Nombre:</strong> {{ reservation.payment_data.invoice_name }}</p>
          <p><strong>DNI:</strong> {{ reservation.payment_data.invoice_dni }}</p>
          <p><strong>Dirección:</strong> {{ reservation.payment_data.invoice_address }}</p>
          <p><strong>Email:</strong> {{ reservation.payment_data.invoice_email }}</p>
        </div>
      </div>
      <div v-else>
        <p>No se encontró información de la reserva.</p>
      </div>
      <div class="flex justify-end mt-8">
        <button @click="router.push('/')"
          class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300 w-full md:w-auto">
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useReservationStore } from '../store/reservationStore';
import router from '../router';
import MainHeader from '../components/layout/header/MainHeader.vue';

const reservationStore = useReservationStore();
const reservation = computed(() => reservationStore.reservation);
</script>
