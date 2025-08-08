<template>
  <!-- <font-awesome-icon
      icon="fa-angle-left"
      class="z-50 md:hidden block fixed text-4xl lg:bottom-full top-5 right-5 p-3 text-black rounded-full aspect-square bg-trasparents cursor-pointer"
      @click="goBack"
    /> -->
  <button @click="goBack"
    class="z-50 md:hidden block fixed top-2.5 right-5 text-gray-800 border-2 border-gray-300 sm:text-md hover:shadow-lg bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
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