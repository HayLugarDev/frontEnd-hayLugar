<template>
  <div>
    <DashboardSkeleton v-if="cargando" />
    <div v-else class="flex flex-col h-full bg-secondary">
      <MainHeader />
      <FloatingButton :text="buttonText" color="white" background="primary" @toggle="toggleMap" />
      <button
        class="flex flex-row md:hidden items-center justify-center border-spacing-2 shadow-md bg-white p-4 mx-6 rounded-full my-4 gap-2">
        <font-awesome-icon icon="search" class="text-xs" />
        <span>Comenzar búsqueda</span>
      </button>
      <div
        class="hidden md:grid md:grid-cols-11 gap-2 sm:gap-4 items-center justify-center overflow-visible px-8 lg:px-2 py-2 sm:py-4 shadow-md border-b-2 bg-primary rounded-md">
        <span class="anton-regular col-span-6 sm:col-span-8 sm:col-start-2 text-3xl lg:text-4xl text-white">
          <font-awesome-icon icon="map-marker-alt" class="text-4xl text-white" />
          Encontrá tu próximo estacionamiento...
        </span>
        <CustomInputGroup v-model:searchQuery="searchQuery" v-model:checkIn="checkIn" v-model:checkOut="checkOut"
          :onSearch="buscar" />
      </div>
      <!-- <div class="hidden sm:flex flex-row justify-between items-center shadow-md sm:rounded-xl bg-white h-16 py-2">
      <ZoneNavbar />
      <button
        class="hidden sm:flex sm:flex-row items-center gap-2 p-2 rounded-xl sm:mr-4 hover:bg-gray-100 shadow-md h-full border hover:border-black">
        <font-awesome-icon icon="fa-align-left" class="text-gray-500" />
        <span>Filtrar</span>
      </button>
    </div> -->

      <div ref="refSeccionResultados" class="flex flex-1 p-2 sm:p-6">
        <div v-if="!showMap"
          class="relative flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <div v-if="error" class="absolute top-1/4 flex justify-center items-center text-center text-red-500 w-full">{{
            error }}</div>
          <SpaceCard v-for="espacio in espacios" :key="espacio.id" :espacio="espacio" />
        </div>
        <div v-else class="flex-1">
          <CustomGoogleMap class="w-full h-full rounded-lg overflow-hidden shadow-md" :center="center" :zoom="zoom"
            :options="mapOptions">
            <Marker v-for="(espacio) in espacios" :key="espacio.id" :options="getMarkerOptions(espacio)"
              @mouseover="handleMouseOver(espacio)" @mouseout="handleMouseOut"
              @click="() => handleMarkerClick(espacio)" />
            <InfoWindow v-if="hoveredSpace && hoveredSpace.latitude && hoveredSpace.longitude" :position="{
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { Marker, InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import logoMarker from '../assets/logo.png';
import CustomGoogleMap from '../components/GoogleMap.vue';
import SpaceCard from '../components/SpaceCard.vue';
import { getAllSpaces, getFilteredSpaces } from '../services/spaceService';
import MainHeader from '../components/MainHeader.vue';
import FloatingButton from '../components/FloatingButton.vue';
import CustomInputGroup from "../components/CustomInputGroup.vue";
import DashboardSkeleton from '../components/DashboardSkeleton.vue';

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
const refSeccionResultados = ref(null);
const espacios = ref([]);
const cargando = ref(true);
const error = ref(null);
const showMap = ref(false);
const hoveredSpace = ref(null);
const center = ref({ lat: -26.8333, lng: -65.2167 });
const zoom = ref(15);
const buttonText = computed(() => showMap.value ? 'Ver Lista' : 'Ver Mapa');


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
    console.log(spaces);

    if (!spaces || spaces.length < 1) {
      espacios.value = [];
      error.value = "Aún no hay espacios creados.";
    } else {
      espacios.value = spaces;
    }

  } catch (err) {
    error.value = "No se pudieron cargar los espacios.";
    console.error(err);
  } finally {
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
  cargando.value = true;
  try {
    const response = await getFilteredSpaces({
      searchQuery: searchQuery?.value,
      checkIn: checkIn?.value,
      checkOut: checkOut?.value,
    });

    console.log(response);
    espacios.value = response;
    await nextTick();
    cargando.value = false;

    if (refSeccionResultados.value && searchQuery.value) {
      refSeccionResultados.value.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (error) {
    if (error.response) {
      error.value = "No se encontraron espacios con esos filtros.";
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
  cargando.value = false;
};

const toggleMap = () => {
  showMap.value = !showMap.value;
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
