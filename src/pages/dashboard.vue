<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-x-hidden">

    <!-- LOADING -->
     <div v-if="loading || !spaces">
       <DashboardSkeleton />
   
       <!-- BUSCADOR MOBILE AVANZADO -->
       <div v-if="showSearchMenu"
         class="p-4 w-11/12 mx-auto bg-[#1B263B]/90 rounded-2xl shadow-2xl border border-white/10">
         <AdvancedMobileSearch v-model:searchQuery="searchQuery" v-model:checkIn="checkIn" v-model:checkOut="checkOut"
           v-model:publishedDate="publishedDate" v-model:maxPrice="maxPrice" v-model:sortBy="sortBy" @search="buscar"
           @close="showSearchMenu = false" />
       </div>
     </div>

    <div v-else class="flex flex-col h-full pt-24 md:pt-20">

      
      <MainHeader />

      <!-- MENÚ INFERIOR MOBILE -->
      <MobileButtonNav @toggle-map="toggleMap" @navigate="(path) => router.push(path)" class="md:hidden"
        :showMap="showMap" />

      <!-- BUSCADOR MOBILE -->
      <button v-if="!showSearchMenu" @click="toggleSearchMenu" class="flex md:hidden items-center justify-center 
               bg-white/10 text-white border-b border-white/20
               shadow-xl backdrop-blur-md p-4 mx-6 rounded-full my-4 gap-2 
               hover:bg-white/20 transition">
        <font-awesome-icon icon="search" class="text-sm" />
        <span>Comenzar busqueda</span>
      </button>

      <!-- BUSCADOR DESKTOP -->
      <div class="hidden md:grid md:grid-cols-11 px-8 py-4 items-center gap-4
               bg-white/5 backdrop-blur-xl shadow-xl border-b border-white/10">

        <CustomInputGroup v-model:searchQuery="searchQuery" v-model:checkIn="checkIn" v-model:checkOut="checkOut"
          :onSearch="buscar" />
      </div>

      <!-- NAVBAR -->
      <!-- <div class="relative py-4">
        <div
          class="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#0D1B2A] to-transparent">
        </div>
        <div
          class="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#0D1B2A] to-transparent">
        </div>

        <div class="flex gap-4 px-4 overflow-x-auto hide-scrollbar">
          <FeatureButton :icon="School" color="#06D6A0" title="Universidades" subtitle="Campus Inteligentes"
            :enabled="features.universidades" :onClick="() => router.push('/universidades')" />

          <FeatureButton :icon="ParkingSquare" color="#00B4D8" title="Medido" subtitle="Calles en tiempo real"
            :enabled="features.medido" :onClick="() => router.push('/meteredParkingDashboard')" />

          <FeatureButton :icon="Ticket" color="#FFD166" title="Eventos" subtitle="Festivales & shows"
            :enabled="features.eventos" :onClick="() => router.push('/events')" />

          <FeatureButton :icon="Factory" color="#8ECAE6" title="Industrial" subtitle="Operaciones en tiempo real"
            :enabled="features.industrial" :onClick="() => router.push('/industrial-dashboard')" />

          <FeatureButton :icon="ParkingSquare" color="#90BE6D" title="Playas" subtitle="Estacioná en tiempo real"
            :enabled="features.playas" :onClick="() => router.push('/playa-dashboard')" />
        </div>
      </div> -->

           <!-- NAVBAR -->
      <div class="relative py-4">
        <div
          class="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#0D1B2A] to-transparent">
        </div>
        <div
          class="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#0D1B2A] to-transparent">
        </div>

        <div class="flex gap-4 px-4 overflow-x-auto hide-scrollbar">
         

            <FeatureButton
     
            :icon="ParkingCircleIcon"
            color="#EF4444"
            title="Tráfico"
            subtitle="En tiempo real"
            :enabled="true"
            :onClick="() => router.push('/traffic')"
    />
        </div>
      </div>

      <span class="w-full rounded-t-xl font-bold tracking-tight text-xl md:text-2xl text-gray-200 pl-6 md:pl-10 pt-4">
        Cerca de ti...
      </span>

      <!-- RESULTADOS -->
      <div v-if="!showSearchMenu" ref="refSeccionResultados" class="flex flex-1 w-full h-full p-4 md:py-0 md:px-8">

        <!-- LISTA -->
        <div v-if="!showMap" class="relative flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 
                 gap-6 justify-items-center">

          <div v-if="error" class="absolute inset-0 flex justify-center items-center text-red-400 text-xl">
            {{ error }}
          </div>

          <SpaceCard v-for="space in spaces" :key="space.id" :espacio="space" class="w-full max-w-sm" />
        </div>

        <!-- MAPA -->
        <div v-else class="w-full h-full">
          <CustomGoogleMap class="rounded-xl overflow-hidden shadow-2xl border border-white/10" :center="center"
            :zoom="zoom" :options="mapOptions" :showUserMarker="true" :userPosition="center">
            <GMapMarker v-for="space in spaces" :key="space.id" :options="getMarkerOptions(space)"
              @mouseover="handleMouseOver(space)" @mouseout="handleMouseOut" @click="() => handleMarkerClick(space)" />

            <InfoWindow v-if="hoveredSpace && hoveredSpace.latitude"
              :position="{ lat: Number(hoveredSpace.latitude), lng: Number(hoveredSpace.longitude) }"
              @closeclick="handleMouseOut">
              <div class="p-2 text-[#0D1B2A]">
                <h3 class="text-lg font-bold text-[#1B263B]">{{ hoveredSpace.name }}</h3>
                <p class="text-sm">{{ hoveredSpace.location }}</p>
                <p class="text-sm text-[#00B4D8] font-semibold">${{ hoveredSpace.price_per_hour }}/hora</p>
              </div>
            </InfoWindow>
          </CustomGoogleMap>
        </div>

      </div>

      <!-- ===== FOOTER ===== -->
      <footer class="mt-10 border-t border-white/10 bg-[#0D1B2A]/80 backdrop-blur-xl">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between 
              gap-4 px-6 py-8 text-[#B0BEC5] text-sm">

          <!-- Branding -->
          <div class="flex items-center gap-2">
            <span class="text-white font-semibold tracking-wide">HayLugar</span>
            <span class="text-xs text-[#78909C]">© {{ new Date().getFullYear() }}</span>
          </div>

          <!-- Links -->
          <div class="flex gap-6">
            <router-link to="/PrivacyPolicy" class="hover:text-white transition-colors duration-200">
              Política de Privacidad
            </router-link>

            <router-link to="/termsConditions" class="hover:text-white transition-colors duration-200">
              Términos y Condiciones
            </router-link>
          </div>

          <!-- Extra -->
          <div class="text-xs text-[#78909C]">
            Movilidad inteligente
          </div>
        </div>
      </footer>

      <!-- BOTÓN MAPA (DESKTOP) -->
      <MapButton v-if="spaces && spaces.length" :text="buttonText" @toggle="toggleMap" class="fixed" />

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
import { School, ParkingSquare, Ticket, Factory, ParkingCircleIcon, HouseIcon } from 'lucide-vue-next'
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import FeatureButton from '../components/pages/dashboardPage/FeatureButton.vue';

const features = {
  playas: import.meta.env.VITE_FEATURE_PLAYAS === "true",
  universidades: import.meta.env.VITE_FEATURE_UNIVERSIDADES === "true",
  medido: import.meta.env.VITE_FEATURE_MEDIDO === "true",
  eventos: import.meta.env.VITE_FEATURE_EVENTOS === "true",
  industrial: import.meta.env.VITE_FEATURE_INDUSTRIAL === "true",
};

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
