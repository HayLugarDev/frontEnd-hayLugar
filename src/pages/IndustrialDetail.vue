<template>
  <!-- ========== ESTADO: CARGANDO ============= -->
  <div
    v-if="loading"
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-[#B0BEC5]"
  >
    <div class="w-12 h-12 border-4 border-[#00B4D8]/40 border-t-[#00B4D8] rounded-full animate-spin mb-4"></div>
    <p class="text-sm md:text-base">Cargando espacio logístico…</p>
  </div>

  <!-- ========== ESTADO: NO ENCONTRADO ============= -->
  <div
    v-else-if="notFound"
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-[#B0BEC5]"
  >
    <p class="text-lg font-semibold mb-2">Este espacio no existe.</p>
    <p class="text-sm mb-6 text-[#90A4AE]">
      Puede que el enlace esté desactualizado o que el espacio ya no esté disponible.
    </p>
    <button
      @click="router.push('/industrial')"
      class="px-6 py-3 rounded-xl bg-[#00B4D8] text-[#0D1B2A] font-semibold hover:bg-[#06D6A0] transition-all"
    >
      Volver al listado
    </button>
  </div>

  <!-- ========== VISTA PRINCIPAL ============= -->
  <div
    v-else-if="space"
    class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white flex flex-col"
  >
    <MainHeader class="hidden md:block" />

    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur-lg shadow-lg"
    >
      <div class="flex items-center gap-3">
        <img :src="logo" class="h-10 w-10" alt="HayLugar" />

        <div>
          <p class="text-xs md:text-sm text-[#B0BEC5]/80 flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
            >
              <i class="fa-solid fa-industry text-[#00B4D8]"></i>
              Industrial · Tucumán
            </span>
            <span class="hidden md:inline">{{ formattedType }} · Nodo logístico</span>
          </p>

          <h1 class="text-xl md:text-3xl font-semibold tracking-wide mt-1 flex items-center gap-2">
            {{ space.name }}

            <!-- Badge fijo -->
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#06D6A0]/15 text-[#B2FFDA] border border-[#06D6A0]/40"
            >
              <i class="fa-solid fa-circle-check text-[#06D6A0]"></i>
              Verificado
            </span>
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="shareSpace"
          class="hidden md:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
        >
          <i class="fa-solid fa-share-nodes text-[#00B4D8]"></i>
          Compartir
        </button>

        <button
          @click="router.back()"
          class="text-xs md:text-sm bg-[#06D6A0]/20 hover:bg-[#06D6A0]/40 px-4 py-2 rounded-xl transition-all"
        >
          ← Volver
        </button>
      </div>
    </header>

    <!-- HERO + GALERÍA -->
    <section class="relative w-full h-[260px] md:h-[440px] overflow-hidden">
      <Swiper
        :modules="[Navigation, Pagination, Autoplay]"

        class="w-full h-full"
      >
        <SwiperSlide v-for="(img, i) in galleryImages" :key="i">
          <img
            :src="img"
            class="w-full h-full object-cover"
            @error="onImageError"
            :alt="`Imagen ${i + 1} de ${space?.name}`"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent"></div>
        </SwiperSlide>
      </Swiper>

      <!-- LOCALIZACIÓN -->
      <div
        class="absolute top-4 left-6 md:left-12 bg-[#1B263B]/80 backdrop-blur-md px-3 py-2 rounded-xl text-xs flex items-center gap-2 border border-white/10"
      >
        <i class="fa-solid fa-map-marker-alt text-[#06D6A0]"></i>
        <span>{{ formattedLocation }}</span>
      </div>
    </section>

    <!-- CUERPO PRINCIPAL -->
    <section class="container mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-10">
      <!-- IZQUIERDA -->
      <div class="flex-1">
        <!-- RESUMEN -->
        <h2 class="text-xl md:text-2xl font-semibold mb-3">Resumen operativo</h2>
        <p class="text-[#B0BEC5] mb-6 text-sm md:text-base">
          {{ formattedSubtitle }}
        </p>

        <!-- HIGHLIGHTS -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-sm">
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <p class="text-xs text-[#78909C] uppercase">Operación</p>
            <p class="font-semibold">{{ formattedType }}</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <p class="text-xs text-[#78909C] uppercase">Superficie</p>
            <p class="font-semibold">{{ space.capacity_m2 }} m²</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <p class="text-xs text-[#78909C] uppercase">Altura útil</p>
            <p class="font-semibold">{{ space.height_m || '—' }} m</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <p class="text-xs text-[#78909C] uppercase">Infraestructura</p>
            <p class="font-semibold">
              {{ space.has_loading_dock ? 'Muelle de carga' : 'Sin muelle' }}
            </p>
          </div>
        </div>

        <!-- ESPECIFICACIONES TÉCNICAS -->
        <h3 class="text-lg font-semibold mb-3 border-l-4 border-[#06D6A0] pl-3">
          Especificaciones técnicas
        </h3>

        <ul class="grid md:grid-cols-2 gap-3 text-sm bg-white/5 rounded-2xl p-4 border border-white/10">
          <li>
            <strong>Seguridad:</strong>
            {{ space.has_security ? '24/7' : 'A coordinar' }}
          </li>
          <li>
            <strong>Muelle carga:</strong>
            {{ space.has_loading_dock ? 'Sí' : 'No' }}
          </li>
          <li>
            <strong>Cadena de frío:</strong>
            {{ space.has_cold_chain ? 'Disponible' : 'No' }}
          </li>
          <li>
            <strong>Energía trifásica:</strong>
            {{ space.energy_3phase ? 'Sí' : 'No' }}
          </li>
        </ul>

        <!-- DISPONIBILIDAD VISUAL -->
        <div class="mt-10">
          <h3 class="text-lg font-semibold mb-2">Disponibilidad real</h3>

          <div class="text-sm text-[#B0BEC5]">
            <p v-if="availability?.status === 'available'" class="text-[#06D6A0] font-semibold">
              Disponible hoy
            </p>
            <p v-else-if="availability?.status === 'busy'" class="text-[#FFD166] font-semibold">
              Alta ocupación · Consultar
            </p>
            <p v-else>
              Datos no disponibles
            </p>
          </div>
        </div>
      </div>

      <!-- PANEL DERECHO -->
      <div
        class="md:w-80 bg-[#1B263B]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8"
      >
        <h4 class="text-lg font-semibold text-center mb-4">Reserva este espacio</h4>

        <div class="text-center mb-4">
          <div class="text-4xl font-bold text-[#00B4D8]">
            {{ space.price_per_unit ? `$${space.price_per_unit}` : 'A convenir' }}
          </div>
          <p class="text-xs text-[#B0BEC5]">
            {{ space.price_per_unit ? `por ${space.pricing_unit}` : 'Consultar valor' }}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 mb-3 text-xs text-[#B0BEC5]">
          <i class="fa-solid fa-circle-check text-[#06D6A0]"></i>
          <span>Propietario verificado</span>
        </div>

        <button
          @click="goToReservation(space.slug)"
          class="w-full mt-4 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          Solicitar reserva
        </button>

        <p class="text-center text-xs text-[#78909C] mt-4">
          Respuesta estimada: 24-48 hs hábiles
        </p>
      </div>
    </section>

    <!-- MAPA -->
    <section class="px-6 md:px-12 pb-16">
      <h3 class="text-lg font-semibold border-l-4 border-[#06D6A0] pl-3 mb-3">Ubicación y conectividad</h3>

      <div class="rounded-2xl overflow-hidden border border-white/10 shadow-lg h-[320px] md:h-[360px]">
        <CustomGoogleMap :center="mapCenter" :zoom="15">
          <GMapMarker
            :position="mapCenter"
            :options="{
              title: space.name,
              icon: {
                url: mapIcon,
                scaledSize: { width: 48, height: 48 }
              }
            }"
          />
        </CustomGoogleMap>
      </div>
    </section>

    <footer-final />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import logo from '../assets/logo.png'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import MainHeader from '../components/layout/header/MainHeader.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import { useIndustrialStore } from '../store/industrialStore'
import { useIndustrialAvailabilityStore } from '../store/industrialAvailability'

const route = useRoute()
const router = useRouter()

const industrialStore = useIndustrialStore()
const availabilityStore = useIndustrialAvailabilityStore()

const loading = ref(true)
const notFound = ref(false)

const space = computed(() => industrialStore.selectedSpace)
const availability = computed(() => availabilityStore.availability)

const mapIcon = new URL('../assets/logo.png', import.meta.url).href

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/assets/industrial_cover.jpg'
}

const galleryImages = computed(() => {
  const raw = space.value?.images
  if (!raw) return ['/assets/industrial_cover.jpg']

  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (Array.isArray(arr) && arr.length) return arr
    return ['/assets/industrial_cover.jpg']
  } catch {
    return ['/assets/industrial_cover.jpg']
  }
})

