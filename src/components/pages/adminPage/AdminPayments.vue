<template>
  <section>
    <h2 class="text-2xl font-semibold mb-4">Transacciones</h2>

    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Usuario</th>
          <th class="px-4 py-2 text-left">Monto</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in payments" :key="t.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ t.id }}</td>
          <td class="px-4 py-2">{{ t.user?.name || 'Desconocido' }}</td>
          <td class="px-4 py-2 font-semibold">$ {{ t.amount }}</td>
          <td class="px-4 py-2 capitalize">{{ t.payment_status }}</td>
          <td class="px-4 py-2">{{ formatDate(t.payment_date) }}</td>
        </tr>
      </tbody>
    </table>
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
  new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
</script>
