<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import MobileMenu from './components/MobileMenu.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen raleway">
    <router-view />
    <span class="mt-auto text-center py-4">
      © 2025 HayLugar. All rights reserved
    </span>
  </div>

  <!-- Menú fijo en la parte inferior -->
  <div class="fixed bottom-0 left-0 w-full z-50">
    <MobileMenu />
  </div>
</template>

<style scoped>
</style>
