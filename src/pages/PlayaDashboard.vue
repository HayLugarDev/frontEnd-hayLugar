<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">

    <MainHeader class="hidden md:block" />

    <!-- ===== HEADER ===== -->
    <header class="relative z-10 px-6 py-8 md:px-12 flex items-center justify-between md:hidden">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10 md:hidden" />
        <h1 class="text-2xl md:text-3xl font-semibold tracking-wide">Playas de estacionamiento</h1>
      </div>
    </header>

    <!-- ===== HERO ===== -->
    <section class="relative w-full h-[240px] md:h-[320px] overflow-hidden flex items-center justify-center">
      <img
        src="/assets/playa-banner.jpg"
        alt="Playas de estacionamiento HayLugar"
        class="absolute inset-0 w-full h-full object-cover brightness-75"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/95 via-transparent"></div>

      <div class="relative z-10 text-center px-4">
        <h2 class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          Playas conectadas en tiempo real
        </h2>
        <p class="text-base md:text-lg text-white/85 max-w-2xl mx-auto">
          Tarifas claras, capacidad disponible y acceso guiado.  
          Una vista profesional de las playas de estacionamiento de tu ciudad.
        </p>
      </div>
    </section>

    <!-- ===== FILTROS ===== -->
    <section
      class="container mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row flex-wrap items-center gap-4 justify-center bg-white/5 rounded-2xl backdrop-blur-sm mt-6"
    >
      <input
        v-model="filters.search"
        type="text"
        placeholder="Buscar por nombre o dirección..."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3 placeholder-gray-400 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
      />

      <input
        v-model.number="filters.minCapacity"
        type="number"
        placeholder="Capacidad mín."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-32 placeholder-gray-400 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
      />

      <input
        v-model.number="filters.maxPrice"
        type="number"
        placeholder="Precio máx."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-36 placeholder-gray-400 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
      />

      <div class="flex items-center gap-3 text-sm text-[#B0BEC5]">
        <label class="flex items-center gap-2">
          <input v-model="filters.covered" type="checkbox" class="accent-[#06D6A0]" />
          Cubierto
        </label>
        <label class="flex items-center gap-2">
          <input v-model="filters.twentyFourSeven" type="checkbox" class="accent-[#06D6A0]" />
          24 hs
        </label>
      </div>

      <div class="flex items-center gap-3 mt-2 md:mt-0">
        <button
          @click="applyFilters"
          class="bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 text-sm transition-all"
        >
          Aplicar filtros
        </button>

        <button
          @click="toggleView"
          class="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-all"
        >
          <i :class="viewMode === 'list' ? 'fa-solid fa-map' : 'fa-solid fa-list'"></i>
          {{ viewMode === 'list' ? 'Ver mapa' : 'Ver lista' }}
        </button>
      </div>
    </section>

    <!-- ===== CONTENIDO PRINCIPAL ===== -->
    <div class="container mx-auto px-6 md:px-12 py-10">

      <!-- LOADING -->
      <div v-if="loading" class="text-center text-white/70 py-10">
        Cargando playas de estacionamiento...
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="text-center text-red-400 py-10">
        {{ error }}
      </div>

     <!-- LISTA -->
<section v-else-if="viewMode === 'list' && filteredPlayas.length">
  <transition-group
    name="fade-up"
    tag="div"
    class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center"
  >
    <router-link
      v-for="playa in filteredPlayas"
      :key="playa.id"
      :to="`/playa/${playa.id}`"
      class="block group w-full max-w-sm transition-transform duration-300 hover:scale-[1.02]"
    >
      <div
        class="bg-[#1B263B]/75 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg 
               hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2
               border border-white/10 group-hover:border-accent"
      >
        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-lg font-semibold leading-tight">
            {{ playa.name }}
          </h3>
          <p class="text-[#B0BEC5] text-xs truncate">
            {{ playa.address }}
          </p>

          <div class="flex justify-between mt-2 text-xs text-white/90">
            <span>
              <span class="font-semibold text-accent">Capacidad:</span>
              {{ playa.capacity }} lugares
            </span>
            <span class="font-semibold text-[#00B4D8]">
              ${{ playa.hourly_rate }} / hora
            </span>
          </div>

          <p class="mt-1 text-[11px] text-[#B0BEC5]">
            <span class="font-semibold text-accent">Horario:</span>
            {{ formatSchedule(playa.schedule) }}
          </p>

          <div class="mt-3 rounded-xl overflow-hidden shadow-md max-h-96 ring-1 ring-white/10 group-hover:ring-accent">
            <CustomGoogleMap
              :center="{ lat: parseFloat(playa.lat), lng: parseFloat(playa.lng) }"
              :zoom="16"
              class="w-full h-[150px]"
            >
              <GMapMarker :options="getMarkerOptions(playa)" />
            </CustomGoogleMap>
          </div>

          <button
            class="mt-3 w-full bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-4 py-2 text-xs transition-all"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </router-link>
  </transition-group>
