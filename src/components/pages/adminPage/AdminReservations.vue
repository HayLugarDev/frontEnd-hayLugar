<template>
  <section>
    <div class="flex flex-col md:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold mb-4">Reservas</h2>
      <div class="flex gap-4">
        <span>Total: <strong class="text-primary">{{ reservations.length }}</strong></span>
        <span>Recientes: <strong class="text-primary">{{ recentReservations.length }}</strong></span>
      </div>
    </div>

    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="px-4 py-2 text-left">Usuario</th>
          <th class="px-4 py-2 text-left">Anfitrión</th>
          <th class="px-4 py-2 text-left">Espacio</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Inicio</th>
          <th class="px-4 py-2 text-left">Fin</th>
          <th class="px-4 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reservations" :key="r.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ r.user?.name || 'Desconocido' }}</td>
          <td class="px-4 py-2">{{ r.owner?.name || 'Desconocido' }}</td>
          <td class="px-4 py-2">{{ r.space?.name || 'Desconocido' }}</td>
          <td class="px-4 py-2 capitalize">{{ r.status }}</td>
          <td class="px-4 py-2">{{ formatDate(r.start_time) }}</td>
          <td class="px-4 py-2">{{ formatDate(r.end_time) }}</td>
          <td class="px-4 py-2 font-semibold">$ {{ r.total }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface User {
  id: number;
  name: string;
}

interface Space {
  id: number;
  name: string;
}

interface Reservation {
  id: number;
  user: User;
  owner: User;
  space: Space;
  start_time: string;
  end_time: string;
  total: number;
  status: string;
}

const props = defineProps<{ reservations: Reservation[] }>();

const recentReservations = computed(() =>
  props.reservations.filter((r) => {
    const diff = (Date.now() - new Date(r.start_time).getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  })
);

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
</script>
