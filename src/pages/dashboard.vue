<template>
  <div>
    <DashboardSkeleton v-if="loading" />
    <div v-else class="flex flex-col h-full bg-secondary">
      <MainHeader @toggle="toggleMap" />
      <MapButton :text="buttonText" color="white" background="primary" @toggle="toggleMap"
        class="hidden md:block md:fixed" />
      <button v-if="!showSearchMenu" @click="toggleSearchMenu"
        class="text-gray-700 flex flex-row md:hidden mt-20 items-center justify-center border-spacing-2 shadow-md bg-white p-4 mx-6 rounded-full my-4 gap-2">
        <font-awesome-icon icon="search" class="text-xs" />
        <span>Encontra tu espacio</span>
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

      <!-- Habilitar Navbar Buttons -->
      <!-- <div class="flex overflow-x-auto p-4 md:bg-white shadow-md rounded-lg md:mt-4">
          <nav
    class="flex overflow-x-auto gap-3 p-3 md:p-4 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] shadow-lg rounded-2xl md:mt-4 backdrop-blur-lg border border-white/5"
  >
    <ZoneNavbarButton
      icon="🎓"
      title="Universidades"
      subtitle="Campus Inteligentes"
      @click="router.push('/universidades')"
      active-color="#06D6A0"
    />
    <ZoneNavbarButton
      icon="🅿️"
      title="Estacionamiento Medido"
      subtitle="Calles en tiempo real"
      @click="router.push('/meteredParkingDashboard')"
      active-color="#00B4D8"
    />
    <ZoneNavbarButton
      icon="🎟️"
      title="Eventos"
      subtitle="Festivales y shows"
      @click="router.push('/events')"
      active-color="#FFD166"
    />
     <ZoneNavbarButton
      icon="🏬"
      title="Parque Industrial / Logístico"
      subtitle="Industria"
      @click="router.push('/industrial-dashboard')"
      active-color="#FFD166"
    />
  </nav>
      </div>  -->

      <div v-if="showSearchMenu" class="p-4 w-11/12 mx-auto rounded-full h-full bg-white">
        <AdvancedMobileSearch v-model:searchQuery="searchQuery" v-model:checkIn="checkIn" v-model:checkOut="checkOut"
          v-model:publishedDate="publishedDate" v-model:maxPrice="maxPrice" v-model:sortBy="sortBy" @search="buscar"
          @close="showSearchMenu = false" />
      </div>

      <div v-if="!showSearchMenu" ref="refSeccionResultados" class="flex flex-1 w-full h-full p-2 sm:p-6">
        <div v-if="!showMap" class="relative flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          <div v-if="error" class="absolute top-1/4 flex justify-center items-center text-center text-red-500 w-full">
            {{ error }}
          </div>
          <SpaceCard v-for="space in spaces" :key="space.id" :espacio="space" />
        </div>
        <div v-else class="w-full h-full">
          <CustomGoogleMap class="rounded-lg overflow-hidden shadow-md" :center="center" :zoom="zoom"
            :options="mapOptions" :showUserMarker="true" :userPosition="center">
            <GMapMarker v-for="(space) in spaces" :key="space.id" :options="getMarkerOptions(space)"
              @mouseover="handleMouseOver(space)" @mouseout="handleMouseOut"
              @click="() => handleMarkerClick(space)" />
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

  <!-- Modal bienvenida -->
  <WelcomeSpeech />
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { InfoWindow } from 'vue3-google-map';
import { useRouter } from 'vue-router';
import CustomGoogleMap from '../components/layout/GoogleMap.vue';
import SpaceCard from '../components/pages/dashboardPage/SpaceCard.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import MapButton from '../components/pages/dashboardPage/MapButton.vue';
import CustomInputGroup from "../components/pages/dashboardPage/CustomInputGroup.vue";
import DashboardSkeleton from '../components/pages/dashboardPage/DashboardSkeleton.vue';
import { useGoogleMap } from '../logic/useGoogleMap';
import AdvancedMobileSearch from '../components/pages/dashboardPage/AdvancedMobileSearch.vue';
import ZoneNavbarButton from '../components/pages/dashboardPage/ZoneNavbarButton.vue';
import WelcomeSpeech from '../components/layout/WelcomeSpeech.vue';
import { useSpaceStore } from '../store/spaceStore';
import { storeToRefs } from 'pinia'

const router = useRouter();

const spaceStore = useSpaceStore();
const { spaces, loading, error } = storeToRefs(spaceStore);

const searchQuery = ref("");
const checkIn = ref("");
const checkOut = ref("");
const refSeccionResultados = ref(null);
const showMap = ref(false);
const showSearchMenu = ref(false);
const buttonText = computed(() => showMap.value ? 'Ver Lista' : 'Ver Mapa');

const publishedDate = ref(null);
const maxPrice = ref('');
const sortBy = ref('nearest');

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

onMounted(async () => {
  if (spaces.value.length === 0) {
    loading.value = true;
    await spaceStore.setUserLocation();
    try {
      await spaceStore.fetchSpaces(true);
      setCenterToUserLocation();
    } catch (e) {
      console.warn("No se pudo obtener ubicación del usuario:", e);
    } finally {
      loading.value = false;
    }
    console.log(spaces.value);
  } else {
    // Ya tenés los datos cacheados
    setCenterToUserLocation();
  }
});


const buscar = async () => {
  await spaceStore.fetchFilteredSpaces({
    searchQuery: searchQuery.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    publishedDate: publishedDate.value,
    maxPrice: maxPrice.value,
    sortBy: sortBy.value,
  });
  await nextTick();
  if (refSeccionResultados.value && searchQuery.value) {
    refSeccionResultados.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const toggleMap = () => {
  showMap.value = !showMap.value;
};

const toggleSearchMenu = () => {
  return showSearchMenu.value = !showSearchMenu.value;
}

const handleMarkerClick = (espacio) => {
  router.push(`/espacio/${espacio.slug}`);
};
</script>

<style scoped>
.gm-style-iw {
  z-index: 9999 !important;
}
</style>
