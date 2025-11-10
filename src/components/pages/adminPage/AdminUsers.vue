<template>
  <section>
    <div class="flex flex-col md:flex-row justify-between items-center">
      <h2 class="text-2xl font-semibold mb-4">Usuarios</h2>
      <div>
        <span>Total registrados: <strong class="text-primary">{{ users.length }}</strong></span>
        <span class="ml-4">Recientes: <strong class="text-primary">{{ recentUsers.length }}</strong></span>
      </div>
    </div>

    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Rol</th>
          <th class="px-4 py-2 text-left">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ u.name }}</td>
          <td class="px-4 py-2">{{ u.email }}</td>
          <td class="px-4 py-2 capitalize">{{ u.role || 'usuario' }}</td>
          <td class="px-4 py-2">{{ new Date(u.created_at).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ users: any[] }>();
const recentUsers = computed(() =>
  props.users.filter((u) => {
    const diff = (Date.now() - new Date(u.created_at).getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  })
);
</script>
