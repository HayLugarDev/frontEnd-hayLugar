<template>

  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
    <BackButton />
  </div>

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

  <div class="min-h-screen md:pt-32 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] 
      text-white overflow-hidden border-b border-white/10 pt-8" v-if="!userStore.loading">
    <div class="flex flex-col md:pt-0 md:flex-row w-full items-start">

      <!-- Encabezado del Perfil -->
      <header class="hidden w-full md:w-1/3 md:flex flex-col justify-between items-center">
        <h1 class="w-1/3 text-4xl text-center mb-6 text-newgreen">Perfil</h1>
        <div class="w-11/12 px-4 space-y-1">
          <SectionMenu :activeSection="activeSection" :sections="menuSectionsComputed"
            @update:activeSection="handleSectionChange" />
        </div>
      </header>

      <!-- MENU MOBILE -->
      <div class="w-full sm:hidden items-center justify-center pt-20 px-8">
        <SectionMenu :activeSection="activeSection" :sections="menuSectionsComputed"
          @update:activeSection="handleSectionChange" />
      </div>

      <KeepAlive>
        <transition name="fade-step" mode="out-in">
          <section v-if="activeSection === 'resume'" key="resume"
            class="w-full md:w-2/3 sm:bg-white/10 sm:border-b p-10 md:p-12 sm:rounded-2xl sm:shadow-xl border-gray-600 transition-all">
            <!-- Encabezado con foto y datos -->
            <div class="flex flex-row items-center justify-between gap-8 bg-gradient-to-tr from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
                        p-6 rounded-2xl shadow-xl border border-gray-700">
              <div class="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                <!-- Foto de perfil -->
                <img :src="usuario.profile_picture || defaultProfilePicture" alt="Foto de perfil"
                  class="w-28 h-28 rounded-full object-cover shadow-lg border border-white/20" />

                <!-- Datos del usuario -->
                <div class="text-center sm:text-left">
                  <h2 class="text-2xl font-bold text-gray-200">
                    {{ usuario.name }} {{ usuario.last_name }}
                  </h2>
                  <p class="text-gray-400 text-sm flex items-center justify-center sm:justify-start mt-1">
                    <font-awesome-icon icon="envelope" class="mr-2 text-newgreen" />
                    {{ usuario.email }}
                  </p>
                  <p v-if="isAdmin"
                    class="text-xs mt-2 inline-flex items-center gap-1 text-green-700 justify-center sm:justify-start">
                    <span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>
                    Admin
                  </p>
                </div>
              </div>
              <!-- Admin -->
              <div v-if="isAdmin" class="mb-4 hidden md:block ">
                <SettingsItem class="gap-2" icon="fa-solid fa-wrench" label="Administración" :isAdmin="isAdmin"
                  @click="router.push('/admin-page')" />
              </div>
            </div>

            <ul class="w-full flex-1 sm:grid grid-cols-2 mt-8 border-b border-gray-600 pb-8 space-y-1 px-2">

              <!-- Admin -->
              <div v-if="isAdmin" class="mb-4 md:hidden">
                <SettingsItem icon="fa-solid fa-wrench" label="Administración" :isAdmin="isAdmin"
                  @click="router.push('/admin-page')" />
              </div>

              <div>
                <SettingsItem icon="fa-solid fa-user" label="Perfil personal"
                  @click="router.push('/personal-profile-user')" />

                <SettingsItem icon="fa-solid fa-calendar-check" label="Perfil anfitrión"
                  @click="router.push('/personal-profile-owner')" />

                <SettingsItem icon="fa-solid fa-car" label="Mis vehículos"
                  @click="router.push('/vehicles/user-vehicles')" />

                <SettingsItem icon="fa-solid fa-wallet" label="Billetera"
                  @click="router.push('/personal-wallet-user')" />
              </div>
              <div>
                <SettingsItem icon="fa-solid fa-bank" label="Cuentas de pago"
                  @click="router.push('/personal-accounts-user')" />

                <SettingsItem icon="fa-solid fa-question-circle" label="Centro de ayuda"
                  @click="router.push('/help')" />

                <SettingsItem icon="fa-solid fa-file-contract" label="Términos y condiciones"
                  @click="router.push('/termsConditions')" />

                <SettingsItem icon="fa-solid fa-shield-halved" label="Privacidad y seguridad"
                  @click="router.push('/PrivacyPolicy')" />
              </div>

            </ul>

            <button @click="verifyToken('/quit')"
              class="w-full flex-1 my-2 p-2 text-newgreen hover:bg-white/10 rounded-xl">
              Cerrar sesión
            </button>
          </section>

          <ReservationHistory v-else-if="activeSection === 'reservas-anteriores'" key="reservas"
            :reservations="reservas" />

          <PublicationHistory v-else-if="activeSection === 'publicaciones-anteriores'" key="publicaciones"
            :publications="publicaciones" />

          <!-- Solo admin -->
          <AdminWithdrawals v-else-if="activeSection === 'pagos' && isAdmin" key="pagos" :payout="pagos" />

        </transition>
      </KeepAlive>
    </div>

    <!-- Modals -->
    <StatusModal :visible="showSuccessModal" type="success" title="¡Éxito!"
      message="Los cambios se han guardado correctamente." :icon="logo" @confirm="closeSuccessModal" />

    <StatusModal :visible="showErrorModal" type="error" title="¡Atención!" :message="errorMessage" :icon="logo"
      @confirm="showErrorModal = false" />

    <SessionExpired :sessionExpired="isSessionInvalid" />

  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <img :src="loadIcon" alt="" class="max-w-10">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReservationHistory from '../components/pages/profilePage/ReservationHistory.vue';
