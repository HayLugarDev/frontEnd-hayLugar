<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';

const userStore = useUserStore();

onMounted(async ()=> userStore.fetchUser());
</script>

<template>
  <div class="flex flex-col min-h-screen raleway">
    <router-view />
    <span class="hidden md:block mt-auto text-xs text-center py-2">
      © 2025 HayLugar. All rights reserved
    </span>
  </div>
</template>

<style scoped>
</style>
