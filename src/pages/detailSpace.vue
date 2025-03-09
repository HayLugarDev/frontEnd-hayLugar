<template>
  <div class="flex flex-col min-h-screen bg-secondary p-6 gap-6">
    <!-- Cabecera: Mapa a la izquierda, Fotos a la derecha -->
    <header class="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mapa Personalizado (60% ancho en desktop) -->
      <div class="w-full md:w-3/5 h-64 md:h-80">
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
      <!-- Galería de Fotos (40% ancho en desktop) -->
      <div class="w-full md:w-2/5 h-64 md:h-80 overflow-x-auto flex gap-2 p-2">
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

    <!-- Detalles del Espacio -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-primary">{{ espacio?.location }}</h1>
      <p class="text-gray-600 mt-2">{{ espacio?.description }}</p>
      <p class="text-lg text-primary font-semibold mt-4">
        <font-awesome-icon icon="money-bill-wave" class="mr-1" />
        ${{ espacio?.price_per_hour }}/{{ rangoTiempo }}
      </p>
    </section>

    <!-- Información del Anfitrión -->
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

    <!-- Botón para Reservar -->
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


import carMarker from '../assets/car-icon.png';
import bicycleMarker from '../assets/bike-icon.png';
import truckMarker from '../assets/truck_marker.png';

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
    if (iconUrl) {
   
      if (typeof google !== 'undefined' && google.maps && google.maps.Size) {
        return {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 30)
        };
      } else {
        return { url: iconUrl };
      }
    }
  }
  return null;
});


const customMapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "all",
      stylers: [
        { saturation: -20 },
        { gamma: 0.8 }
      ]
    }
  ],
  disableDefaultUI: false,
  zoomControl: true,
};

const reservar = () => {
  if (espacio.value) {
    router.push(`/reserva/${espacio.value.id}`);
  }
};
</script>

<style scoped>

</style>
