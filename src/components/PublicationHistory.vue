<template>
    <section class="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 class="text-2xl font-bold text-primary mb-4 flex items-center">
        <font-awesome-icon icon="file-alt" class="mr-2" />
        Historial de Publicaciones
      </h2>
      <ul v-if="publications.length" class="divide-y divide-gray-300">
        <li v-for="(pub, index) in publications" :key="index" class="py-4">
          <p class="flex items-center">
            <font-awesome-icon icon="map-marker-alt" class="mr-2 text-primary" />
            <strong>Ubicación:</strong> {{ pub.location }}
          </p>
          <p class="flex items-center">
            <font-awesome-icon icon="calendar-alt" class="mr-2 text-primary" />
            <strong>Fecha de Publicación:</strong> {{ formatDate(pub.created_at) }}
          </p>
        </li>
      </ul>
      <p v-else class="text-gray-500">No tienes publicaciones anteriores.</p>
    </section>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  interface Publication {
    location: string;
    created_at: string;
  }
  
  const props = defineProps<{ publications: Publication[] }>();
  
  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
  };
  </script>
  