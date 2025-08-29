<template>
  <header
    class="bg-secondary/80 backdrop-blur-md gap-4 w-full z-50 md:flex md:flex-row justify-between items-center border-b-2 px-6 py-2 xl:px-16 fixed md:static transition-all duration-300 shadow-md md:shadow-none animate-fade-in-down">
    <Logo width="12" @click="router.push('/dashboard')"
      class="transition-transform duration-300 hover:scale-105 hidden md:block" />
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div v-if="routeConfig.showSalirButton" @click="router.push('/dashboard')">
        <button
          class="text-gray-800 border sm:text-md hover:shadow-lg bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Salir
        </button>
      </div>
      <div v-if="route.path !== '/add-space' && route.path !== '/add-vehicle'"
        class="relative flex flex-row sm:gap-2 items-center max-h-12">
        <font-awesome-icon icon="fa-regular fa-circle-question"
          class="hidden md:block p-3 text-gray-500 w-6 h-6 hover:shadow-xl hover:bg-gray-50 rounded-full cursor-pointer" />
        <NotificationDropdown class="hidden md:block" v-if="routeConfig.showNotificationButton" />
        <div class="">
          <!-- Botón visible solo en mobile -->
          <button @click="showMobileMenu = true"
            class="block md:hidden w-11 h-11 rounded-full border-2 border-gray-300 bg-gray-50 shadow-lg">
            <font-awesome-icon icon="fa-align-justify" />
          </button>

          <!-- Menú lateral en mobile -->
          <MobileUserMenu v-model="showMobileMenu" @navigate="handleNavigate" />
        </div>
        <UserMenu v-if="routeConfig.showUserMenuButton" @navigate="handleNavigate" />
      </div>
      <MapButton :text="buttonText" color="primary" background="gray-50" @click="toggleMap" class="md:hidden" />
    </div>
    <template v-else>
      <!-- Skeleton Loader -->
      <div
        class="hidden md:flex justify-between items-center border-b-2 px-4 pt-2 xl:px-10 xl:mx-16 h-20 bg-gray-300 rounded mb-4 animate-pulse">
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
  <SessionExpired :sessionExpired="isSessionInvalid" />
</template>

<script setup lang="ts">
import Logo from '../Logo.vue';
import { useUserStore } from '../../../store/userStore';
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SessionExpired from '../../common/SessionExpired.vue';
import { useHeaderVisibility } from "../../../logic/useHeaderVisibility";
import { useVerifyToken } from '../../../logic/useVerifyToken';
import BackButton from "../../common/BackButton.vue";
import NotificationDropdown from './NotificationDropdown.vue';
import UserMenu from '../UserMenu.vue';
import MobileUserMenu from './MobileUserMenu.vue';
import MapButton from '../../pages/dashboardPage/MapButton.vue';

const userStore = useUserStore();
const showNotificationBubble = ref(false);
const showMobileMenu = ref(false)
const authChecked = ref(false);
const hasUnread = ref(true);
const showMap = ref(false);
const router = useRouter();
const route = useRoute();

const buttonText = computed(() => showMap.value ? 'Ver Lista' : 'Ver Mapa');

const { routeConfig } = useHeaderVisibility();

const { verifyToken, isSessionInvalid } = useVerifyToken();

const emit = defineEmits(['toggle']);

onMounted(async () => {
  authChecked.value = true;
});

watch(
  () => userStore.notifications.length,
  (newVal) => {
    if (newVal > 0) {
      showNotificationBubble.value = true;

      setTimeout(() => {
        showNotificationBubble.value = false;
      }, 4000); // Oculta el globo tras 4 segundos
    }
  }
);

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

function toggleNotifications() {
  console.log('Mostrar panel de notificaciones');
  hasUnread.value = false;
}

function toggleMap() {
  showMap.value = !showMap.value;
  emit('toggle');
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
