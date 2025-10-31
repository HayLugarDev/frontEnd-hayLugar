<template>
  <div class="min-h-screen flex flex-col bg-[#0D1B2A] text-white">
    <DashboardSkeleton v-if="loading" />

    <div v-else class="flex flex-col flex-1 relative">
      <!-- ===== HEADER ===== -->
      <MainHeader @toggle="toggleMap" />

      <!-- ===== MAP BUTTON (ajustado) ===== -->
      <MapButton
        :text="buttonText"
        color="white"
        background="primary"
        @toggle="toggleMap"
        class="hidden md:flex items-center justify-center fixed bottom-8 right-8 z-40 map-button-pro"
      />

      <!-- ===== SEARCH MOBILE ===== -->
      <button
        v-if="!showSearchMenu"
        @click="toggleSearchMenu"
        class="text-white flex flex-row md:hidden mt-20 items-center justify-center shadow-md bg-[#1B263B]/80 backdrop-blur-md border border-white/10 p-4 mx-6 rounded-full my-4 gap-2 hover:scale-[1.03] transition"
      >
        <font-awesome-icon icon="search" class="text-[#00B4D8]" />
        <span>Encontrá tu espacio</span>
      </button>

      <!-- ===== DESKTOP SEARCH ===== -->
      <div
        class="hidden md:grid md:grid-cols-11 gap-4 items-center justify-center overflow-visible px-8 py-4 border-b border-white/10 bg-gradient-to-r from-[#1B263B] to-[#0D1B2A] backdrop-blur-md shadow-md"
      >
        <span
          class="anton-regular col-span-6 sm:col-span-8 sm:col-start-2 text-3xl lg:text-4xl font-semibold text-white drop-shadow-md"
        >
          <font-awesome-icon icon="map-marker-alt" class="text-[#00B4D8]" />
          Encontrá tu próximo estacionamiento...
        </span>
        <CustomInputGroup
          v-model:searchQuery="searchQuery"
          v-model:checkIn="checkIn"
          v-model:checkOut="checkOut"
          :onSearch="buscar"
          class="bg-white/5 border border-white/10 rounded-xl"
        />
      </div>

      <!-- ===== NAVBAR ZONAS ===== -->
      <div class="flex overflow-x-auto px-3 py-4 md:px-8 md:mt-4">
        <nav
          class="flex overflow-x-auto gap-3 p-3 md:p-4 bg-gradient-to-br from-[#1B263B]/90 to-[#0D1B2A]/90 shadow-lg rounded-2xl backdrop-blur-md border border-white/10 w-full md:justify-center"
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
            icon="🏭"
            title="Parque Industrial / Logístico"
            subtitle="Logística Inteligente"
            @click="router.push('/industrial-dashboard')"
            active-color="#06D6A0"
          />
        </nav>
      </div>

      <!-- ===== MOBILE SEARCH MENU ===== -->
      <div
        v-if="showSearchMenu"
        class="p-4 w-11/12 mx-auto bg-[#1B263B]/90 rounded-2xl shadow-lg border border-white/10 backdrop-blur-lg"
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

      <!-- ===== RESULTADOS ===== -->
      <div v-if="!showSearchMenu" ref="refSeccionResultados" class="flex flex-1 w-full h-full p-2 sm:p-6">
        <!-- LISTA -->
        <div
          v-if="!showMap"
          class="relative flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        >
          <div
            v-if="error"
            class="absolute top-1/4 flex justify-center items-center text-center text-red-400 w-full"
          >
            {{ error }}
          </div>

          <!-- Mantiene tus SpaceCards con layout correcto -->
          <SpaceCard
            v-for="space in spaces"
            :key="space.id"
            :espacio="space"
            class="transition-transform hover:scale-[1.02] hover:shadow-lg"
          />
        </div>

        <!-- MAPA -->
        <div v-else class="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
          <CustomGoogleMap
            class="h-full"
            :center="center"
            :zoom="zoom"
            :options="mapOptions"
            :showUserMarker="true"
            :userPosition="center"
          >
            <GMapMarker
              v-for="(space) in spaces"
              :key="space.id"
              :options="getMarkerOptions(space)"
              @mouseover="handleMouseOver(space)"
              @mouseout="handleMouseOut"
              @click="() => handleMarkerClick(space)"
            />
            <InfoWindow
              v-if="hoveredSpace && hoveredSpace.latitude && hoveredSpace.longitude"
              :position="{ lat: Number(hoveredSpace.latitude), lng: Number(hoveredSpace.longitude) }"
              @closeclick="handleMouseOut"
            >
              <div class="p-2 text-[#0D1B2A]">
                <h3 class="text-base font-bold">{{ hoveredSpace.name }}</h3>
                <p class="text-sm">{{ hoveredSpace.location }}</p>
                <p class="text-sm text-[#00B4D8] font-semibold">
                  ${{ hoveredSpace.price_per_hour }}/hora
                </p>
              </div>
            </InfoWindow>
          </CustomGoogleMap>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <footer class="text-center text-[#B0BEC5] text-sm py-6 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-md">
        © {{ new Date().getFullYear() }} HayLugar — Movilidad Inteligente
      </footer>

      <!-- ===== MODAL BIENVENIDA ===== -->
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
.map-button-pro {
  width: auto;
  height: 50px;
  padding: 0 1.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #00b4d8 0%, #06d6a0 100%);
  color: #0D1B2A;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 0 15px rgba(0, 180, 216, 0.5);
  transition: all 0.25s ease-in-out;
}
.map-button-pro:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(6, 214, 160, 0.7);
}
</style>
