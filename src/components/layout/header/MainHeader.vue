<template>
  <header
    class="bg-gray-900/90 border-t border-white/20  gap-4 w-full z-50 hidden md:flex md:flex-row justify-between items-center border-b-2 px-6 pt-6 pb-2 xl:px-16 fixed md:static shadow-md md:shadow-none rounded-b-xl">
    <Logo width="12" @click="router.push('/dashboard')"
      class="hidden md:block" />
      <div v-if="routeConfig.showSalirButton" @click="router.push('/dashboard')" class="w-full flex flex-row justify-end">
        <button
          class="text-gray-600 sm:text-md hover:shadow-lg py-2 px-4 rounded-full cursor-pointer">
          Salir
        </button>
      </div>
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div v-if="route.path !== '/add-space' && route.path !== '/add-vehicle'"
        class="relative flex flex-row sm:gap-2 items-center max-h-12 text-gray-800">
        <div class="">
          <!-- Botón visible solo en mobile -->
          <button @click="showMobileMenu = true"
            class="block md:hidden w-12 h-12 rounded-full text-2xl hover:shadow-xl">
            <font-awesome-icon icon="fa-align-justify" />
          </button>

          <!-- Menú lateral en mobile -->
          <MobileUserMenu v-model="showMobileMenu" @navigate="handleNavigate" />
        </div>
      </div>
      <div class="flex flex-row gap-1">
        <font-awesome-icon icon="fa-regular fa-circle-question"
          class="p-3 w-5 h-5 flex justify-center rounded-full cursor-pointer text-gray-400" @click="openHelp" />
        <NotificationDropdown v-if="routeConfig.showNotificationButton" />
        <MapButton :text="buttonText" color="gray-800" @click="toggleMap" class="md:hidden" />
        <UserMenu v-if="routeConfig.showUserMenuButton" @navigate="handleNavigate" />
        <BackButton v-if="routeConfig.showBackButton" />
      </div>
    </div>
    <template v-else>
      <!-- Skeleton Loader -->
      <div
        class="hidden md:flex justify-between items-center border-b-2 px-4 pt-6 md:pt-2 xl:px-10 xl:mx-16 h-20 bg-gray-300 rounded mb-4 animate-pulse">
        <!-- Logo placeholder -->
        <div class="w-16 h-10 bg-gray-400 rounded"></div>

        <!-- Botones de usuario placeholder -->
        <div class="flex gap-4 items-center">
          <div class="w-24 h-10 bg-gray-400 rounded-full"></div>
          <div class="w-10 h-10 bg-gray-400 rounded-full"></div>
        </div>
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
