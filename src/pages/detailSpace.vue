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
      <button @click="reservar(espacio)"
        class="mt-6 w-full bg-accent text-white p-4 rounded-lg text-lg font-bold shadow-md">
        Reservar Ahora
      </button>
    </div>

    <!-- Sección Derecha: Mapa -->
    <div class="w-full md:w-1/3 h-80 md:h-full">
      <GoogleMap api-key="AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E" class="w-full h-full rounded-lg" :zoom="15">
        <Marker :options="{ position: { lat: espacio.lat, lng: espacio.lng } }" />

      </GoogleMap>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/apiService';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';

const route = useRoute();
const router = useRouter();
const spaceId = route.params.id;
const rangoTiempo = ref("hora");
const espacio = ref(null);

const obtenerEspacio = async () => {
  try {
    const response = await api.get(`/spaces/getbyid/${spaceId}`);

    const spaceData = {
      id: response.data.id,
      ubicacion: response.data.location,
      descripcion: response.data.description,
      precio: response.data.price_per_hour,
      lat: parseFloat(response.data.latitude),
      lng: parseFloat(response.data.longitude),
      image: "https://www.arqhys.com/wp-content/uploads/2012/12/Diseno-de-estacionamientos-4.jpg",
      host: {
        nombre: "Juan Pérez",
        ubicacion: "San Miguel de Tucumán",
        image: "https://www.arqhys.com/wp-content/uploads/2012/12/Diseno-de-estacionamientos-4.jpg"
      }
    };
    console.log(response);
    espacio.value = spaceData;
  } catch (err) {
    console.error('Error: ', err);
  }
};

obtenerEspacio();

const reservar = (espacio) => {
  router.push({
    path: `/reserva/${espacio.id}`,
    query: { location: espacio.ubicacion,
      description: espacio.descripcion,
      price_per_hour: espacio.precio,
      image: espacio.image
     }
  });
};
</script>