<template>
    <div class="w-full h-96 rounded-lg">
      <GMapMap
        :center="{ lat: -34.6037, lng: -58.3816 }"
        :zoom="14"
        map-type-id="roadmap"
        class="w-full h-full"
      >
        <GMapMarker v-for="(location, index) in locations" :key="index" :position="location" />
      </GMapMap>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const locations = ref([
    { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    { lat: -34.6118, lng: -58.4173 }, // Otro punto en Buenos Aires
  ]);
  </script>
  