<template>
  <!-- HEADER SOLO EN DESKTOP -->
  <MainHeader class="hidden md:block" />

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

  <div
    class="min-h-screen md:p-10 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden"
    v-if="!userStore.loading">
    <div class="flex flex-col md:pt-0 md:flex-row w-full items-start">

      <!-- Encabezado del Perfil -->
      <header class="hidden w-full md:w-1/3 md:flex flex-col justify-between items-center">
        <h1 class="w-1/3 text-4xl text-center mb-6 text-primary">Perfil</h1>
        <div class="w-11/12 px-4 space-y-1">
          <SectionMenu :activeSection="activeSection" :sections="menuSectionsComputed"
            @update:activeSection="handleSectionChange" />
        </div>
      </header>

      <BackButton class="absolute right-11 top-24 z-50 md:hidden" />

      <!-- Selector móvil (no botón contenedor para evitar eventos raros anidados) -->
      <div class="w-full md:hidden items-center justify-center mb-4">
        <SectionMenu :activeSection="activeSection" :sections="menuSectionsComputed"
          @update:activeSection="handleSectionChange" />
      </div>

      <transition name="fade-step" mode="out-in">
        <KeepAlive>
          <section v-if="activeSection === 'datos'" key="datos"
            class="w-full md:w-2/3 bg-white/10 border-white/10 p-10 md:p-12 rounded-2xl shadow-xl border border-gray-100 transition-all">
            <!-- Encabezado con foto y datos -->
            <div class="flex flex-row items-center justify-between gap-8">
              <div class="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                <!-- Foto de perfil -->
                <div class="relative group">
                  <img :src="usuario.profile_picture || defaultProfilePicture" alt="Foto de perfil"
                    class="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full shadow-lg ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all cursor-pointer"
                    @click="cambiarFoto" />
                  <button @click="cambiarFoto"
                    class="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                    title="Cambiar foto">
                    <font-awesome-icon icon="camera" />
                  </button>
                </div>

                <!-- Datos del usuario -->
                <div class="text-center sm:text-left">
                  <h2 class="text-2xl font-bold text-gray-200">
                    {{ usuario.name }} {{ usuario.last_name }}
                  </h2>
                  <p class="text-gray-200 flex items-center justify-center sm:justify-start mt-1">
                    <font-awesome-icon icon="envelope" class="mr-2 text-primary" />
                    {{ usuario.email }}
                  </p>
                  <p v-if="usuario.dni" class="text-gray-200 flex items-center justify-center sm:justify-start mt-1">
                    <font-awesome-icon icon="id-card" class="mr-2 text-primary" />
                    DNI: {{ usuario.dni }}
                  </p>
                  <p v-if="isAdmin"
                    class="text-xs mt-2 inline-flex items-center gap-1 text-green-700 justify-center sm:justify-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>
                    Admin
                  </p>
                </div>
              </div>

              <!-- Botón de cerrar sesión (solo móvil) -->
              <button @click="verifyToken('/quit')"
                class="md:hidden bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-800 transition flex items-center gap-2">
                Cerrar sesión
              </button>
            </div>

            <!-- Formulario -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-model="usuario.name" label="NOMBRE" type="text" required />
              <FormField v-model="usuario.last_name" label="APELLIDO" type="text" required />
              <FormField v-model="usuario.email" label="EMAIL" type="text" required />
              <FormField v-model="usuario.dni" label="DOCUMENTO" type="text" required />
              <FormFieldAutocomplete v-model="usuario.address" label="DIRECCIÓN" class="md:col-span-2" />
            </div>

            <!-- Botón Guardar -->
            <div class="mt-8">
              <button @click="guardarTodo"
                class="w-full bg-primary text-gray-200 py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <font-awesome-icon icon="save" class="text-lg" />
                Guardar Cambios
              </button>
            </div>
          </section>

          <VehicleSection v-else-if="activeSection === 'vehicles'" key="vehicles" />

          <ReservationIncomingHistory v-else-if="activeSection === 'reservas-entrantes'" key="reservas-entrantes"
            :reservations="reservasEntrantes" />

          <ReservationHistory v-else-if="activeSection === 'reservas'" key="reservas" :reservations="reservas" />

          <PublicationHistory v-else-if="activeSection === 'publicaciones'" key="publicaciones"
            :publications="publicaciones" />

          <Favorites v-else-if="activeSection === 'favoritos'" key="favorites" :reservations="favoritos" />

          <UserReviews v-else-if="activeSection === 'calificaciones'" key="reviews" />

          <PayoutAccounts v-else-if="activeSection === 'cuentas'" key="cuentas" :payout="cuentas" />

          <walletProfile v-else-if="activeSection === 'walletP'" key="walletP" />

          <!-- Solo admin -->
          <AdminWithdrawals v-else-if="activeSection === 'pagos' && isAdmin" key="pagos" :payout="pagos" />

        </KeepAlive>
      </transition>

    </div>

    <!-- Modales -->
    <StatusModal :visible="showSuccessModal" type="success" title="¡Éxito!"
      message="Los cambios se han guardado correctamente." icon="/src/assets/logo.png" @confirm="closeSuccessModal" />

    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage"
      icon="/src/assets/logo.png" @confirm="showErrorModal = false" />

  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <img :src="loadIcon" alt="" class="max-w-10">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReservationHistory from '../components/pages/profilePage/ReservationHistory.vue';
