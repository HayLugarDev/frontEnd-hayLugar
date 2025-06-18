<template>
  <header
    class="backdrop:bg-secondary gap-4 hidden md:flex md:flex-row justify-between items-center border-b-2 px-4 pt-2 xl:px-10 xl:mx-16">
    <Logo width="16" @click="router.push('/dashboard')" />
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div v-if="routeConfig.showSalirButton" @click="router.push('/dashboard')">
        <button class="text-gray-800 border sm:text-md hover:shadow-lg bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Salir
        </button>
      </div>
      <div v-if="route.path === '/dashboard' || route.path.startsWith('/espacio')" class="relative flex flex-row sm:gap-2 items-center max-h-12">
        <button v-if="routeConfig.showPublicarButton" @click="verifyUser('/add-space')"
          class="text-gray-800 sm:text-md hover:shadow-lg hover:bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Publicá tu espacio
        </button>
        <button @click="openLoginMenu" v-if="routeConfig.showLoginButton"
          class="w-11 h-11 rounded-full border-2 bg-gray-200">
          <font-awesome-icon icon="fa-align-justify" />
        </button>
        <button @click="openUserMenu" v-if="routeConfig.showUserMenuButton"
          class="flex flex-row h-full hover:shadow-lg hover:bg-gray-50 gap-2 pl-4 pr-2 py-1 items-center justify-between rounded-full cursor-pointer">
          <font-awesome-icon v-if="!openMenu" icon="fa-angle-down" class="text-gray-500" />
          <font-awesome-icon v-else icon="fa-angle-up" class="text-gray-500" />
          <img v-if="isAuthenticated && userStore.user" src="../assets/user_icon.png" alt="ProfileIMG" class="w-10">
          <img v-else src="../assets/user_icon_primary.png" alt="UserIMG" class="w-10">
        </button>
        <ul v-if="openMenu"
          class="absolute bg-white rounded-xl flex flex-col py-2 top-14 left-1/4 z-30 cursor-pointer shadow-xl w-full">
          <li v-if="!isAuthenticated" @click="router.push('/register')" class="px-4 py-2 w-full hover:bg-gray-100">
            Registrarse</li>
          <li v-if="!isAuthenticated" @click="router.push('/login')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Iniciar sesión</li>
          <li v-if="isAuthenticated && userStore.user" @click="verifyUser('/profile')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Mi Perfil</li>
          <li @click="verifyUser('/add-space')" class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Publica tu espacio</li>
          <li @click="verifyUser('/wallet')" class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Wallet</li>
          <li class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Ayuda</li>
          <li v-if="isAuthenticated && userStore.user" @click="verifyUser('/quit')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Cerrar sesión</li>
        </ul>
      </div>
    </div>
  </header>
  <SessionExpired :sessionExpired="activedSession" />
</template>
<script setup>
import Logo from './Logo.vue';
import { useUserStore } from '../store/userStore';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SessionExpired from './SessionExpired.vue';
import { useHeaderVisibility } from "../logic/useHeaderVisibility";
import { useVerifyToken } from '../logic/useVerifyToken';
import BackButton from "./BackButton.vue";

const userStore = useUserStore();
const authChecked = ref(false);
const openMenu = ref(false);
const router = useRouter();
const route = useRoute();

const { routeConfig } = useHeaderVisibility();

const { verifyToken, activedSession } = useVerifyToken();

const isAuthenticated = computed(() => {
  return !!userStore.token;
});

onMounted(async () => {
  authChecked.value = true;
});

const verifyUser = async (route) => {
  const isValid = await verifyToken(route);
    if (!isValid) return;
}

const openUserMenu = () => {
  openMenu.value = !openMenu.value;
}

const openLoginMenu = () => {
  openMenu.value = !openMenu.value;
}
</script>