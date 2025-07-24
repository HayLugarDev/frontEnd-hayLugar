<template>
  <section class="bg-white p-8 rounded-lg shadow-lg mb-8 md:w-2/3">
    <h2 class="text-2xl font-bold text-primary mb-4 flex items-center">
      <font-awesome-icon icon="history" class="mr-2" />
      Reservas
    </h2>
    <ul v-if="reservations.length" class="divide-y divide-gray-300">
      <li v-for="(reserva, index) in reservations" :key="index" class="py-4">
        <p class="flex items-center">
          <font-awesome-icon icon="map-marker-alt" class="mr-2 text-primary" />
          <strong>Ubicación:</strong> {{ reserva.space.location }}
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
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/userStore';
import api from '../../../services/apiService';

interface Space {
  location: string;
}

interface Reservation {
  Space: Space;
  start_time: string;
  total: number;
}

const reservations = ref([]);
const userStore = useUserStore();

const fetchReservations = async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    console.error("No se encontró el ID de usuario en userStore");
    return;
  }
  try {
    const response = await api.get(`reservations/history/${userId}`);
    console.log(response.data);
    reservations.value = response.data;
  } catch (error) {
    console.error("Error al obtener historial de reservas", error);
  }
};

onMounted(() => {
  fetchReservations();
});

const formatDate = (value: string): string => {
  const date = new Date(value);
  return date.toLocaleString();
};
</script>