const formattedType = computed(() => {
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio Logístico',
    cold_storage: 'Cámara Fría',
    logistics: 'Centro Logístico'
  }
  const key = space.value?.subcategory as string | undefined
  return key ? map[key] || 'Espacio industrial' : 'Espacio industrial'
})

const formattedLocation = computed(
  () => space.value?.location || 'Ubicación en parque industrial'
)

const formattedSubtitle = computed(() =>
  space.value?.suitable_for ||
  'Infraestructura preparada para almacenamiento, logística y distribución.'
)

const mapCenter = computed(() => {
  const lat = Number(space.value?.latitude)
  const lng = Number(space.value?.longitude)
  if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  return { lat: -26.8109807, lng: -65.1686014 }
})

onMounted(async () => {
  const slug = route.params.slug as string

  try {
    await industrialStore.fetchSpaceBySlug(slug)

    if (!space.value) {
      notFound.value = true
      loading.value = false
      return
    }

    await availabilityStore.fetchAvailability(space.value.id)
  } catch (err) {
    console.error('Error al cargar espacio industrial:', err)
    notFound.value = true
  } finally {
    loading.value = false
  }
})

function goToReservation(slug: string) {
  router.push(`/industrial/${slug}/industrial-reservation`)
}

function shareSpace() {
  if (!space.value) return

  const url = window.location.href
  if (navigator.share) {
    navigator.share({
      title: `HayLugar — ${space.value.name}`,
      text: 'Espacio industrial publicado en HayLugar.',
      url
    })
  } else {
    navigator.clipboard.writeText(url)
    alert('Enlace copiado')
  }
}
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #00b4d8;
  filter: drop-shadow(0 0 4px rgba(0, 180, 216, 0.4));
}

.swiper-pagination-bullet {
  background-color: #06d6a0 !important;
  opacity: 0.7;
}

.swiper-pagination-bullet-active {
  background-color: #00b4d8 !important;
  opacity: 1;
}
</style>
