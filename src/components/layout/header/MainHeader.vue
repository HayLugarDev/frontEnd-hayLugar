<template>
  <header
    class="hidden w-full z-50 fixed md:static top-0 left-0
           bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
           text-white border-b border-white/10 shadow-lg md:shadow-none
           px-6 py-4 xl:px-16 md:flex items-center justify-between gap-6">

    <!-- LEFT: LOGO + TITULO -->
    <div class="flex items-center gap-4 cursor-pointer" @click="router.push('/dashboard')">
      <Logo width="12" class="drop-shadow-lg" />

      <!-- Texto principal -->
      <span
        class="hidden md:block font-bold tracking-tight text-xl lg:text-2xl 
               text-white hover:text-accent transition-colors duration-200">
        Encontrá tu próximo estacionamiento
      </span>
    </div>

    <!-- RIGHT AREA: MENÚ/ BOTONES -->
    <div v-if="authChecked" class="flex items-center gap-2 md:gap-3">

      <!-- Botón menú mobile -->
      <button 
        @click="showMobileMenu = true"
        class="block md:hidden w-12 h-12 rounded-full text-2xl text-white/80 hover:text-white"
      >
        <font-awesome-icon icon="fa-align-justify" />
      </button>

      <MobileUserMenu v-model="showMobileMenu" @navigate="handleNavigate" />

      <!-- Botón ayuda -->
      <font-awesome-icon 
        icon="fa-regular fa-circle-question"
        class="p-3 w-6 h-6 rounded-full cursor-pointer text-gray-100 hover:text-white transition"
        @click="openHelp"
      />

      <!-- Notificaciones -->
      <NotificationDropdown v-if="routeConfig.showNotificationButton" />

      <!-- Botón mapa (mobile only) -->
      <MapButton 
        :text="buttonText"
        color="white" 
        background="primary"
        @click="toggleMap"
        class="md:hidden"
      />

      <!-- Menú usuario -->
      <UserMenu 
        v-if="routeConfig.showUserMenuButton"
        @navigate="handleNavigate"
      />

    </div>

    <!-- LOADER -->
    <template v-else>
      <div class="flex items-center gap-4 animate-pulse">
        <div class="w-10 h-10 bg-white/20 rounded-full"></div>
        <div class="w-24 h-8 bg-white/20 rounded-lg"></div>
      </div>
    </template>

  </header>

  <HelpModal :visible="activatedModal" @close="activatedModal = false" />
  <SessionExpired :sessionExpired="isSessionInvalid" />
</template>


<script setup lang="ts">
import Logo from '../Logo.vue';
import { useUserStore } from '../../../store/userStore';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SessionExpired from '../../common/SessionExpired.vue';
import { useHeaderVisibility } from "../../../logic/useHeaderVisibility";
import { useVerifyToken } from '../../../logic/useVerifyToken';
import NotificationDropdown from './NotificationDropdown.vue';
import UserMenu from '../UserMenu.vue';
import MobileUserMenu from './MobileUserMenu.vue';
import MapButton from '../../pages/dashboardPage/MapButton.vue';
import BackButton from '../../common/BackButton.vue';
import HelpModal from '../HelpModal.vue';

const userStore = useUserStore();
const showNotificationBubble = ref(false);
const showMobileMenu = ref(false)
const authChecked = ref(false);
const activatedModal = ref(false);
const showMap = ref(false);
const router = useRouter();
const route = useRoute();

const buttonText = computed(() => showMap.value ? 'Ver Lista' : 'Mapa');

const { routeConfig } = useHeaderVisibility();

const { verifyToken, isSessionInvalid } = useVerifyToken();

const emit = defineEmits(['toggle']);

onMounted(async () => {
  authChecked.value = true;
});

const handleNavigate = (path: string) => {
  if (path === '/quit') {
    return verifyToken(path);
  }
  if (path !== '/add-space') {
    router.push(path);
  } else {
    return verifyToken(path);
  }
};

function toggleMap() {
  showMap.value = !showMap.value;
  showMobileMenu.value = false;
  showNotificationBubble.value = false;
  emit('toggle');
}

function openHelp() {
  activatedModal.value = true;
  document.body.style.overflow = 'hidden' // evita scroll de fondo
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.4s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
