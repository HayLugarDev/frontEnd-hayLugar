<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';
import Toast from './components/common/Toast.vue';
import CookieBanner from './components/common/ConsentBanner.vue';
import { getSocket } from './services/socketClient';

const userStore = useUserStore();

onMounted(async ()=> userStore.fetchUser());

watch(
  () => userStore.isAuthenticated,
  (isAuth) => {
    const socket = getSocket();

    if (isAuth && !socket.connected) {
      console.log('🔌 Conectando WS...');
      socket.connect();
      
      socket.on("connect", () => {
        console.log("🟢 WS conectado")});
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
  <div class="safe-area-container flex flex-col min-h-screen raleway bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]">

    <router-view :key="$route.fullPath" />
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

  /* fallback para algunos navegadores */
  padding-top: constant(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
}
</style>