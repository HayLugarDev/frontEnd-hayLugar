<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">

    <!-- LOADING -->
    <DashboardSkeleton v-if="loading || !spaces" />

    <div v-else class="flex flex-col h-full">

      <!-- HEADER -->
      <MainHeader @toggle="toggleMap" />

      <!-- BOTÓN MAPA (DESKTOP) -->
      <MapButton
        v-if="spaces && spaces.length"
        :text="buttonText"
        color="white"
        background="primary"
        @toggle="toggleMap"
        class="hidden"
      />

      <!-- BUSCADOR MOBILE -->
      <button
        v-if="!showSearchMenu"
        @click="toggleSearchMenu"
        class="flex md:hidden mt-24 items-center justify-center 
               bg-white/10 text-white border border-white/20
               shadow-lg backdrop-blur-md p-4 mx-6 rounded-full my-4 gap-2 
               hover:bg-white/20 transition"
      >
        <font-awesome-icon icon="search" class="text-sm" />
        <span>Buscar espacio</span>
      </button>

      <!-- BUSCADOR DESKTOP -->
      <div
        class="hidden md:grid md:grid-cols-11 px-8 py-4 items-center gap-4
               bg-white/5 backdrop-blur-xl shadow-xl border-b border-white/10"
      >
        <span class="anton-regular col-span-6 lg:text-4xl text-3xl text-white px-4">
          <font-awesome-icon icon="map-marker-alt" class="text-4xl text-[#06D6A0]" />
          Encontrá tu próximo estacionamiento...
        </span>

        <CustomInputGroup
          v-model:searchQuery="searchQuery"
          v-model:checkIn="checkIn"
          v-model:checkOut="checkOut"
          :onSearch="buscar"
          class="bg-white/5 border border-white/10 rounded-xl shadow-lg"
        />
      </div>

      <!-- NAVBAR -->
      <div class="flex overflow-x-auto px-4 py-4">
        <div class="flex gap-4 w-full">

          <button @click="router.push('/universidades')"
            class="flex flex-col items-center justify-center px-5 py-4 min-w-[150px]
                   bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
                   hover:bg-white/20 hover:border-[#06D6A0] hover:shadow-[0_0_20px_#06D6A055]
                   transition-all duration-300">
            <School class="w-7 h-7 text-[#06D6A0]" />
            <span class="text-white font-semibold text-sm mt-1">Universidades</span>
            <span class="text-gray-300 text-xs">Campus Inteligentes</span>
          </button>

          <button @click="router.push('/meteredParkingDashboard')"
            class="flex flex-col items-center justify-center px-5 py-4 min-w-[150px]
                   bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
                   hover:bg-white/20 hover:border-[#00B4D8] hover:shadow-[0_0_20px_#00B4D855]
                   transition-all duration-300">
            <ParkingSquare class="w-7 h-7 text-[#00B4D8]" />
            <span class="text-white font-semibold text-sm mt-1">Medido</span>
            <span class="text-gray-300 text-xs">Calles en tiempo real</span>
          </button>

          <button @click="router.push('/events')"
            class="flex flex-col items-center justify-center px-5 py-4 min-w-[150px]
                   bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
                   hover:bg-white/20 hover:border-[#FFD166] hover:shadow-[0_0_20px_#FFD16655]
                   transition-all duration-300">
            <Ticket class="w-7 h-7 text-[#FFD166]" />
            <span class="text-white font-semibold text-sm mt-1">Eventos</span>
            <span class="text-gray-300 text-xs">Festivales & shows</span>
          </button>

          <button @click="router.push('/industrial-dashboard')"
            class="flex flex-col items-center justify-center px-5 py-4 min-w-[150px]
                   bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
                   hover:bg-white/20 hover:border-[#8ECAE6] hover:shadow-[0_0_20px_#8ECAE655]
                   transition-all duration-300">
            <Factory class="w-7 h-7 text-[#8ECAE6]" />
            <span class="text-white font-semibold text-sm mt-1">Industrial</span>
            <span class="text-gray-300 text-xs">Operaciones en tiempo real</span>
          </button>

        </div>
      </div>

      <!-- BUSCADOR MOBILE AVANZADO -->
      <div
        v-if="showSearchMenu"
        class="p-4 w-11/12 mx-auto bg-[#1B263B]/90 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      >
        <AdvancedMobileSearch
          v-model:searchQuery="searchQuery"
          v-model:checkIn="checkIn"
          v-model:checkOut="checkOut"
          v-model:publishedDate="publishedDate"
          v-model:maxPrice="maxPrice"
          v-model:sortBy="sortBy"
          @search="buscar"
          @close="showSearchMenu = false"
        />
      </div>

      <!-- RESULTADOS -->
      <div v-if="!showSearchMenu" ref="refSeccionResultados"
        class="flex flex-1 w-full h-full p-4 md:p-8">

        <!-- LISTA -->
        <div v-if="!showMap"
          class="relative flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                 gap-6 justify-items-center">

          <div v-if="error" class="absolute inset-0 flex justify-center items-center text-red-400 text-xl">
            {{ error }}
          </div>

          <SpaceCard
            v-for="space in spaces"
            :key="space.id"
            :espacio="space"
            class="w-full max-w-sm"
          />
        </div>

        <!-- MAPA -->
        <div v-else class="w-full h-full">
          <CustomGoogleMap
            class="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            :center="center"
            :zoom="zoom"
            :options="mapOptions"
            :showUserMarker="true"
            :userPosition="center"
          >
            <GMapMarker
              v-for="space in spaces"
              :key="space.id"
              :options="getMarkerOptions(space)"
              @mouseover="handleMouseOver(space)"
              @mouseout="handleMouseOut"
              @click="() => handleMarkerClick(space)"
            />

            <InfoWindow
              v-if="hoveredSpace && hoveredSpace.latitude"
              :position="{ lat: Number(hoveredSpace.latitude), lng: Number(hoveredSpace.longitude) }"
              @closeclick="handleMouseOut"
            >
              <div class="p-2 text-[#0D1B2A]">
                <h3 class="text-lg font-bold text-[#1B263B]">{{ hoveredSpace.name }}</h3>
                <p class="text-sm">{{ hoveredSpace.location }}</p>
                <p class="text-sm text-[#00B4D8] font-semibold">${{ hoveredSpace.price_per_hour }}/hora</p>
              </div>
            </InfoWindow>
          </CustomGoogleMap>
        </div>

      </div>

      <!-- FOOTER -->
      <footer
        class="text-center text-[#B0BEC5] text-sm py-6 border-t border-white/10 bg-black/20 backdrop-blur-xl"
      >
        © {{ new Date().getFullYear() }} HayLugar — Movilidad Inteligente
      </footer>

      <WelcomeSpeech />

    </div>
  </div>
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
import WelcomeSpeech from '../components/layout/WelcomeSpeech.vue';
import { useSpaceStore } from '../store/spaceStore';
import { storeToRefs } from 'pinia'
import { School, ParkingSquare, Ticket, Factory } from 'lucide-vue-next'

const router = useRouter();
const spaceStore = useSpaceStore();
const { spaces, loading, error } = storeToRefs(spaceStore);

const searchQuery = ref("");
const checkIn = ref("");
const checkOut = ref("");
const showMap = ref(false);
const showSearchMenu = ref(false);
const refSeccionResultados = ref(null);

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
  loading.value = true;
  await spaceStore.setUserLocation();
  try {
    await spaceStore.fetchSpaces(true);
    setCenterToUserLocation();
  } finally {
    loading.value = false;
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

const toggleMap = () => (showMap.value = !showMap.value);
const toggleSearchMenu = () => (showSearchMenu.value = !showSearchMenu.value);
const handleMarkerClick = (espacio) => router.push(`/espacio/${espacio.slug}`);
</script>
