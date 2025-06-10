<template>
  <header
    class="backdrop:bg-secondary gap-4 hidden md:flex md:flex-row justify-between items-center border-b-2 px-4 pt-2 xl:px-10 xl:mx-16">
    <Logo widht="16" @click="router.push('/dashboard')" />
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div v-if="route.path === '/add-space'" @click="router.push('/dashboard')">
        <button class="text-gray-800 border sm:text-md hover:shadow-lg bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Salir
        </button>
      </div>
      <div v-if="route.path === '/dashboard' || route.path.startsWith('/espacio')" class="relative flex flex-row sm:gap-2 items-center max-h-12">
        <button v-if="route.path !== '/add-space' || !route.path.startsWith('/espacio')" @click="verifyToken('/add-space')"
          class="text-gray-800 sm:text-md hover:shadow-lg hover:bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Publicá tu espacio
        </button>
        <button @click="openLoginMenu" v-if="route.path === '/login'"
          class="w-11 h-11 rounded-full border-2 bg-gray-200">
          <font-awesome-icon icon="fa-align-justify" />
        </button>
        <button @click="openUserMenu" v-if="route.path !== '/login'"
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
          <li v-if="isAuthenticated && userStore.user" @click="verifyToken('/profile')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Mi Perfil</li>
          <li @click="verifyToken('/add-space')" class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Publica tu espacio</li>
          <li @click="verifyToken('/wallet')" class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">
            Wallet</li>
          <li class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Ayuda</li>
          <li v-if="isAuthenticated && userStore.user" @click="verifyToken('/quit')"
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
import { verifyActiveSession } from '../middleware/verifyToken';
import SessionExpired from './SessionExpired.vue';
import BackButton from "./BackButton.vue";

const userStore = useUserStore();
const authChecked = ref(false);
const activedSession = ref(false);
const openMenu = ref(false);
const router = useRouter();
const route = useRoute();

const isAuthenticated = computed(() => {
  return !!userStore.token;
});

onMounted(async () => {
  authChecked.value = true;
});

const verifyToken = async (route) => {
  const result = await verifyActiveSession(route, userStore.sessionExpired);
  if (!result) {
    userStore.clearUser();
    activedSession.value = true;
    return;
  }
  if (userStore.isAuthenticated) {
    if (route === '/quit') {
      userStore.clearUser();
      authChecked.value = false;
      window.location.href = '/dashboard';
      return;
    }
    activedSession.value = !userStore.isAuthenticated;
    return router.push(route);
  } else {
    return activedSession.value = !userStore.isAuthenticated;
  }
}

const openUserMenu = () => {
  openMenu.value = !openMenu.value;
}

const openLoginMenu = () => {
  openMenu.value = !openMenu.value;
}
</script>