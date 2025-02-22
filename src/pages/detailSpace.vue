<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-secondary p-6 gap-6">
    <!-- Sección Izquierda: Imagen y Detalles -->
    <div class="w-full md:w-2/3 space-y-6">
      <!-- Imagen destacada -->
      <div class="w-full h-64 md:h-80">
        <img :src="espacio.image" alt="Espacio" class="w-full h-full object-cover rounded-lg shadow-md" />
      </div>
      
      <!-- Información del Espacio -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-primary">{{ espacio.ubicacion }}</h1>
        <p class="text-gray-600 mt-2">{{ espacio.descripcion }}</p>
        <p class="text-lg text-primary font-semibold mt-4">💰 ${{ espacio.precio }}/{{ rangoTiempo }}</p>
      </div>
      
      <!-- Información del Anfitrión -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img :src="espacio.host.image" alt="Host" class="w-16 h-16 rounded-full shadow-md mr-4" />
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
    <div class="w-full md:w-1/3 h-80 md:h-full">
      <GoogleMap
      api-key="AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E"
      class="w-full h-full rounded-lg"
      :zoom="15"
    >
        <Marker :options="{ position: { lat: espacio.lat, lng: espacio.lng } }" />
        
      </GoogleMap>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';

const router = useRouter();
const rangoTiempo = ref("hora");

const espacio = ref({
  id: 1,
  ubicacion: "Calle 123, San Miguel de Tucumán",
  descripcion: "Amplio estacionamiento con seguridad las 24 horas.",
  precio: 500,
  lat: -26.8325,
  lng: -65.2042,
  image: "https://source.unsplash.com/800x600/?parking,garage",
  host: {
    nombre: "Juan Pérez",
    ubicacion: "San Miguel de Tucumán",
    image: "https://source.unsplash.com/100x100/?person,avatar"
  }
});

const reservar = () => {
  router.push("/reserva");
};
</script>