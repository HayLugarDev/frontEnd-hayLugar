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
  <div class="flex flex-col min-h-screen raleway bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]">
    <router-view />
    <CookieBanner />
    <Toast />
  </div>
</template>

<style scoped>
</style>
