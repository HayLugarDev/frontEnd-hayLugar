<template>
  <div class="min-h-screen bg-secondary p-6">
    <!-- Barra de búsqueda con filtros avanzados -->
    <header class="bg-white shadow-md p-6 flex flex-col md:flex-row justify-between items-center rounded-b-lg">
      <div class="flex items-center space-x-4">
        <img src="/src/assets/logo.jpeg" alt="HayLugAR Logo" class="w-28" />
      </div>
      <div class="flex flex-col md:flex-row items-center w-full md:w-auto bg-gray-100 p-3 rounded-full shadow-md">
        <div class="flex items-center space-x-2">
          <font-awesome-icon icon="map-marker-alt" class="text-xl text-primary" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar ubicación"
            class="flex-1 outline-none px-4 py-2 bg-white rounded-full text-textPrimary shadow-sm"
          />
        </div>
        <input v-model="checkIn" type="date" class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <input v-model="checkOut" type="date" class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <select v-model="rangoTiempo" class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm">
          <option value="hora">Por Hora</option>
          <option value="dia">Por Día</option>
          <option value="semana">Por Semana</option>
          <option value="mes">Por Mes</option>
        </select>
        <button @click="buscar" class="bg-primary text-white p-3 rounded-full ml-2 shadow-md hover:scale-105 transition-all">
          <font-awesome-icon icon="search" />
        </button>
      </div>
      <div class="flex items-center space-x-4 mt-2 md:mt-0">
        <router-link to="/profile" class="text-textPrimary hover:text-primary font-medium">
          <font-awesome-icon icon="user" class="mr-1" /> Mi Perfil
        </router-link>
        <router-link to="/settings" class="text-textPrimary hover:text-primary font-medium">
          <font-awesome-icon icon="cog" class="mr-1" /> Configuración
        </router-link>
      </div>
    </header>
    
    <!-- Categorías de búsqueda -->
    <div class="flex overflow-x-auto p-4 bg-white shadow-md rounded-lg mt-4 space-x-4">
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="city" class="mr-2" /> Centro
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="leaf" class="mr-2" /> Zonas verdes
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="umbrella-beach" class="mr-2" /> Cerca del río
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="car" class="mr-2" /> Garages privados
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="motorcycle" class="mr-2" /> Motos
      </button>
    </div>
    
    <!-- Contenedor de contenido principal -->
    <div class="flex flex-1 p-6">
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="cargando" class="text-center text-gray-500 w-full">Cargando espacios...</div>
        <div v-if="error" class="text-center text-red-500 w-full">{{ error }}</div>
        <div
          v-for="(espacio, index) in espacios"
          :key="index"
          class="bg-white p-5 shadow-lg rounded-xl hover:shadow-xl transition-all"
        >
          <p class="text-lg font-bold mt-3">
            <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{ espacio.name }}
          </p>
          <img
            :src="espacio.images || 'https://source.unsplash.com/400x300/?parking,garage'"
            alt="Espacio"
            class="w-full h-44 object-cover rounded-lg"
          />
          <p class="text-lg font-bold mt-3">
            <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{ espacio.location }}
          </p>
          <p class="text-primary font-semibold">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
          </p>
          <router-link :to="`/espacio/${espacio.id}`">
            <button class="mt-3 bg-primary text-white px-4 py-3 rounded-lg w-full hover:shadow-md transition-all">
              <font-awesome-icon icon="calendar-check" class="mr-1" /> Reservar
            </button>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Botón para Agregar Espacio -->
    <div class="fixed bottom-6 right-6 flex items-center space-x-3">
      <router-link to="/add-space">
        <button class="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center space-x-2">
          <font-awesome-icon icon="plus" class="text-lg" />
          <span class="hidden md:block">Publicar Espacio</span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/apiService';

const searchQuery = ref("");
const checkIn = ref("");
const checkOut = ref("");
const rangoTiempo = ref("hora");
const espacios = ref<any[]>([]);
const cargando = ref(true);
const error = ref<string | null>(null);

// Función para obtener la ubicación actual del usuario
const obtenerUbicacionActual = (): Promise<{ lat: number, lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocalización no soportada."));
    }
  });
};

// Función para cargar publicaciones cercanas desde el backend
const cargarPublicacionesCercanas = async () => {
  try {
    const { lat, lng } = await obtenerUbicacionActual();
    // Puedes definir un radio por defecto, por ejemplo 10 km.
    const response = await api.get(`/spaces/getSpacesNearby?lat=${lat}&lng=${lng}&radius=10`);
    espacios.value = response.data;
    cargando.value = false;
  } catch (err: any) {
    console.error(err);
    error.value = "No se pudieron cargar los espacios cercanos.";
    cargando.value = false;
  }
};

onMounted(() => {
  // Puedes llamar a la función de ubicacion para filtrar espacios cercanos
  cargarPublicacionesCercanas();
});

const buscar = () => {
  // Si se requiere búsqueda manual, aquí podrías integrar lógica adicional.
  console.log("Buscar:", searchQuery.value);
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si lo requieres */
</style>
