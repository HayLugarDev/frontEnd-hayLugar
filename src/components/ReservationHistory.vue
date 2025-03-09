<template>
    <section class="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 class="text-2xl font-bold text-primary mb-4 flex items-center">
        <font-awesome-icon icon="history" class="mr-2" />
        Historial de Reservas
      </h2>
      <ul v-if="reservations.length" class="divide-y divide-gray-300">
        <li v-for="(reserva, index) in reservations" :key="index" class="py-4">
          <p class="flex items-center">
            <font-awesome-icon icon="map-marker-alt" class="mr-2 text-primary" />
            <strong>Ubicación:</strong> {{ reserva.location }}
          </p>
          <p class="flex items-center">
            <font-awesome-icon icon="calendar-alt" class="mr-2 text-primary" />
            <strong>Fecha:</strong> {{ formatDate(reserva.start_time) }}
          </p>
          <p class="flex items-center">
            <font-awesome-icon icon="money-bill-wave" class="mr-2 text-primary" />
            <strong>Total:</strong> ${{ reserva.total }}
          </p>
        </li>
      </ul>
      <p v-else class="text-gray-500">No tienes reservas anteriores.</p>
    </section>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  interface Reservation {
    location: string;
    start_time: string;
    total: number;
  }
  
  const props = defineProps<{ reservations: Reservation[] }>();
  
  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
  };
  </script>
  