import PublicationHistory from '../components/pages/profilePage/PublicationHistory.vue';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';
import defaultProfilePicture from '../assets/user_icon_primary.png';
import loadIcon from "../assets/load-icon_primary.svg";
import BackButton from '../components/common/BackButton.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import FormField from '../components/forms/FormField.vue';
import FormFieldAutocomplete from '../components/forms/FormFieldAutocomplete.vue';
import { useVerifyToken } from '../logic/useVerifyToken';
import VehicleSection from '../components/pages/profilePage/VehicleSection.vue';
import SectionMenu from '../components/pages/profilePage/UI/SectionMenu.vue';
import ReservationIncomingHistory from '../components/pages/profilePage/ReservationIncomingHistory.vue';
import PayoutAccounts from './PayoutAccounts.vue';
import AdminWithdrawals from './AdminWithdrawals.vue';
import walletProfile from './wallet.vue';
import UserReviews from '../components/pages/profilePage/UserReviews.vue';
import Favorites from '../components/pages/profilePage/Favorites.vue';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const inputFoto = ref<HTMLInputElement | null>(null);

const { verifyToken, isSessionInvalid } = useVerifyToken();

const usuario = computed(() => userStore.user || {
  id: "",
  profile_picture: defaultProfilePicture,
  name: "",
  last_name: "",
  email: "",
  dni: "",
  address: "",
  phone: "",
  walletEmail: ""
});

// *** ADMIN: por ahora ID=6 o role='admin' ***
const isAdmin = computed(() => {
  const u = userStore.user;
  return !!(u && (u.role === 'admin' || u.id === 6));
});

const reservas = ref([]);
const favoritos = ref([]);
const reservasEntrantes = ref([]);
const publicaciones = ref([]);
const cuentas = ref([]);
const pagos = ref([]);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const activeSection = ref<'datos' | 'vehicles' | 'reservas' | 'reservas-entrantes' | 'publicaciones' | 'favoritos' | 'calificaciones' | 'walletP' | 'cuentas' | 'pagos'>('datos');

// Menú base
const baseMenuSections = [
  { value: 'datos', label: 'Datos personales' },
  { value: 'vehicles', label: 'Mis Vehículos' },
  { value: 'reservas', label: 'Mis Reservas' },
  { value: 'reservas-entrantes', label: 'Reservas entrantes' },
  { value: 'publicaciones', label: 'Publicaciones' },
  { value: 'favoritos', label: 'Favoritos' },
  { value: 'calificaciones', label: 'Calificaciones' },
  { value: 'walletP', label: 'Ganancias' },
  { value: 'cuentas', label: 'Cuentas' },
];

// Menú computado (agrega pagos sólo si admin)
const menuSectionsComputed = computed(() => {
  const items = [...baseMenuSections];
  if (isAdmin.value) {
    items.push({ value: 'pagos', label: 'Solicitud de Pagos' });
  }
  return items;
});

// --- Sincronización con la URL ---
// Normaliza una sección en base a si es admin y las secciones válidas
function normalizeSection(s?: string | null): typeof activeSection.value {
  const available = menuSectionsComputed.value.map(s => s.value);
  const wanted = (s || '').toString();
  if (wanted === 'pagos' && !isAdmin.value) return 'datos';
  if (available.includes(wanted)) return wanted as any;
  return 'datos';
}

// Arranque: leer query y normalizar
onMounted(() => {
  const sectionFromUrl = route.query.section as string | undefined;
  const normalized = normalizeSection(sectionFromUrl);
  if (normalized !== sectionFromUrl) {
    router.replace({ query: { ...route.query, section: normalized } });
  }
  activeSection.value = normalized;
});

// Reaccionar a cambios de query o de admin-ness
watch(
  () => [route.query.section, isAdmin.value],
  () => {
    const sectionFromUrl = route.query.section as string | undefined;
    const normalized = normalizeSection(sectionFromUrl);
    if (normalized !== activeSection.value) {
      activeSection.value = normalized;
    }
    // Si la URL pide algo no permitido, reescribe
    if (normalized !== sectionFromUrl) {
      router.replace({ query: { ...route.query, section: normalized } });
    }
  },
  { immediate: false }
);

// El handler ya no setea activeSection directamente; solo empuja a la URL
const handleSectionChange = (val: string) => {
  const normalized = normalizeSection(val);
  const current = route.query.section as string | undefined;
  if (current !== normalized) {
    router.push({ query: { ...route.query, section: normalized } });
  }
};

// Datos cuando corresponde (ejemplo: reservas-entrantes)
watch(
  () => activeSection.value,
  async (sec) => {
    if (sec === 'reservas-entrantes') {
      const userId = userStore.user?.id;
      if (userId) {
        const response = await api.get(`/reservations/incoming/${userId}`, { withCredentials: true });
        reservasEntrantes.value = response.data;
      }
    }
  },
  { immediate: false }
);

const cambiarFoto = (): void => {
  // inputFoto.value?.click();
};

const guardarTodo = async (): Promise<void> => {

  const payload = {
    name: usuario.value.name,
    last_name: usuario.value.last_name,
    email: usuario.value.email,
    dni: usuario.value.dni,
    address: usuario.value.address,
    profile_picture: typeof usuario.value.profile_picture === "string"
      ? usuario.value.profile_picture
      : userStore.user.profile_picture
  };

  console.log(payload)
  try {
    const response = await api.put(
      `/users/update/${usuario.value.id}`,
      payload,
      { withCredentials: true }
    );

    userStore.setUser(response.data);
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error al guardar los cambios", error);
    errorMessage.value = "Hubo un error al guardar los cambios. Por favor, inténtalo nuevamente.";
    showErrorModal.value = true;
  }
};

const closeSuccessModal = () => {
  router.push('/dashboard');
  showSuccessModal.value = false;
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>

<style scoped>
/* Transición para el modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
