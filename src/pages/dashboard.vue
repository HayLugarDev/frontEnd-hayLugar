<template>
  <div class="flex flex-col min-h-screen bg-secondary lexend xl:w-11/12 mx-auto">
    <MainHeader />
    <button class="flex flex-row md:hidden items-center justify-center border-spacing-2 shadow-md bg-white p-4 mx-6 rounded-full my-4 gap-2">
      <font-awesome-icon icon="search" class="text-xs" />
      <span class="lexend">Comenzar búsqueda</span>
    </button>
    <div class="hidden md:grid md:grid-cols-11 gap-4 sm:gap-6 items-center justify-center overflow-x-auto px-8 lg:px-4 py-8 sm:py-10 shadow-md border-b-2 bg-primary rounded-md">
      <span
        class="anton-regular col-span-6 sm:col-span-8 sm:col-start-2 text-3xl sm:text-4xl lg:text-4xl text-white">
        <font-awesome-icon icon="map-marker-alt" class="text-5xl text-white" />
        Encontrá tu próximo estacionamiento...
      </span>
      <div class="relative grid grid-cols-6 col-span-10 col-start-2 col-end-11 xl:col-span-6 xl:col-start-3 xl:col-end-10 items-center justify-between rounded-full shadow-xl h-[70px]">
        <div class="bg-white col-span-2 relative flex items-center shadow-sm h-full border-r rounded-l-full">
          <label class="absolute top-2 left-6 px-2 text-sm" for="">Lugar</label>
          <input v-model="searchQuery" @keyup.enter="buscar" type="text" placeholder="Buscar ubicación"
            class="text-gray-500 text-lg border-none w-full h-full rounded-full hover:bg-gray-100 px-8" />
        </div>
        <div class="bg-white col-span-2 relative flex items-center shadow-sm h-full border-r">
          <label class="absolute top-2 left-6 px-2 text-sm" for="">Entrada</label>
          <input v-model="searchQuery" @keyup.enter="buscar" type="text" placeholder="Desde?"
            class="text-gray-500 text-lg border-none w-full h-full rounded-full hover:bg-gray-100 px-8" />
        </div>
        <div class="bg-white col-span-2 relative flex items-center shadow-sm h-full border-none rounded-r-full">
          <label class="absolute top-2 left-6 px-2 text-sm" for="">Salida</label>
          <input v-model="searchQuery" @keyup.enter="buscar" type="text" placeholder="Hasta?"
            class="text-gray-500 text-lg border-none w-full h-full rounded-full hover:bg-gray-100 px-8" />
        </div>
        <div class="absolute p-0.5 h-full right-0.5">
          <button @click="buscar"
            class="z-1 col-span-1 p-4 h-full w-20 text-white hover:bg-primary bg-slate-700 text-xl rounded-full">
            <font-awesome-icon icon="search" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-between items-center shadow-md sm:rounded-xl bg-white h-16 py-2">
      <ZoneNavbar />
      <button
        class="hidden sm:flex sm:flex-row items-center gap-2 p-2 rounded-xl sm:mr-4 hover:bg-gray-100 shadow-md h-full border hover:border-black">
        <font-awesome-icon icon="fa-align-left" class="text-gray-500" />
        <span>Filtrar</span>
      </button>
    </div>
    <!-- <div class="flex justify-end p-4">
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
    </div> -->

    <div ref="refSeccionResultados" class="flex flex-1 p-2 sm:p-6">
      <div v-if="!showMap" class="relative flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-2">
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
        <CustomGoogleMap class="w-full h-full rounded-lg overflow-hidden shadow-md" :center="center" :zoom="zoom"
          :options="mapOptions">
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
    <!-- <div class="fixed bottom-6 right-6 flex items-center space-x-3">
      <FloatingButton @click="verifyToken('/add-space')" :text="'Publicar espacio'" :color="'text-secondary'"
        background='bg-primary' />
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '../store/userStore';
import { Marker, InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import logoMarker from '../assets/logo.png';
import CustomGoogleMap from '../components/GoogleMap.vue';
import ZoneNavbar from "../components/ZoneNavbar.vue";
import loadIcon from "../assets/load-icon_primary.svg";
import SpaceCard from '../components/SpaceCard.vue';
import { getAllSpaces } from '../services/spaceService';
import MainHeader from '../components/MainHeader.vue';

const router = useRouter();
const userStore = useUserStore();
const markerIcon = logoMarker;


const getMarkerOptions = (espacio) => ({
  position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
  icon: { url: markerIcon, scaledSize: { width: 40, height: 40 } }
});


const searchQuery = ref("");
const refSeccionResultados = ref(HTMLElement);
console.log("Tipo de ref:", typeof refSeccionResultados);
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

const obtenerEspacios = async () => {
  try {
    const spaces = await getAllSpaces();
    if (!spaces || spaces.length < 1) {
      return 'No hay espacios todavía';
    }
    espacios.value = spaces;
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
  console.log('Usuario en el store:', userStore.user);
  console.log('Authenticado: ', userStore.isAuthenticated);
});

const buscar = async () => {
  await obtenerEspacios();
  const search = espacios.value.filter(espacio =>
    espacio.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    espacio.location.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log(search);
  espacios.value = search;
  await nextTick();
  if (refSeccionResultados.value && searchQuery.value) {
    refSeccionResultados.value.scrollIntoView({ behavior: 'smooth' });
  }
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

.anton-regular {
  font-family: "Anton", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.lexend {
  font-family: "Lexend Deca", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

</style>
