<template>
  <div class="flex flex-col max-w-7xl mx-auto p-8 gap-8">
    <h1 class="text-3xl font-bold text-primary text-center mb-4">Panel de Administración</h1>

    <!-- Tabs -->
    <div class="flex justify-center gap-4 border-b border-gray-200 pb-2">
      <button v-for="tab in tabs" :key="tab.key" :class="[
        'px-4 py-2 rounded-lg font-semibold transition-colors',
        activeTab === tab.key
          ? 'bg-primary text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      ]" @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <p class="text-gray-500">Cargando datos...</p>
    </div>

    <div v-else>
      <AdminUsers v-if="activeTab === 'users'" :users="users" />
      <AdminSpaces v-if="activeTab === 'spaces'" :spaces="spaces" @refresh="handleUpdateSpaces" />
      <AdminReservations v-if="activeTab === 'reservations'" :reservations="reservations" />
      <AdminPayments v-if="activeTab === 'payments'" :payments="payments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/apiService";
import AdminUsers from "../components/pages/adminPage/AdminUsers.vue";
import AdminSpaces from "../components/pages/adminPage/AdminSpaces.vue";
import AdminReservations from "../components/pages/adminPage/AdminReservations.vue";
import AdminPayments from "../components/pages/adminPage/AdminPayments.vue";

const activeTab = ref("users");
const loading = ref(false);
const users = ref([]);
const spaces = ref([]);
const reservations = ref([]);
const payments = ref([]);

const tabs = [
  { key: "users", label: "Usuarios" },
  { key: "spaces", label: "Espacios" },
  { key: "reservations", label: "Reservas" },
  { key: "payments", label: "Pagos" },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
};

onMounted(async () => {
  loading.value = true;
  try {
    const [usersRes, spacesRes, reservationsRes, paymentsRes] = await Promise.all([
      api.get("/users/getAll", { withCredentials: true }),
      api.get("/spaces/getAll", { withCredentials: true }),
      api.get("/reservations/getAll", { withCredentials: true }),
      api.get("/payments/getAll", { withCredentials: true }),
    ]);

    users.value = usersRes.data.users || usersRes.data;
    spaces.value = spacesRes.data.spaces || spacesRes.data;
    payments.value = paymentsRes.data.payments || paymentsRes.data;

    const rawReservations = reservationsRes.data.reservations || reservationsRes.data;
    reservations.value = rawReservations.map((r: any) => {
      const user = users.value.find((u) => u.id === r.user_id);
      const owner = users.value.find((o) => o.id === r.owner_id);
      const space = spaces.value.find((s) => s.id === r.space_id);
      return {
        ...r,
        user: user ? { id: user.id, name: user.name } : { name: "Desconocido" },
        owner: owner ? { id: owner.id, name: owner.name } : { name: "Desconocido" },
        space: space ? { id: space.id, name: space.name } : { name: "Desconocido" },
      };
    });
  } catch (error) {
    console.error("Error cargando datos admin:", error);
  } finally {
    loading.value = false;
  }
});

function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      !(source[key] instanceof Array) &&
      key in target
    ) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}

const handleUpdateSpaces = (action: string, payload?: any) => {
  if (action === 'edit' && payload) {
    const index = spaces.value.findIndex(space => space.id === payload.id);
    if (index !== -1) {
      spaces.value[index] = deepMerge(spaces.value[index], payload);
    } else {
      spaces.value.push(payload);
    }
  } else if (action === 'delete' && payload) {
    spaces.value = spaces.value.filter(space => space.id !== payload.id);
  }
};

</script>
