<template>
  <div class="flex flex-col min-h-screen bg-secondary">

    <header class="bg-white shadow-md p-6 flex flex-col md:flex-row justify-between items-center rounded-b-lg">
      <div class="flex items-center space-x-4">
        <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="w-40" />
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
          <font-awesome-icon icon="user" class="mr-1" />
          <span v-if="userStore.user">Bienvenido, {{ userStore.user.name }}</span>
          <span v-else>Mi Perfil</span>
        </router-link>
        <router-link to="/settings" class="text-textPrimary hover:text-primary font-medium">
          <font-awesome-icon icon="cog" class="mr-1" /> Configuración
        </router-link>
      </div>
    </header>


    <div class="flex overflow-x-auto p-4 bg-white shadow-md rounded-lg mt-4 space-x-4">
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="city" class="mr-2" /> Centro
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="leaf" class="mr-2" /> Zonas verdes
      </button>
      <!-- <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="umbrella-beach" class="mr-2" /> Cerca del río
      </button> -->
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="car" class="mr-2" /> Garages privados
      </button>
      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon icon="motorcycle" class="mr-2" /> Motos
      </button>
    </div>

    
    <div class="flex justify-end p-4">
      <label class="flex items-center cursor-pointer">
        <span class="mr-2">Vista de Mapa</span>
        <input type="checkbox" v-model="showMap" class="hidden" />
        <div class="w-12 h-6 bg-primary rounded-full relative">
          <div
            :class="{
              'translate-x-6': showMap,
              'translate-x-0': !showMap
            }"
            class="absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300"
          ></div>
        </div>
      </label>
    </div>

    <!-- Contenedor de contenido principal -->
    <div class="flex flex-1 p-6">
      <!-- Vista de Cards -->
      <div v-if="!showMap" class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-if="cargando" class="text-center text-gray-500 w-full">Cargando espacios...</div>
        <div v-if="error" class="text-center text-red-500 w-full">{{ error }}</div>
        <div
          v-for="(espacio, index) in espacios"
          :key="index"
          class="bg-white p-10 shadow-lg rounded-xl hover:shadow-xl transition-all"
        >
          <p class="text-2xl font-bold text-primary">
            <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="w-20" /> {{ espacio.name }}
          </p>
          <img
            :src="espacio.images.length ? espacio.images[0] : 'https://source.unsplash.com/400x300/?parking,garage'"
            alt="Espacio"
            class="w-full h-40 object-cover rounded-lg"
          />
          <p class="text-lg font-bold mt-3">
            <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{ espacio.location }}
          </p>
          <p class="text-primary font-semibold">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
          </p>
          <router-link :to="`/espacio/${espacio.id}`">
            <button class="mt-3 bg-accent text-black px-6 py-3 rounded-lg w-full hover:shadow-md font-bold shadow-md transition-all">
              <font-awesome-icon icon="calendar-check" class="mr-1" /> Reservar
            </button>
          </router-link>
        </div>
      </div>
      <div v-else class="flex-1">
        <CustomGoogleMap
          :center="center"
          :zoom="zoom"
          :options="mapOptions"
          class="w-full h-full rounded-lg overflow-hidden shadow-md"
        >
          <Marker
            v-for="(espacio, index) in espacios"
            :key="index"
            :options="getMarkerOptions(espacio)"
            @mouseover="() => handleMouseOver(espacio)"
            @mouseout="handleMouseOut"
            @click="() => handleMarkerClick(espacio)"
          />
          <InfoWindow
            v-if="hoveredSpace"
            :position="{
              lat: Number(hoveredSpace.latitude),
              lng: Number(hoveredSpace.longitude)
            }"
            @closeclick="handleMouseOut"
          >
            <div class="p-2">
              <h3 class="text-lg font-bold">{{ hoveredSpace.name }}</h3>
              <p class="text-sm">{{ hoveredSpace.location }}</p>
              <p class="text-sm text-primary">${{ hoveredSpace.price_per_hour }}/hora</p>
            </div>
          </InfoWindow>
        </CustomGoogleMap>
      </div>
    </div>
    <div class="fixed bottom-6 right-6 flex items-center space-x-3">
      <router-link to="/add-space">
        <button class="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center space-x-2">
          <font-awesome-icon icon="plus" class="text-lg" />
          <span class="hidden md:block">Publicar Espacio</span>
        </button>
      </router-link>
    </div>
    <transition name="fade">
      <div
        v-if="userStore.sessionExpired"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all scale-95">
          <div class="flex flex-col items-center">
            <img src="/src/assets/logo.jpeg" alt="Logo" class="w-20 h-20 mb-4" />
            <h2 class="text-3xl font-bold text-primary mb-2">Sesión Expirada</h2>
            <p class="text-lg text-gray-700 text-center mb-6">
              Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </p>
            <button
              @click="handleSessionExpired"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/apiService';
import { useUserStore } from '../store/userStore';
import { Marker, InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import logoMarker from '../assets/logo.png';
import CustomGoogleMap from '../components/GoogleMap.vue';

const router = useRouter();


const markerIcon = logoMarker;


const getMarkerOptions = (espacio) => ({
  position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
  icon: { url: markerIcon, scaledSize: { width: 40, height: 40 } }
});


const searchQuery = ref("");
const checkIn = ref("");
const checkOut = ref("");
const rangoTiempo = ref("hora");


const espacios = ref([]);
const cargando = ref(true);
const error = ref(null);


const showMap = ref(false);


const hoveredSpace = ref(null);


const center = ref({ lat: -26.8333, lng: -65.2167 });
const zoom = ref(15);
const mapOptions = ref({
  styles: [
    { featureType: "all", elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
    { featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{ color: "#dcd2be" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e90" }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#93817c" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#a5b076" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#447530" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fdfcf8" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8c967" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9bc62" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#e98d58" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#db8555" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
});


const userStore = useUserStore();
const handleSessionExpired = () => {
  userStore.setSessionExpired(false);
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
};

const obtenerEspacios = async () => {
  try {
    const response = await api.get("/spaces/getAll");
    espacios.value = response.data.map(e => e.dataValues);
    cargando.value = false;
  } catch (err) {
    error.value = "No se pudieron cargar los espacios.";
    cargando.value = false;
  }
};

onMounted(async () => {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(position)
      },
      (err) => {
        console.error("Error al obtener geolocalización:", err);
      }
    );
  }
  await obtenerEspacios();
  await userStore.fetchUser();
});

const buscar = () => {
  console.log("Buscar:", searchQuery.value);
};


const handleMouseOver = (espacio) => {
  console.log("MouseOver en espacio:", espacio);
  hoveredSpace.value = espacio;
};

const handleMouseOut = () => {
  hoveredSpace.value = null;
};

const handleMarkerClick = (espacio) => {
  router.push(`/espacio/${espacio.id}`);
};
</script>

<style scoped>

.gm-style-iw {
  z-index: 9999 !important;
}
</style>
