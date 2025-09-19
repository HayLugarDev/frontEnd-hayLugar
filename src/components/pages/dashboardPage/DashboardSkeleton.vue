<template>
  <div class="flex flex-col h-full bg-secondary animate-pulse text-transparent">
    <!-- Simulación del MainHeader en modo skeleton -->
    <div
      class="hidden md:flex justify-between items-center border-b-2 px-4 pt-2 xl:px-10 xl:mx-16 h-20 bg-gray-300 rounded mb-4 animate-pulse">
      <!-- Logo placeholder -->
      <div class="w-16 h-10 bg-gray-400 rounded"></div>

      <!-- Botones de usuario placeholder -->
      <div class="flex gap-4 items-center">
        <div class="w-24 h-10 bg-gray-400 rounded-full"></div>
        <div class="w-10 h-10 bg-gray-400 rounded-full"></div>
      </div>
    </div>


    <!-- Floating button -->
    <div class="fixed right-1/2 bottom-4 w-24 h-16 bg-gray-300 rounded-full"></div>

    <!-- Botón móvil de búsqueda -->
    <div class="flex md:hidden items-center justify-center bg-gray-300 mx-6 rounded-full my-4 h-12"></div>

    <!-- Zona de búsqueda -->
    <div class="hidden md:grid grid-cols-11 gap-2 px-8 py-4 bg-gray-300 rounded-md mb-4 h-20"></div>

    <!-- Cards o mapa -->
    <div class="flex flex-1 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 w-full">
        <SkeletonSpaceCard v-for="n in 14" :key="'skeleton-' + n" />
      </div>
    </div>


    <!-- Header móvil en skeleton -->
    <div class="flex md:hidden justify-between items-center px-4 pt-2 h-16 bg-gray-300 rounded mb-4 animate-pulse">
      <div class="w-24 h-8 bg-gray-400 rounded"></div> <!-- Logo -->
      <div class="w-10 h-10 bg-gray-400 rounded-full"></div> <!-- Menú hamburguesa -->
    </div>
  </div>
</template>

<script setup>
import SkeletonSpaceCard from './SkeletonSpaceCard.vue';
</script>
