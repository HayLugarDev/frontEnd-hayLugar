<template>
  <div class="flex flex-col min-h-screen bg-secondary">

    <header
      class="relative backdrop:bg-white shadow-md p-6 grid grid-cols-5 gap-4 lg:flex lg:flex-row justify-around items-center rounded-b-lg">
      <Logo />
      <div v-if="userMenu"
        class="absolute top-24 right-0 max-w-52 rounded-xl bg-secondary shadow-md flex flex-col items-start w-full px-2">
        <MenuUserButton 
          :route="'/profile'" 
          :text="'Mi Perfil'" 
          :usedIcon="'user'" 
        />
        <MenuUserButton 
          :route="'/settings'" 
          :text="'Configuracion'" 
          :usedIcon="'cog'"
        />
        <LogoutButton 
          :action="verifyToken" 
          :route="'/quit'" 
          :usedIcon="'fa-sign-out'"
        />
      </div>
      <div v-if="authChecked" class="col-start-5 lg:order-3 space-x-4 mt-2 md:mt-0 ml-2 xl:ml-0 xl:gap-2 flex justify-end">
        <button @click="openMenu" class="text-primary font-medium">
          <div v-if="isAuthenticated && userStore.user"
            class="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-indigo-950 rounded-full">
            {{ userStore.user.name.charAt(0) }}{{ userStore.user.last_name ? userStore.user.last_name.charAt(0) : '' }}
          </div>
          <div v-else class="flex flex-row gap-2 items-center">
            <GlobalButton 
              :route="'/login'" 
              :text="'Ingresar'" 
              :color="'text-primary'" 
              background="bg-secondary" 
            />
            <GlobalButton 
              :route="'register'" 
              :text="'Registrarse'" 
              :color="'text-secondary'" 
              background="bg-primary" 
            />
          </div>
        </button>
      </div>
      <div
        class="col-span-5 justify-center flex flex-col md:flex-row items-center md:w-auto bg-gray-100 p-3 rounded-full shadow-md">
        <div class="flex items-center">
          <font-awesome-icon icon="map-marker-alt" class="text-xl text-primary" />
          <input v-model="searchQuery" type="text" placeholder="Buscar ubicación"
            class="flex-1 outline-none px-4 py-2 bg-white rounded-full text-textPrimary shadow-sm" />
        </div>
        <input v-model="checkIn" type="date"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <input v-model="checkOut" type="date"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm" />
        <select v-model="rangoTiempo"
          class="outline-none px-4 py-2 bg-white border-l md:border-none rounded-md shadow-sm">
          <option value="hora">Por Hora</option>
          <option value="dia">Por Día</option>
          <option value="semana">Por Semana</option>
          <option value="mes">Por Mes</option>
        </select>
        <button @click="buscar"
          class="bg-primary text-white p-2 xl:p-3 rounded-full ml-2 shadow-md hover:scale-105 transition-all">
          <font-awesome-icon icon="search" />
        </button>
      </div>
    </header>
    <ZoneNavbar />
    <div class="flex justify-end p-4">
      <label class="flex items-center cursor-pointer">
        <span class="mr-2">Vista de Mapa</span>
        <input type="checkbox" v-model="showMap" class="hidden" />
        <div class="w-12 h-6 bg-primary rounded-full relative">
          <div :class="{
            'translate-x-6': showMap,
            'translate-x-0': !showMap
          }" class="absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300">
          </div>
        </div>
      </label>
    </div>

    <div class="flex flex-1 p-2 sm:p-6">
      <div v-if="!showMap" class="relative flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <div v-if="cargando" class="absolute top-1/4 flex justify-center items-center marker:text-center w-full">
          <img :src="loadIcon" alt="" class="max-w-10">
        </div>
        <div v-if="error" class="absolute top-1/4 flex justify-center items-center text-center text-red-500 w-full">{{
          error }}</div>
        <div v-for="(espacio, index) in espacios" :key="index">
          <SpaceCard :espacio="espacio" />
        </div>
      </div>
      <div v-else class="flex-1">
        <CustomGoogleMap class="w-full h-full rounded-lg overflow-hidden shadow-md"
          :center="center" 
          :zoom="zoom" 
          :options="mapOptions"
        >
          <Marker v-for="(espacio, index) in espacios" :key="index" :options="getMarkerOptions(espacio)"
            @mouseover="() => handleMouseOver(espacio)" @mouseout="handleMouseOut"
            @click="() => handleMarkerClick(espacio)" />
          <InfoWindow v-if="hoveredSpace" :position="{
            lat: Number(hoveredSpace.latitude),
            lng: Number(hoveredSpace.longitude)
          }" @closeclick="handleMouseOut">
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
      <FloatingButton 
        @click="verifyToken('/add-space')" 
        :text="'Publicar espacio'" 
        :color="'text-secondary'" 
        background='bg-primary' 
      />
    </div>
    <SessionExpired :sessionExpired="activedSession" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/apiService';
import { useUserStore } from '../store/userStore';
import { Marker, InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import logoMarker from '../assets/logo.png';
import CustomGoogleMap from '../components/GoogleMap.vue';
import SessionExpired from '../components/SessionExpired.vue';
import MenuUserButton from '../components/MenuUserButton.vue';
import LogoutButton from '../components/LogoutButton.vue';
import ZoneNavbar from "../components/ZoneNavbar.vue";
import Logo from '../components/Logo.vue';
import { verifyActiveSession } from '../middleware/verifyToken';
import loadIcon from "../assets/load-icon_primary.svg";
import GlobalButton from '../components/GlobalButton.vue';
import SpaceCard from '../components/SpaceCard.vue';
import FloatingButton from '../components/FloatingButton.vue';

const router = useRouter();
const userStore = useUserStore();
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
const activedSession = ref(false);
const userMenu = ref(false);
const authChecked = ref(false);

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

const obtenerEspacios = async () => {
  try {
    const response = await api.get("/spaces/getAll");
    if (response.data.length < 1) {
      cargando.value = false;
      error.value = "No hay espacios todavía"
      return;
    }
    const data = response.data.map(e => {
      if (typeof e.dataValues.images === 'string') {
        try {
          e.dataValues.images = JSON.parse(e.dataValues.images);
        } catch (error) {
          console.error('Error al parsear images:', error);
          e.dataValues.images = [];
        }
      }
      return e.dataValues;
    });
    espacios.value = data;
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
  authChecked.value = true;
  console.log('Usuario en el store:', userStore.user);
  console.log('Authenticado: ', userStore.isAuthenticated);
});

const isAuthenticated = computed(() => {
  return !!userStore.token;
});

const verifyToken = async (route) => {
  const result = await verifyActiveSession(route, userStore.sessionExpired);
  if (!result) {
    userStore.clearUser();
    activedSession.value = true;
    return;
  }
  if (userStore.isAuthenticated) {
    if(route === '/quit') {
      userStore.clearUser();
      authChecked.value=false;
      window.location.href = '/dashboard';
      return;
    }
    activedSession.value = !userStore.isAuthenticated;
    return router.push(route);
  } else {
    return activedSession.value = !userStore.isAuthenticated;
  }
}

const openMenu = () => {
  userMenu.value = !userMenu.value;
}

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
