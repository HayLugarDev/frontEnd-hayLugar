<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-screen raleway">
    <router-view />
    <span class="mt-auto text-center py-4">
      © 2025 HayLugar. All rights reserved
    </span>
  </div>
</template>

<style scoped>
</style>
