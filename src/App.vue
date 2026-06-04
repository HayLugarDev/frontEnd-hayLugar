<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';
import Toast from './components/common/Toast.vue';
import CookieBanner from './components/common/CookieBanner.vue';
import { getSocket } from './services/socket';

const route = useRoute();
const userStore = useUserStore();

const socket = getSocket();

/**
 * Rutas públicas donde NO hace falta consultar usuario.
 * Agregá acá tu landing, términos, privacidad, etc.
 */
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

/**
 * Evita que el router-view remonte todo por cambios mínimos.
 * Si no necesitás forzar remount, podés directamente quitar el :key.
 */
const routeViewKey = computed(() => {
  return route.name ? String(route.name) : route.path;
});

onMounted(async () => {
  /**
   * Registramos listeners del socket una sola vez.
   */
  socket.off('connect');
  socket.on('connect', () => {
    console.log('🟢 WS conectado');
  });

  socket.off('disconnect');
  socket.on('disconnect', () => {
    console.log('🔴 WS desconectado');
  });

  /**
   * Si estoy en landing pública, no consulto backend.
   */
  if (isPublicRoute.value) {
    return;
  }

  /**
   * Idealmente el store debería tener una bandera tipo:
   * userStore.hasFetchedUser
   * userStore.isUserLoaded
   * userStore.initialized
   */
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