<template>
  <section class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
           text-white py-4">

    <div class="p-6">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 class="text-3xl font-bold text-white flex items-center gap-3">
          <font-awesome-icon icon="fa-solid fa-users" class="text-primary" />
          Usuarios del Sistema
        </h2>
      </div>

      <!-- STATS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">

        <!-- Total -->
        <div class="bg-white/5 p-5 rounded-xl border border-white/10 shadow
                 flex flex-col justify-center">
          <p class="text-gray-300 text-sm">Total registrados</p>
          <h3 class="text-3xl font-bold text-primary mt-1">{{ users.length }}</h3>
        </div>

        <!-- Últimos 7 días -->
        <div class="bg-white/5 p-5 rounded-xl border border-white/10 shadow
                 flex flex-col justify-center">
          <p class="text-gray-300 text-sm">Registrados esta semana</p>
          <h3 class="text-3xl font-bold text-primary mt-1">{{ recentUsers.length }}</h3>
        </div>

        <!-- Rol admin -->
        <div class="bg-white/5 p-5 rounded-xl border border-white/10 shadow
                 flex flex-col justify-center">
          <p class="text-gray-300 text-sm">Administradores</p>
          <h3 class="text-3xl font-bold text-primary mt-1">
            {{ adminsCount }}
          </h3>
        </div>

      </div>

      <!-- TABLA – CONTENEDOR SCROLL -->
      <div class="mt-10 bg-white/5 rounded-xl border border-white/10 shadow-xl
               overflow-hidden">

        <!-- SCROLL INTERNO -->
        <div class="max-h-[450px] overflow-y-auto custom-scroll">

          <table class="min-w-full text-sm">
            <thead class="sticky top-0 bg-[#1B263B] text-gray-200 z-10">
              <tr>
                <th class="px-5 py-3 text-left font-semibold">Nombre</th>
                <th class="px-5 py-3 text-left font-semibold">Email</th>
                <th class="px-5 py-3 text-left font-semibold">Rol</th>
                <th class="px-5 py-3 text-left font-semibold">Fecha</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="u in users" :key="u.id" class="border-t border-white/10 hover:bg-white/10 transition">
                <td class="px-5 py-3">{{ u.name }}</td>
                <td class="px-5 py-3">{{ u.email }}</td>
                <td class="px-5 py-3 capitalize text-primary">{{ u.role || 'usuario' }}</td>
                <td class="px-5 py-3">
                  {{ new Date(u.created_at).toLocaleDateString('es-AR') }}
                </td>
              </tr>
            </tbody>

          </table>
        </div>

      </div>

    </div>
  </section>
</template>


<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ users: any[] }>();

const recentUsers = computed(() =>
  props.users.filter((u) => {
    const diff =
      (Date.now() - new Date(u.created_at).getTime()) /
      (1000 * 3600 * 24);
    return diff <= 7;
  })
);

const adminsCount = computed(() =>
  props.users.filter((u) => u.role === "admin").length
);
</script>

<style scoped>
/* SCROLL ELEGANTE */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
