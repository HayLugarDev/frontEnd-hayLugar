<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from './components/common/Toast.vue'
import CookieBanner from './components/common/CookieBanner.vue'
</script>

<template>
  <div
    class="safe-area-container flex min-h-screen flex-col raleway bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]"
  >
    <RouterView />
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