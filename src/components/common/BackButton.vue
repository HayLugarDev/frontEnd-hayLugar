<template>
  <button @click="goBack"
    class="md:hidden text-gray-400 sm:text-md py-2 px-4 rounded-full cursor-pointer">
    Regresar
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/dashboard');
  }
};
</script>