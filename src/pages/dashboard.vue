<template>
  <div
    :key="dashboardKey"
    class="font-normal relative min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-x-hidden"
  >

    <!-- LOADING -->
    <DashboardSkeleton v-if="loading || !spaces" />

    <div v-else class="flex flex-col h-full pt-24 md:pt-20">

      <MainHeader />

      <!-- MENÚ INFERIOR MOBILE -->
      <MobileButtonNav
        class="md:hidden"
        :showMap="showMap"
        @toggle-map="toggleMap"
        @navigate="path => router.push(path)"
      />

      <!-- BUSCADOR MOBILE -->
      <button
        v-if="!showSearchMenu"
        @click="toggleSearchMenu"
        class="flex md:hidden items-center justify-center 
               bg-white/10 text-white border-b border-white/20
               shadow-xl backdrop-blur-md p-4 mx-6 rounded-full my-4 gap-2 
               hover:bg-white/20 transition"
      >
        🔍 <span>Comenzar búsqueda</span>
      </button>

      <!-- BUSCADOR DESKTOP -->
      <div
        class="hidden md:grid md:grid-cols-11 px-8 py-4 items-center gap-4
               bg-white/5 backdrop-blur-xl shadow-xl border-b border-white/10"
      >
        <CustomInputGroup
          v-model:searchQuery="searchQuery"
          v-model:checkIn="checkIn"
          v-model:checkOut="checkOut"
          :onSearch="buscar"
        />
      </div>

      <!-- TITULO -->
      <span class="w-full font-bold tracking-tight text-xl md:text-2xl text-gray-200 pl-6 md:pl-10 pt-4">
        Cerca de ti...
      </span>

      <!-- RESULTADOS -->
      <div
        v-if="!showSearchMenu"
        ref="refSeccionResultados"
        class="flex flex-1 w-full h-full p-4 md:py-0 md:px-8"
      >

        <!-- LISTA -->
        <div v-if="!showMap" class="flex flex-col gap-10 w-full">
          <section
            v-for="group in spacesByCity"
            :key="group.city"
            class="relative group"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg md:text-xl mb-4 pl-2">
                {{ group.city }}
              </h3>

              <div class="hidden md:flex gap-2">
                <button
                  class="bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full"
                  @click="scrollLeft(group.city)"
                >
                  ‹
                </button>
                <button
                  class="bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full"
                  @click="scrollRight(group.city)"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              :ref="el => setSliderRef(group.city, el)"
              class="flex gap-4 overflow-x-auto hide-scrollbar px-2 pb-4 scroll-smooth"
            >
              <SpaceCard
                v-for="space in group.items"
                :key="space.id"
                :espacio="space"
                class="min-w-[260px] max-w-[260px]"
              />
            </div>
          </section>
        </div>

        <!-- MAPA (LAZY REAL) -->
        <div
          v-if="showMap"
          class="relative w-full h-full rounded-2xl overflow-hidden
                 border border-white/10
                 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
        >
          <div
            class="pointer-events-none absolute inset-0
                   bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent z-10"
          />

          <div
            class="absolute top-4 left-4 z-20
                   bg-[#1B263B]/90 backdrop-blur-xl
                   border border-white/10
                   rounded-xl px-4 py-3 shadow-xl"
          >
            <p class="text-xs text-[#90CAF9]">Mostrando espacios cerca de</p>
            <p class="font-semibold max-w-[220px] truncate">
              {{ userAddress.split(',')[0] || 'Ubicando tu posición…' }}
            </p>
          </div>

          <button
            class="absolute bottom-6 left-6 z-20
                   bg-[#1B263B]/90 hover:bg-[#24334d]
                   border border-white/10
                   rounded-full p-3 shadow-xl"
            @click="setCenterToUserLocation"
          >
            📍
          </button>

          <CustomGoogleMap
            :center="center"
            :zoom="zoom"
            :options="mapOptions"
            locateUser
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
              v-if="hoveredSpace?.latitude"
              :position="{
                lat: Number(hoveredSpace.latitude),
                lng: Number(hoveredSpace.longitude)
              }"
              @closeclick="handleMouseOut"
            >
              <div class="p-2 text-[#0D1B2A]">
                <h3 class="font-bold">{{ hoveredSpace.name }}</h3>
                <p class="text-sm">{{ hoveredSpace.location }}</p>
                <p class="text-sm font-semibold text-[#00B4D8]">
                  ${{ hoveredSpace.price_per_hour }}/hora
                </p>
              </div>
            </InfoWindow>
          </CustomGoogleMap>
        </div>
      </div>

      <!-- BOTÓN MAPA -->
      <MapButton
        v-if="spaces?.length"
        class="fixed"
        :text="buttonText"
        @toggle="toggleMap"
      />

      <!-- BUSCADOR MOBILE AVANZADO -->
      <AdvancedMobileSearch
        v-if="showSearchMenu"
        v-model:searchQuery="searchQuery"
        v-model:checkIn="checkIn"
        v-model:checkOut="checkOut"
        v-model:publishedDate="publishedDate"
        v-model:maxPrice="maxPrice"
        v-model:sortBy="sortBy"
        @search="buscar"
        @close="showSearchMenu = false"
      />

      <WelcomeSpeech />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { InfoWindow } from 'vue3-google-map'

import MainHeader from '../components/layout/header/MainHeader.vue'
import MobileButtonNav from '../components/layout/MobileButtonNav.vue'
import CustomInputGroup from '../components/pages/dashboardPage/CustomInputGroup.vue'
import DashboardSkeleton from '../components/pages/dashboardPage/DashboardSkeleton.vue'
import MapButton from '../components/pages/dashboardPage/MapButton.vue'

import { useSpaceStore } from '../store/spaceStore'
import { useGoogleMap } from '../logic/useGoogleMap'

/* ===== LAZY COMPONENTS ===== */
const CustomGoogleMap = defineAsyncComponent(() =>
  import('../components/layout/GoogleMap.vue')
)
const SpaceCard = defineAsyncComponent(() =>
  import('../components/pages/dashboardPage/SpaceCard.vue')
)
const AdvancedMobileSearch = defineAsyncComponent(() =>
  import('../components/pages/dashboardPage/AdvancedMobileSearch.vue')
)
const WelcomeSpeech = defineAsyncComponent(() =>
  import('../components/layout/WelcomeSpeech.vue')
)

/* ===== STATE ===== */
const router = useRouter()
const route = useRoute()
const spaceStore = useSpaceStore()
const { spaces, loading } = storeToRefs(spaceStore)

const searchQuery = ref('')
const checkIn = ref('')
const checkOut = ref('')
const publishedDate = ref(null)
const maxPrice = ref('')
const sortBy = ref('nearest')

const showMap = ref(false)
const showSearchMenu = ref(false)
const refSeccionResultados = ref(null)
const dashboardKey = ref(0)

const buttonText = computed(() =>
  showMap.value ? 'Ver Lista' : 'Ver Mapa'
)

/* ===== SLIDERS ===== */
const sliderRefs = ref({})
const setSliderRef = (key, el) => el && (sliderRefs.value[key] = el)
const scrollLeft = key => sliderRefs.value[key]?.scrollBy({ left: -320, behavior: 'smooth' })
const scrollRight = key => sliderRefs.value[key]?.scrollBy({ left: 320, behavior: 'smooth' })

/* ===== MAP LOGIC ===== */
const {
  center,
  zoom,
  userAddress,
  hoveredSpace,
  getMarkerOptions,
  handleMouseOver,
  handleMouseOut,
  mapOptions,
  setCenterToUserLocation
} = useGoogleMap()

/* ===== GROUPING ===== */
const spacesByCity = computed(() => {
  const list = spaces.value
  if (!list?.length) return []

  const baseProvince = list
    .slice()
    .sort((a, b) => a.distance - b.distance)[0]
    ?.location?.split(',')[2]?.trim()

  const cityMap = {}
  const provinceMap = {}

  list.forEach(space => {
    const [, city = 'Otras', province = 'Otras'] =
      space.location.split(',').map(p => p.trim())

    if (province === baseProvince) {
      cityMap[city] ||= []
      cityMap[city].push(space)
    } else {
      const key = `Provincia de ${province}`
      provinceMap[key] ||= []
      provinceMap[key].push(space)
    }
  })

  const normalize = map =>
    Object.entries(map).map(([city, items]) => ({
      city,
      items: items.sort((a, b) => a.distance - b.distance),
      nearestDistance: items[0]?.distance ?? Infinity
    }))

  return [
    ...normalize(cityMap).sort((a, b) => a.nearestDistance - b.nearestDistance),
    ...normalize(provinceMap)
  ]
})

/* ===== ACTIONS ===== */
onMounted(async () => {
  loading.value = true
  spaceStore.setUserLocation()      // no bloquea render
  await spaceStore.fetchSpaces(true)
  loading.value = false
})

const buscar = async () => {
  await spaceStore.fetchFilteredSpaces({
    searchQuery: searchQuery.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    publishedDate: publishedDate.value,
    maxPrice: maxPrice.value,
    sortBy: sortBy.value
  })
  await nextTick()
  refSeccionResultados.value?.scrollIntoView({ behavior: 'smooth' })
}

const toggleMap = () => (showMap.value = !showMap.value)
const toggleSearchMenu = () => (showSearchMenu.value = !showSearchMenu.value)
const handleMarkerClick = space => router.push(`/espacio/${space.slug}`)

watch(() => route.fullPath, () => dashboardKey.value++)
</script>
