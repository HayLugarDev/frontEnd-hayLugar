<template>
  <section class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
      <h2 class="text-2xl font-semibold text-white tracking-tight">Reservas</h2>

      <div class="flex gap-6 text-sm">
        <span class="text-gray-300">
          Total:
          <strong class="text-primary">{{ reservations.length }}</strong>
        </span>

        <span class="text-gray-300">
          Recientes:
          <strong class="text-primary">{{ recentReservations.length }}</strong>
        </span>
      </div>
    </div>

    <!-- Contenedor con scroll -->
    <div class="overflow-x-auto rounded-xl max-h-[55vh] custom-scroll">
      <table class="min-w-full border-separate border-spacing-0">
        <thead>
          <tr class="bg-white/10 backdrop-blur text-gray-200">
            <th class="th">Usuario</th>
            <th class="th">Anfitrión</th>
            <th class="th">Espacio</th>
            <th class="th">Estado</th>
            <th class="th">Inicio</th>
            <th class="th">Fin</th>
            <th class="th text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="r in reservations"
            :key="r.id"
            class="tr"
          >
            <td class="td">{{ r.user?.name || 'Desconocido' }}</td>
            <td class="td">{{ r.owner?.name || 'Desconocido' }}</td>
            <td class="td">{{ r.space?.name || 'Desconocido' }}</td>

            <!-- Chip de estado -->
            <td class="td">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="statusClass(r.status)"
              >
                {{ r.status }}
              </span>
            </td>

            <td class="td">{{ formatDate(r.start_time) }}</td>
            <td class="td">{{ formatDate(r.end_time) }}</td>

            <td class="td text-right font-semibold text-primary">$ {{ r.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
    const diff =
      (Date.now() - new Date(r.start_time).getTime()) /
      (1000 * 3600 * 24);
    return diff <= 7;
  })
);

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const statusClass = (status: string) => {
  switch (status) {
    case "pendiente":
      return "bg-yellow-500/20 text-yellow-400";
    case "confirmada":
      return "bg-green-500/20 text-green-400";
    case "cancelada":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};
</script>

<style scoped>
/* Columnas */
.th {
  @apply px-4 py-3 text-left text-sm font-semibold border-b border-white/10;
}

/* Filas */
.tr {
  @apply bg-white/5 border-b border-white/5 hover:bg-white/10 transition-colors;
}

/* Celdas */
.td {
  @apply px-4 py-3 text-sm text-gray-200;
}

/* Scroll elegante */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
