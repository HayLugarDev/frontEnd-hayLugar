<template>
  <MainHeader />
  <div class="flex flex-col items-center justify-center min-h-screen bg-secondary p-6 pt-10 lg:pt-0">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <!-- Título principal -->
      <h1 class="text-3xl font-bold text-amber-600 flex items-center">
        <font-awesome-icon icon="clock" class="mr-2" />
        ¡Reserva Confirmada!
      </h1>
      <p class="text-gray-600 mt-2">
        Tu reserva quedó guardada y el pago fue retenido en Mercado Pago.
      </p>
      <p class="text-gray-500 text-sm">
        El monto se acreditará al anfitrión una vez finalizada la estadía.
      </p>

      <!-- Resumen de la reserva -->
      <div v-if="reservation" class="mt-6 space-y-2 text-gray-700">
        <p><strong>ID de Reserva:</strong> #{{ reservation.id }}</p>
        <p><strong>CheckIn:</strong> {{ formatDate(reservation.start_time) }}</p>
        <p><strong>CheckOut:</strong> {{ formatDate(reservation.end_time) }}</p>
        <p><strong>Método de Pago:</strong> {{ formatMethod(reservation.payment_method) }}</p>
      </div>
      <div v-else class="mt-6 text-red-600">
        No se encontró información de la reserva.
      </div>

      <!-- Desglose de costos -->
      <div v-if="reservation" class="mt-6 bg-gray-50 p-4 rounded-lg border">
        <h2 class="text-lg font-semibold mb-3">Detalle del Pago Retenido</h2>
        <div class="flex justify-between mb-1">
          <span>Precio Base</span>
          <span>{{ formatARS(reservation.total) }}</span>
        </div>
        <div class="flex justify-between mb-1" v-if="reservation.service_fee_cents">
          <span>Cargo por servicio</span>
          <span>{{ formatARS(reservation.guest_total_cents / 100) }}</span>
        </div>
        <div class="flex justify-between font-bold text-amber-600 border-t pt-2 mt-2">
          <span>Total retenido</span>
          <span>
            {{ formatARS(
              reservation.guest_total_cents
                ? reservation.guest_total_cents / 100
                : reservation.total
            ) }}
          </span>
        </div>
      </div>

      <!-- Datos de facturación -->
      <div v-if="reservation?.payment_data" class="mt-6">
        <h2 class="text-lg font-semibold mb-2">Datos de Facturación</h2>
        <p><strong>Nombre:</strong> {{ reservation.payment_data.invoice_name }}</p>
        <p><strong>DNI:</strong> {{ reservation.payment_data.invoice_dni }}</p>
        <p><strong>Dirección:</strong> {{ reservation.payment_data.invoice_address }}</p>
        <p><strong>Email:</strong> {{ reservation.payment_data.invoice_email }}</p>
      </div>

      <!-- Botón final -->
      <div class="flex justify-end mt-8">
        <button
          @click="router.push('/profile?section=reservas')"
          class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          Ver mis reservas
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
  if (m === "mercadopago") return "Mercado Pago";
  if (m === "transferencia") return "Transferencia Bancaria";
  return m || "-";
};
</script>
