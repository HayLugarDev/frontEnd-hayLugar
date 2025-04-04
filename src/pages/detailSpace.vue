<template>
  <div class="flex flex-col min-h-screen bg-secondary p-6 gap-6">
    <header class="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden p-6">
      <div class="flex items-center space-x-4">
        <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="w-40" />
      </div>
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-primary">{{ espacio?.name }}</h1>
        <p class="text-gray-600 mt-2">{{ espacio?.location }}</p>
        <p class="text-lg text-primary font-semibold mt-4">
          <font-awesome-icon icon="money-bill-wave" class="mr-1" />
          ${{ espacio?.price_per_hour }}/{{ rangoTiempo }}
        </p>
        <br />
        <section class="flex justify-left">
          <button @click="reservar"
            class="bg-accent text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-xl transition-all">
            <font-awesome-icon icon="calendar-check" class="mr-2" />
            Reservar Ahora
          </button>
        </section>
      </div>

      <div class="w-80 h-90 flex justify-center items-center">
        <CustomGoogleMap v-if="espacio" :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
          class="w-full h-full rounded-lg overflow-hidden shadow-md">
          <Marker :options="{
            position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
            icon: markerIcon
          }" />
        </CustomGoogleMap>
      </div>
    </header>

    <section class="bg-white p-6 rounded-lg shadow-md flex gap-4 overflow-x-auto">
      <div class="flex flex-col">
        <div class="flex flex-row gap-2">
          <template v-if="espacio && espacio.images">
            <img v-for="(img, index) in espacio.images" :key="index" :src="`http://localhost:3000${img}`" alt="Foto del espacio"
              class="h-60 w-60 object-cover rounded-lg shadow-md border" />
          </template>
          <template v-else>
            <img src="https://source.unsplash.com/400x300/?parking,garage" alt="Foto del espacio"
              class="h-48 object-cover rounded-lg shadow-md" />
          </template>
        </div>
        <span class="mt-4 font-semibold">Descripción: </span>
        <p class="text-gray-600 w-auto font-medium">{{ espacio?.description }}</p>
      </div>
    </section>

    <section v-if="espacio?.host" class="bg-white p-6 rounded-lg shadow-md flex items-center">
      <img :src="espacio.host.image || 'https://source.unsplash.com/100x100/?person,avatar'" alt="Imagen del anfitrión"
        class="w-16 h-16 rounded-full shadow-md mr-4" />
      <div>
        <p class="text-lg font-semibold">Anfitrión: {{ espacio.host.nombre }}</p>
        <p class="text-gray-600">
          <font-awesome-icon icon="map-marker-alt" class="mr-1" />
          {{ espacio.host.ubicacion }}
        </p>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Marker } from 'vue3-google-map';
import CustomGoogleMap from '../components/GoogleMap.vue';

import carMarker from '../assets/logo.png';
import bicycleMarker from '../assets/logo.png';
import truckMarker from '../assets/logo.png';
import { getSpaceById } from '../services/spaceService';

const router = useRouter();
const route = useRoute();
const rangoTiempo = ref("hora");
const espacio = ref(null);

const obtenerEspacio = async () => {
  try {
    const id = route.params.id;
    const space = await getSpaceById(id);
    return espacio.value = space;
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
    return { url: iconUrl, scaledSize: { width: 40, height: 40 } };
  }
  return null;
});

const reservar = () => {
  if (espacio.value) {
    router.push(`/reserva/${espacio.value.id}`);
  }
};
</script>

<style scoped></style>
