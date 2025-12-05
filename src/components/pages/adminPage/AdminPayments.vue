<template>
  <section class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
      <h2 class="text-2xl font-semibold text-white tracking-tight">
        Transacciones
      </h2>

      <div class="text-gray-300 text-sm">
        Total:
        <strong class="text-primary">{{ payments.length }}</strong>
      </div>
    </div>

    <!-- Tabla con scroll -->
    <div class="overflow-x-auto rounded-xl max-h-[55vh] custom-scroll">
      <table class="min-w-full border-separate border-spacing-0">
        <thead>
          <tr class="bg-white/10 backdrop-blur text-gray-200">
            <th class="th">ID</th>
            <th class="th">Usuario</th>
            <th class="th">Monto</th>
            <th class="th">Estado</th>
            <th class="th">Fecha</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="t in payments" :key="t.id" class="tr">
            <td class="td font-medium text-primary">#{{ t.id }}</td>
            <td class="td">{{ t.user?.name || 'Desconocido' }}</td>

            <td class="td font-semibold text-primary">
              $ {{ t.amount }}
            </td>

            <!-- Chip de estado -->
            <td class="td">
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(t.payment_status)">
                {{ t.payment_status }}
              </span>
            </td>

            <td class="td">{{ formatDate(t.payment_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
interface User {
  id: number;
  name: string;
}

interface Payment {
  id: string;
  user: User;
  amount: number;
  payment_status: string;
  payment_date: string;
}

const props = defineProps<{ payments: Payment[] }>();

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const statusClass = (status: string) => {
  switch (status) {
    case "approved":
    case "completado":
      return "bg-green-500/20 text-green-400";
    case "pending":
    case "pendiente":
      return "bg-yellow-500/20 text-yellow-400";
    case "failed":
    case "rechazado":
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
