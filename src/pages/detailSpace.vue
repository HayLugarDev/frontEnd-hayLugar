<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Imagen y Detalles -->
    <div class="w-full md:w-2/3 space-y-6">
      <!-- Imagen destacada -->
      <div class="w-full h-64 md:h-80">
        <img
          :src="(espacio?.images && espacio.images.length > 0) ? espacio.images[0] : 'https://source.unsplash.com/800x600/?parking,garage'"
          alt="Espacio"
          class="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
      
      <!-- Información del Espacio -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-primary">{{ espacio?.location }}</h1>
        <p class="text-gray-600 mt-2">{{ espacio?.description }}</p>
        <p class="text-lg text-primary font-semibold mt-4">
          💰 ${{ espacio?.price_per_hour }}/{{ rangoTiempo }}
        </p>
      </div>
      
      <!-- Información del Anfitrión (si existe) -->
      <div v-if="espacio?.host" class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img
          :src="espacio.host.image || 'https://source.unsplash.com/100x100/?person,avatar'"
          alt="Host"
          class="w-16 h-16 rounded-full shadow-md mr-4"
        />
        <div>
          <p class="text-lg font-semibold">Anfitrión: {{ espacio.host.nombre }}</p>
          <p class="text-gray-600">📍 {{ espacio.host.ubicacion }}</p>
        </div>
      </div>
      
      <!-- Botón para Reservar -->
      <button @click="reservar" class="mt-6 w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
        Reservar Ahora
      </button>
    </div>

    <!-- Sección Derecha: Mapa -->
    <div class="w-full md:w-1/3 h-80">
      <GoogleMap
        v-if="espacio"
        api-key="AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E"
        class="w-full h-full rounded-lg"
        :center="{ lat: Number(espacio.latitude), lng: Number(espacio.longitude) }"
        :zoom="15"
      >
        <Marker
          :options="{
            position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
            icon: markerIcon
          }"
        />
      </GoogleMap>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/apiService';
import { GoogleMap, Marker } from 'vue3-google-map';

// Importa los iconos personalizados desde la carpeta assets
import carMarker from '../assets/car-icon.png';
import bicycleMarker from '../assets/bike-icon.png';
import truckMarker from '../assets/truck_marker.png';

const router = useRouter();
const route = useRoute();
const rangoTiempo = ref("hora");
const espacio = ref(null);

const obtenerEspacio = async () => {
  try {
    // Se asume que la ruta contiene el id del espacio: /espacio/:id
    const id = route.params.id;
    const response = await api.get(`/spaces/getbyid/${id}`);
    espacio.value = response.data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};

onMounted(obtenerEspacio);

// Computed para determinar el icono del marcador según el tipo (comparación en minúsculas)
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
      // Verifica si la API de Google Maps está disponible
      if (typeof google !== 'undefined' && google.maps && google.maps.Size) {
        return {
          url: iconUrl,
          scaledSize: new google.maps.Size(40, 40)
        };
      } else {
        // Si no está disponible, retorna solo la URL
        return { url: iconUrl };
      }
    }
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
/* Puedes agregar estilos adicionales aquí si lo requieres */
</style>
