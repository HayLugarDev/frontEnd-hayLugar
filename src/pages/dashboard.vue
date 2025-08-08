<template>
  <div>
    <DashboardSkeleton v-if="cargando" />
    <div v-else class="flex flex-col h-full bg-secondary">
      <MainHeader />
      <FloatingButton :text="buttonText" color="white" background="primary" @toggle="toggleMap" />
      <button v-if="!showSearchMenu" @click="toggleSearchMenu"
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
<div class="flex overflow-x-auto p-4 bg-white shadow-md rounded-lg mt-4">
      <button @click="router.push('/universidades')"
  class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
  🏫 Universidades
</button>

      <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">🌳 Estacionamiento Medido</button>
    </div>
      <div v-if="showSearchMenu" class="p-4 w-11/12 mx-auto rounded-full h-full bg-white">
        <AdvancedMobileSearch />
      </div>

      <div v-if="!showSearchMenu" ref="refSeccionResultados" class="flex flex-1 w-full h-full p-2 sm:p-6">
        <div v-if="!showMap"
          class="relative flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <div v-if="error" class="absolute top-1/4 flex justify-center items-center text-center text-red-500 w-full">{{
            error }}</div>
          <SpaceCard v-for="espacio in espacios" :key="espacio.id" :espacio="espacio" />
        </div>
        <div v-else class="w-full h-full">
          <CustomGoogleMap class="rounded-lg overflow-hidden shadow-md" :center="center" :zoom="zoom"
            :options="mapOptions">
            <GMapMarker v-for="(espacio) in espacios" :key="espacio.id" :options="getMarkerOptions(espacio)"
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
  <!-- Menú fijo en la parte inferior -->
  <div class="fixed bottom-0 left-0 w-full z-50">
    <MobileMenu @toggle="toggleMap" :showMap="showMap" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { Marker, InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import logoMarker from '../assets/logo.png';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import SpaceCard from '../components/pages/dashboardPage/SpaceCard.vue';
import { getAllSpaces, getFilteredSpaces } from '../services/spaceService';
import MainHeader from '../components/layout/header/MainHeader.vue';
import FloatingButton from '../components/pages/dashboardPage/FloatingButton.vue';
import CustomInputGroup from "../components/pages/dashboardPage/CustomInputGroup.vue";
import DashboardSkeleton from '../components/pages/dashboardPage/DashboardSkeleton.vue';
import MobileMenu from '../components/layout/MobileMenu.vue';
import { useGoogleMap } from '../logic/useGoogleMap';
import AdvancedMobileSearch from '../components/pages/dashboardPage/AdvancedMobileSearch.vue';

const router = useRouter();
const userStore = useUserStore();

const searchQuery = ref("");
const checkIn = ref("");
const checkOut = ref("");
const rangoTiempo = ref("hora");
const refSeccionResultados = ref(null);
const espacios = ref([]);
const cargando = ref(true);
const error = ref(null);
const showMap = ref(false);
const showSearchMenu = ref(false);
const buttonText = computed(() => showMap.value ? 'Ver Lista' : 'Ver Mapa');

const {
  center,
  zoom,
  hoveredSpace,
  getMarkerOptions,
  handleMouseOver,
  handleMouseOut,
  mapOptions,
  setCenterToUserLocation
} = useGoogleMap();

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
  setCenterToUserLocation();
  await obtenerEspacios();
  await userStore.fetchUser();
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
  nextTick(() => {
    if (!showMap.value && refSeccionResultados.value) {
      refSeccionResultados.value.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const toggleSearchMenu = () => {
  return showSearchMenu.value = !showSearchMenu.value;
}

const handleMarkerClick = (espacio) => {
  router.push(`/espacio/${espacio.id}`);
};
</script>

<style scoped>
.gm-style-iw {
  z-index: 9999 !important;
}
</style>
