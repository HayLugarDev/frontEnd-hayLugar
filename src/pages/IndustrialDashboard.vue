<template>

  <!-- HEADER SOLO EN DESKTOP -->
  <MainHeader class="hidden md:block" />

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">
    <!-- ===== HEADER ===== -->
    <header class="relative z-10 px-6 py-8 md:px-12 flex items-center justify-between md:hidden">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10 md:hidden" />
        <h1 class="text-2xl md:text-3xl font-semibold tracking-wide">Parques Industriales</h1>
      </div>

      <button
        class="hidden md:flex items-center gap-2 bg-[#06D6A0]/20 hover:bg-[#06D6A0]/30 px-4 py-2 rounded-xl transition-all"
      >
        <i class="fa-solid fa-industry text-[#06D6A0]"></i>
        <span class="text-sm font-medium">Logística Inteligente</span>
      </button>
    </header>

    <!-- ===== HERO ===== -->
    <section class="relative w-full h-[240px] md:h-[360px] overflow-hidden flex items-center justify-center">
      <video
        autoplay
        muted
        loop
        playsinline
        poster="/assets/industry.png"
        class="absolute inset-0 w-full h-full object-cover brightness-75"
      ></video>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent"></div>
      <div class="relative z-10 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">Espacios Logísticos en Red</h2>
        <p class="text-3xl md:text-3xl font-bold mb-2 drop-shadow-lg">
          Almacená, transportá y optimizá tus operaciones con inteligencia urbana HayLugar.
        </p>
      </div>
    </section>

    <!-- ===== FILTROS ===== -->
    <section
      class="container mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row flex-wrap items-center gap-4 justify-center bg-white/5 rounded-2xl backdrop-blur-sm"
    >
      <input
        v-model="filters.search"
        type="text"
        placeholder="Buscar por ubicación o nombre..."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
      />

      <select
        v-model="filters.subcategory"
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 w-full md:w-48"
      >
        <option value="">Todos los tipos</option>
        <option value="warehouse">Depósito</option>
        <option value="dock">Dársena</option>
        <option value="yard">Patio Logístico</option>
        <option value="cold_storage">Cámara Fría</option>
        <option value="logistics">Centro Logístico</option>
      </select>

      <input
        v-model.number="filters.minCapacity"
        type="number"
        placeholder="Mín. m²"
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-32 placeholder-gray-400 focus:ring-2 focus:ring-[#00B4D8]"
      />

      <input
        v-model.number="filters.maxPrice"
        type="number"
        placeholder="Precio máx."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-36 placeholder-gray-400 focus:ring-2 focus:ring-[#00B4D8]"
      />

      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-[#B0BEC5]">
          <input v-model="filters.security" type="checkbox" class="accent-[#06D6A0]" />
          Seguridad
        </label>
        <label class="flex items-center gap-2 text-sm text-[#B0BEC5]">
          <input v-model="filters.loadingDock" type="checkbox" class="accent-[#06D6A0]" />
          Muelle
        </label>
      </div>

      <div class="flex items-center gap-3 mt-2 md:mt-0">
        <button
          @click="fetchSpaces"
          class="bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 transition-all"
        >
          Buscar
        </button>

        <button
          @click="toggleView"
          class="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-all"
        >
          <i :class="viewMode === 'list' ? 'fa-solid fa-map' : 'fa-solid fa-list'"></i>
          {{ viewMode === 'list' ? 'Ver Mapa' : 'Ver Lista' }}
        </button>
      </div>
    </section>

    <!-- ===== LISTA DE ESPACIOS ===== -->
    <section
      v-if="viewMode === 'list' && spaces.length"
      class="container mx-auto px-6 md:px-12 py-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <transition-group name="fade-up" tag="div">
        <div
          v-for="space in spaces"
          :key="space.id"
          class="group bg-[#1B263B]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/5"
        >
          <div class="relative h-52 overflow-hidden">
            <img
              :src=" '/assets/industrial_cover.jpg'"
              :alt="space.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent"></div>
            <div class="absolute bottom-3 left-3">
              <span
                class="bg-[#06D6A0]/20 px-3 py-1 rounded-full font-medium uppercase text-xs tracking-wider"
              >
                {{ formatType(space.subcategory) }}
              </span>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-2">
            <h3 class="text-xl font-semibold leading-tight">{{ space.name }}</h3>
            <p class="text-[#B0BEC5] text-sm truncate">{{ space.location }}</p>
            <div class="flex justify-between mt-2 text-sm">
              <span>{{ space.capacity_m2 || '—' }} m²</span>
              <span class="text-[#00B4D8] font-semibold">
                ${{ space.price_per_unit || 'N/D' }}/{{ space.pricing_unit || 'día' }}
              </span>
            </div>
            <button
              @click="goToDetail(space.slug)"
              class="mt-4 bg-[#00B4D8] hover:bg-[#06D6A0] text-dark font-semibold rounded-xl px-4 py-2 transition-all text-sm"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </transition-group>
    </section>

    <!-- ===== MAPA INTERACTIVO ===== -->
    <section v-else-if="viewMode === 'map'" class="container mx-auto px-6 md:px-12 py-12">
      <div class="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-[600px]">
        <CustomGoogleMap
          :center="mapCenter"
          :zoom="13"
          :options="{ disableDefaultUI: true, zoomControl: true }"
        >
          <GMapMarker
            v-for="space in spaces"
            :key="space.id"
            :position="{ lat: Number(space.latitude), lng: Number(space.longitude) }"
            :options="{
              title: space.name,
              icon: {
                url: '/assets/logo.png',
                scaledSize: { width: 42, height: 42 }
              }
            }"
            @click="goToDetail(space.slug)"
          />
        </CustomGoogleMap>
      </div>
    </section>

    <!-- ===== SIN RESULTADOS ===== -->
    <div v-else class="text-center py-20 text-[#B0BEC5]">
      <p>No se encontraron espacios logísticos.</p>
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

            <router-link to="/terminos-y-condiciones" class="hover:text-white transition-colors duration-200">
              Términos y Condiciones
            </router-link>
          </div>

          <!-- Extra -->
          <div class="text-xs text-[#78909C]">
            Logística inteligente
          </div>
        </div>
      </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpaceStore } from '../store/spaceStore'
import { storeToRefs } from 'pinia'
import logo from '../assets/logo.png'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import MobileButtonNav from '../components/layout/MobileButtonNav.vue'
import MainHeader from '../components/layout/header/MainHeader.vue'

const router = useRouter()
const spaceStore = useSpaceStore()
const { spaces } = storeToRefs(spaceStore)

const filters = ref({
  search: '',
  subcategory: '',
  minCapacity: null,
  maxPrice: null,
  security: false,
  loadingDock: false
})

const viewMode = ref<'list' | 'map'>('list')

const mapCenter = { lat: -26.8109807, lng: -65.1686014 } // Parque Industrial Tucumán

const fetchSpaces = async () => {
  await spaceStore.fetchIndustrialSpaces({
    searchQuery: filters.value.search,
    subcategory: filters.value.subcategory
  })
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'map' : 'list'
}

onMounted(fetchSpaces)

function formatType(type: string) {
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio',
    cold_storage: 'Refrigerado',
    logistics: 'Logística'
  }
  return map[type] || 'Industrial'
}

function goToDetail(slug: string) {
  router.push({ name: 'IndustrialDetail', params: { slug } })
}
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
