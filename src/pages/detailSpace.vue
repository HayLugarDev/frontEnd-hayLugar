<template>
  <div class="flex flex-col min-h-screen bg-secondary p-6 gap-6">
    <header class="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      <div class="w-full md:w-3/5 h-40 md:h-64">
        <CustomGoogleMap
          v-if="espacio"
          api-key="AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E"
          :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
        >
          <Marker
            :options="{
              position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
              icon: markerIcon
            }"
          />
        </CustomGoogleMap>
      </div>
      <div class="w-full md:w-2/5 h-40 md:h-64 overflow-x-auto flex gap-2 p-2">
        <template v-if="espacio && espacio.images && espacio.images.length">
          <img
            v-for="(img, index) in espacio.images"
            :key="index"
            :src="img"
            alt="Foto del espacio"
            class="h-full object-cover rounded-lg shadow-md"
          />
        </template>
        <template v-else>
          <img
            src="https://source.unsplash.com/400x300/?parking,garage"
            alt="Foto del espacio"
            class="h-full object-cover rounded-lg shadow-md"
          />
        </template>
      </div>
    </header>

    <section class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-primary">{{ espacio?.location }}</h1>
      <p class="text-gray-600 mt-2">{{ espacio?.description }}</p>
      <p class="text-lg text-primary font-semibold mt-4">
        <font-awesome-icon icon="money-bill-wave" class="mr-1" />
        ${{ espacio?.price_per_hour }}/{{ rangoTiempo }}
      </p>
    </section>

    <section v-if="espacio?.host" class="bg-white p-6 rounded-lg shadow-md flex items-center">
      <img
        :src="espacio.host.image || 'https://source.unsplash.com/100x100/?person,avatar'"
        alt="Imagen del anfitrión"
        class="w-16 h-16 rounded-full shadow-md mr-4"
      />
      <div>
        <p class="text-lg font-semibold">Anfitrión: {{ espacio.host.nombre }}</p>
        <p class="text-gray-600">
          <font-awesome-icon icon="map-marker-alt" class="mr-1" />
          {{ espacio.host.ubicacion }}
        </p>
      </div>
    </section>

    <section>
      <button @click="reservar" class="w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
        <font-awesome-icon icon="calendar-check" class="mr-2" />
        Reservar Ahora
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';
import { Marker } from 'vue3-google-map';
import CustomGoogleMap from '../components/GoogleMap.vue';

import carMarker from '../assets/logo.png';
import bicycleMarker from '../assets/logo.png';
import truckMarker from '../assets/logo.png';

const router = useRouter();
const route = useRoute();
const rangoTiempo = ref("hora");
const espacio = ref(null);

const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const response = await api.get(`/spaces/getbyid/${id}`);
    espacio.value = response.data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);

const markerIcon = computed(() => {
  if (espacio.value && espacio.value.type) {
    const tipo = espacio.value.type.toLowerCase();
    let iconUrl = null;
    if (tipo === "auto") {
      iconUrl = carMarker;
    } else if (tipo === "bicicleta") {
      iconUrl = bicycleMarker;
    } else if (tipo === "camioneta") {
      iconUrl = truckMarker;
    }
    return { url: iconUrl, scaledSize: { width: 60, height: 60 } };
  }
  return null;
});

const reservar = () => {
  if (espacio.value) {
    router.push(`/reserva/${espacio.value.id}`);
  }
};
</script>

<style scoped>
</style>