<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';
import Toast from './components/common/Toast.vue';
import CookieBanner from './components/common/CookieBanner.vue';
import { getSocket } from './services/socket';

const route = useRoute();
const userStore = useUserStore();
const socket = getSocket();

const authChecked = ref(false);

const publicRoutes = [
  '/',
  '/home',
  '/landing',
  '/termsConditions',
  '/PrivacyPolicy',
];

const isPublicRoute = computed(() => {
  return publicRoutes.includes(route.path);
});

const routeViewKey = computed(() => {
  return route.name ? String(route.name) : route.path;
});

const fetchUserIfNeeded = async (): Promise<void> => {
  if (isPublicRoute.value) {
    return;
  }

  if (authChecked.value) {
    return;
  }

  try {
    authChecked.value = true;
    await userStore.fetchUser();
  } catch (error) {
    console.error('Error al validar sesión:', error);
  }
};

onMounted(() => {
  socket.off('connect');
  socket.on('connect', () => {
    console.log('🟢 WS conectado');
  });

  socket.off('disconnect');
  socket.on('disconnect', () => {
    console.log('🔴 WS desconectado');
  });
});

watch(
  () => route.path,
  async () => {
    await fetchUserIfNeeded();
  },
  { immediate: true }
);

watch(
  () => userStore.isAuthenticated,
  (isAuth) => {
    if (isAuth && !socket.connected) {
      console.log('🔌 Conectando WS...');
      socket.connect();
      return;
    }

    if (!isAuth && socket.connected) {
      console.log('🔌 Desconectando WS...');
      socket.disconnect();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="safe-area-container flex flex-col min-h-screen raleway bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]"
  >
    <RouterView :key="routeViewKey" />
    <CookieBanner />
    <Toast />
  </div>
</template>

<style>
.safe-area-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  padding-top: constant(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
}
</style>