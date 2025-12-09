<template>

  <MainHeader class="hidden sm:block" />

  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
    <BackButton />
  </div>

  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] pt-24 md:px-6 md:py-14 text-white">

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
import { ref, onMounted, watch } from "vue";
import api from "../services/apiService";
import AdminUsers from "../components/pages/adminPage/AdminUsers.vue";
import AdminSpaces from "../components/pages/adminPage/AdminSpaces.vue";
import AdminReservations from "../components/pages/adminPage/AdminReservations.vue";
import AdminPayments from "../components/pages/adminPage/AdminPayments.vue";
import BackButton from "../components/common/BackButton.vue";
import MainHeader from "../components/layout/header/MainHeader.vue";

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

watch(activeTab, async (newTab) => {
  if (newTab === "spaces" && spaces.value.length === 0) loadSpaces();
});

const loadSpaces = async () => {
  loading.value = true;
  try {
    const spacesRes = await api.get("/spaces/getAll", { withCredentials: true });
    spaces.value = spacesRes.data.spaces || spacesRes.data;
  } catch (error) {
    console.error("Error cargando espacios:", error);
  } finally {
    loading.value = false;
  }
};

const handleUpdateSpaces = (action: string, payload?: any) => {
  if (!payload) return;

  if (action === "edit") {
    const idx = spaces.value.findIndex(s => s.id === payload.id);

    if (idx !== -1) {
      // reemplazar por objeto completo (mucho más seguro)
      spaces.value[idx] = { ...spaces.value[idx], ...payload };
    } else {
      spaces.value.push(payload);
    }

    // actualizar reservas relacionadas
    reservations.value = reservations.value.map(r =>
      r.space_id === payload.id
        ? {
          ...r,
          space: { id: payload.id, name: payload.name }
        }
        : r
    );
  }

  if (action === "delete") {
    spaces.value = spaces.value.filter(s => s.id !== payload.id);

    // marcar reservas como eliminadas (opcional)
    reservations.value = reservations.value.map(r =>
      r.space_id === payload.id
        ? { ...r, space: { name: "Eliminado" } }
        : r
    );
  }
};


</script>
