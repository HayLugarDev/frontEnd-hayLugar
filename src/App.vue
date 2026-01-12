<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';
import Toast from './components/common/Toast.vue';
import CookieBanner from './components/common/CookieBanner.vue';

const userStore = useUserStore();

onMounted(async ()=> userStore.fetchUser());
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