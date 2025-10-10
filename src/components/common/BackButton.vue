<template>
  <button @click="goBack"
    class="md:hidden text-gray-600 sm:text-md hover:shadow-lg py-2 px-4 rounded-full cursor-pointer">
    Atrás
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