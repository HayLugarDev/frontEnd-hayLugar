<template>
    <font-awesome-icon
      icon="fa-angle-left"
      class="z-50 fixed text-3xl lg:bottom-full top-5 right-5 p-2 text-primary rounded-full aspect-square bg-secondary shadow-xl cursor-pointer border"
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
  