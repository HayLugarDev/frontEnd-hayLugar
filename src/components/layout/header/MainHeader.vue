<template>
  <header
    class="backdrop:bg-secondary gap-4 hidden md:flex md:flex-row justify-between items-center border-b-2 px-4 pt-2 xl:px-10 xl:mx-16">
    <Logo width="16" @click="router.push('/dashboard')" class="transition-transform duration-300 hover:scale-105" />
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div v-if="routeConfig.showSalirButton" @click="router.push('/dashboard')">
        <button
          class="text-gray-800 border sm:text-md hover:shadow-lg bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Salir
        </button>
      </div>
      <div v-if="route.path !== '/add-space'"
        class="relative flex flex-row sm:gap-2 items-center max-h-12">
        <NotificationDropdown />
        <!-- Notificaciones -->
        <!-- <div class="relative">
          <button @click="userStore.clearNotifications()"
            class="relative w-12 h-12 flex items-center justify-center hover:shadow-xl hover:bg-white rounded-full transition duration-200">
            <font-awesome-icon icon="bell" class="text-xl text-gray-700 dark:text-white" /> -->

            <!-- Punto rojo titilante -->
            <!-- <span v-if="userStore.notifications.length"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span> -->

            <!-- Globo de notificación -->
            <!-- <div v-if="showNotificationBubble"
              class="absolute right-10 top-1 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in">
              Tienes notificaciones!
            </div>
          </button> -->

          <!-- <div v-if="showNotificationBubble"
            class="absolute top-10 -left-20 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-lg shadow-md animate-fade-in">
            Nueva reserva!
            <div class="absolute w-3 h-3 bg-yellow-100 rotate-45 bottom-5 left-20 transform"></div>
          </div> -->
        <!-- </div> -->

        <button @click="openLoginMenu" v-if="routeConfig.showLoginButton"
          class="w-11 h-11 rounded-full border-2 bg-gray-200">
          <font-awesome-icon icon="fa-align-justify" />
        </button>
        <button @click="openUserMenu" v-if="routeConfig.showUserMenuButton"
          class="flex flex-row h-full hover:shadow-lg hover:bg-gray-50 gap-2 pl-4 pr-2 py-1 items-center justify-between rounded-full cursor-pointer">
          <font-awesome-icon v-if="!openMenu" icon="fa-angle-down" class="text-gray-500" />
          <font-awesome-icon v-else icon="fa-angle-up" class="text-gray-500" />
          <img :src="getHostImage()" alt="ProfileIMG" class="w-10 rounded-full">
        </button>
        <ul v-if="openMenu"
          class="absolute bg-white rounded-xl flex flex-col py-2 top-14 left-30 z-30 cursor-pointer shadow-xl w-full">
          <li v-if="!userStore.user" @click="router.push('/register')" class="px-4 py-2 w-full hover:bg-gray-100">
            Registrarse</li>
          <li v-if="!userStore.user" @click="router.push('/login')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Iniciar sesión</li>
          <li v-if="userStore.user" @click="verifyToken('/profile')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Mi Perfil</li>
          <li @click="verifyToken('/add-space')" class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Publica tu espacio</li>
          <li v-if="userStore.user" @click="verifyToken('/wallet')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Wallet</li>
          <li class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Ayuda</li>
          <li v-if="userStore.user" @click="verifyToken('/quit')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Cerrar sesión</li>
        </ul>
      </div>
    </div>
  </header>
  <SessionExpired :sessionExpired="isSessionInvalid" />
</template>

<script setup>
import Logo from '../Logo.vue';
import { useUserStore } from '../../../store/userStore';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SessionExpired from '../../common/SessionExpired.vue';
import { useHeaderVisibility } from "../../../logic/useHeaderVisibility";
import { useVerifyToken } from '../../../logic/useVerifyToken';
import user_icon_primary from "../../../assets/user_icon_primary.png";
import BackButton from "../../common/BackButton.vue";
import NotificationDropdown from './NotificationDropdown.vue';

const userStore = useUserStore();
const showNotificationBubble = ref(false);

const authChecked = ref(false);
const openMenu = ref(false);
const hasUnread = ref(true);
const router = useRouter();
const route = useRoute();

const { routeConfig } = useHeaderVisibility();

const { verifyToken, isSessionInvalid } = useVerifyToken();

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

const openUserMenu = () => {
  openMenu.value = !openMenu.value;
}

const openLoginMenu = () => {
  openMenu.value = !openMenu.value;
}

function toggleNotifications() {
  console.log('Mostrar panel de notificaciones');
  hasUnread.value = false;
}

const getHostImage = () => {
  return userStore.user?.profile_picture || user_icon_primary;
};
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
