<template>
    <font-awesome-icon
      icon="fa-angle-left"
      class="z-50 md:hidden block fixed text-2xl lg:bottom-full top-5 right-5 p-3 text-primary rounded-full aspect-square bg-white cursor-pointer border-2"
      @click="goBack"
    />
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
  