</section>

      <!-- MAPA -->
      <section v-else-if="viewMode === 'map'" class="py-4">
        <div class="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-[600px]">
          <CustomGoogleMap
            :center="mapCenter"
            :zoom="13"
            :options="{ disableDefaultUI: true, zoomControl: true }"
          >
            <GMapMarker
              v-for="playa in filteredPlayas"
              :key="playa.id"
              :position="{ lat: parseFloat(playa.lat), lng: parseFloat(playa.lng) }"
              :options="{
                title: playa.name,
                icon: {
                  url: logoMarker,
                  scaledSize: { width: 38, height: 38 }
                }
              }"
              @click="goToDetail(playa.id)"
            />
          </CustomGoogleMap>
        </div>
      </section>

      <!-- SIN RESULTADOS -->
      <div v-else class="text-center py-20 text-[#B0BEC5]">
        <p>No se encontraron playas de estacionamiento con los filtros seleccionados.</p>
      </div>
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="text-center text-[#B0BEC5] text-sm py-8 border-t border-white/10">
      © {{ new Date().getFullYear() }} HayLugar — Playas de Estacionamiento Inteligentes
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import logoMarker from '../assets/logo.png'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import { getAllParkingLots } from '../services/playaService'
import MainHeader from '../components/layout/header/MainHeader.vue'

const router = useRouter()

const playas = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const filters = ref({
  search: '',
  minCapacity: null as number | null,
  maxPrice: null as number | null,
  covered: false,
  twentyFourSeven: false
})

const viewMode = ref<'list' | 'map'>('list')

// Centro por defecto (puede ser zona céntrica o donde haya más playas)
const mapCenter = { lat: -26.808, lng: -65.217 }

const getMarkerOptions = (playa: any) => ({
  position: {
    lat: parseFloat(playa.lat),
    lng: parseFloat(playa.lng)
  },
  icon: {
    url: logoMarker,
    scaledSize: { width: 40, height: 40 } as any
  },
  title: `${playa.name} · $${playa.hourly_rate}/h`
})

const formatSchedule = (schedule: any) => {
  if (!schedule) return '—'
  try {
    const parsed = typeof schedule === 'string' ? JSON.parse(schedule) : schedule
    return Object.entries(parsed)
      .map(([dia, hora]) => `${capitalize(dia)}: ${hora}`)
      .join(' | ')
  } catch (e) {
    return 'Horario no disponible'
  }
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// Filtro client-side
const filteredPlayas = computed(() => {
  let result = [...playas.value]

  if (filters.value.search) {
    const term = filters.value.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.address?.toLowerCase().includes(term)
    )
  }

  if (filters.value.minCapacity != null) {
    result = result.filter((p) => Number(p.capacity) >= filters.value.minCapacity!)
  }

  if (filters.value.maxPrice != null) {
    result = result.filter((p) => Number(p.hourly_rate) <= filters.value.maxPrice!)
  }

  // Estos filtros quedan listos para cuando tengas esos campos en el modelo
  if (filters.value.covered) {
    result = result.filter((p) => p.is_covered === true || p.covered === true)
  }

  if (filters.value.twentyFourSeven) {
    result = result.filter((p) => p.is_24hs === true || p.twenty_four_seven === true)
  }

  return result
})

const fetchPlayas = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getAllParkingLots()
    playas.value = response || []
  } catch (err) {
    console.error(err)
    error.value = 'No se pudieron cargar las playas de estacionamiento.'
  } finally {
    loading.value = false
  }
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'map' : 'list'
}

const applyFilters = () => {
  // La lógica de filtros es reactiva (filteredPlayas), el botón queda para UX.
}

const goToDetail = (id: number | string) => {
  router.push(`/playa/${id}`)
}

onMounted(fetchPlayas)
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
