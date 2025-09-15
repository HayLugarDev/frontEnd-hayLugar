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
  </div>
</template>

<style scoped>
</style>
