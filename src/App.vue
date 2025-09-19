<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './store/userStore';
import Toast from './components/common/Toast.vue';

const userStore = useUserStore();

onMounted(async ()=> userStore.fetchUser());
</script>

<template>
  <div class="flex flex-col min-h-screen raleway">
    <router-view />
    <Toast />
  </div>
</template>

<style scoped>
</style>