import PublicationHistory from '../components/pages/profilePage/PublicationHistory.vue';
import { useUserStore } from '../store/userStore';
import api from '../services/apiService';
import defaultProfilePicture from '../assets/user_icon_primary.png';
import loadIcon from "../assets/load-icon_primary.svg";
import BackButton from '../components/common/BackButton.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import SectionMenu from '../components/pages/profilePage/UI/SectionMenu.vue';
import AdminWithdrawals from './AdminWithdrawals.vue';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import StatusModal from '../components/pages/addSpacePage/StatusModal.vue';
import SettingsItem from '../components/pages/profilePage/UI/SettingsItem.vue';
import logo from "../assets/logo.png";
import { useVerifyToken } from '../logic/useVerifyToken';
import SessionExpired from '../components/common/SessionExpired.vue';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

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
  role: "",
  owner_rating: 0,
  renter_rating: 0,
  created_at: null,
  updated_at: null,
});

// *** ADMIN: por ahora ID=6 o role='admin' ***
const isAdmin = computed(() => {
  const u = userStore.user;
  return !!(u && (u.role === 'admin' || u.id === import.meta.env.VITE_ADMIN_USER_ID));
});

const reservas = ref([]);
const publicaciones = ref([]);
const pagos = ref([]);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const activeSection = ref('resume') as Ref<string>;


// Menú base
const baseMenuSections = [
  { value: 'resume', label: 'Sobre mí' },
  { value: 'reservas-anteriores', label: 'Mis Reservas' },
  { value: 'publicaciones-anteriores', label: 'Mis Publicaciones' },
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
  if (wanted === 'pagos' && !isAdmin.value) return 'resume';
  if (available.includes(wanted)) return wanted as any;
  return 'resume';
}

// Arranque: leer query y normalizar
onMounted(async () => {

  await verifyToken();
  if (isSessionInvalid.value) return;

  console.log(usuario.value);
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
    if (sec === 'reservas-anteriores') {
      const userId = userStore.user?.id;
      if (userId) {
        const response = await api.get(`/reservations/history/${userId}`, { withCredentials: true });
        reservas.value = response.data;
      }
    }
  },
  { immediate: false }
);

const closeSuccessModal = () => {
  router.push('/dashboard');
  showSuccessModal.value = false;
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
