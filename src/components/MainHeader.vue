<template>
  <header
    class="backdrop:bg-secondary gap-4 hidden md:flex md:flex-row justify-between items-center rounded-b-lg border-b px-4 pt-2 sm:px-10 sm:mx-16">
    <Logo widht="16" />
    <div v-if="authChecked" class="flex flex-row justify-between gap-2">
      <div class="relative flex flex-row sm:gap-2 items-center max-h-12">
        <button @click="verifyToken('/add-space')"
          class="text-gray-800 sm:text-md hover:shadow-lg hover:bg-gray-50 py-2 px-4 rounded-full cursor-pointer h-full">
          Publicá tu espacio
        </button>
        <button @click="openUserMenu"
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
          <li class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Ayuda</li>
          <li v-if="isAuthenticated && userStore.user" @click="verifyToken('/quit')"
            class="text-gray-700 px-4 py-2 w-full hover:bg-gray-100">Cerrar sesión</li>
        </ul>
      </div>
    </div>
    <!-- <div
        class="col-span-5 justify-center flex flex-col md:flex-row items-center md:w-auto bg-gray-100 p-3 rounded-full shadow-md">
        <div class="flex items-center">
          <font-awesome-icon icon="map-marker-alt" class="text-xl text-primary" />
          <input v-model="searchQuery" type="text" placeholder="Buscar ubicación"
            class="flex-1 outline-none px-4 py-2 bg-white rounded-full text-textPrimary shadow-sm" />
        </div>
        <input v-model="checkIn" type="date"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <input v-model="checkOut" type="date"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <select v-model="rangoTiempo"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm">
          <option value="hora">Por Hora</option>
          <option value="dia">Por Día</option>
          <option value="semana">Por Semana</option>
          <option value="mes">Por Mes</option>
        </select>
      </div> -->
  </header>
  <SessionExpired :sessionExpired="activedSession" />
</template>
<script setup>
import Logo from './Logo.vue';
import { useUserStore } from '../store/userStore';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { verifyActiveSession } from '../middleware/verifyToken';
import SessionExpired from './SessionExpired.vue';

const userStore = useUserStore();
const authChecked = ref(false);
const activedSession = ref(false);
const openMenu = ref(false);
const router = useRouter();

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
</script>