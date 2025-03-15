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
            <strong>Ubicación:</strong> {{ pub.dataValues.location }}
          </p>
          <p class="flex items-center">
            <font-awesome-icon icon="calendar-alt" class="mr-2 text-primary" />
            <strong>Fecha de Publicación:</strong> {{ formatDate(pub.dataValues.created_at) }}
          </p>
        </li>
      </ul>
      <p v-else class="text-gray-500">No tienes publicaciones anteriores.</p>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../store/userStore';
  import api from '../services/apiService';
  
  interface Publication {
    dataValues: {
      location: string;
      created_at: string;
    }
  }

  const publications = ref<Publication[]>([]);
  const userStore = useUserStore();
  
  const fetchReservations = async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    console.error("No se encontró el ID de usuario en userStore");
    return;
  }
  try {
    const response = await api.get(`spaces/myspaces`);
    console.log(response);
    publications.value = response.data;
  } catch (error) {
    console.error("Error al obtener historial de publicaciones", error);
  }
};

onMounted(() => {
  fetchReservations();
});

  
  const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleString();
  };
  </script>
  