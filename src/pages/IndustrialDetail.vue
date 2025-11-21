<template>
  <div
    v-if="space"
    class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white flex flex-col"
  >
   <MainHeader class="hidden md:block" />
    <!-- ===== HEADER ===== -->
    <header
      class="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 bg-[#0D1B2A]/70 backdrop-blur-lg shadow-lg"
    >
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
        <div>
          <p class="text-sm text-[#B0BEC5]/70">Industrial · Tucumán</p>
          <h1 class="text-2xl md:text-3xl font-semibold tracking-wide">
            {{ space.name }}
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
          class="text-sm bg-[#06D6A0]/20 hover:bg-[#06D6A0]/40 px-4 py-2 rounded-xl transition-all duration-300"
        >
          ← Volver
        </button>
      </div>
    </header>

    <!-- ===== GALERÍA ===== -->
    <section class="relative w-full h-[260px] md:h-[440px] overflow-hidden">
      <Swiper
        :modules="[Navigation, Pagination, Autoplay]"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :navigation="true"
        class="w-full h-full"
      >
        <SwiperSlide
          v-for="(img, index) in (space.images || [])"
          :key="index"
          class="relative"
        >
          <img
            :src="img || '/assets/warehouse_default.jpg'"
            class="w-full h-full object-cover"
            :alt="`Imagen ${index + 1} de ${space.name}`"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-transparent"></div>
        </SwiperSlide>
      </Swiper>

      <div
        class="absolute bottom-6 left-6 bg-[#1B263B]/70 backdrop-blur-md px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-white/10"
      >
        <i class="fa-solid fa-map-marker-alt text-[#06D6A0]"></i>
        <span>{{ space.location }}</span>
      </div>
    </section>

    <!-- ===== CONTENIDO PRINCIPAL ===== -->
    <section class="container mx-auto px-6 md:px-12 py-10">
      <div class="flex flex-col md:flex-row justify-between items-start gap-10">
        <!-- ===== INFO IZQUIERDA ===== -->
        <div class="flex-1">
          <!-- ⭐ rating -->
          <div class="flex items-center gap-1 mb-3 text-[#FFD166]">
            <i v-for="i in Math.round(space.average_rating || 0)" :key="i" class="fa-solid fa-star"></i>
            <i v-if="space.average_rating" class="text-[#B0BEC5] ml-2 text-sm">
              {{ space.average_rating.toFixed(1) }} / 5
            </i>
          </div>

          <!-- Título y subtítulo -->
          <h2 class="text-2xl md:text-3xl font-semibold mb-2">
            {{ space.name }}
          </h2>
          <p class="text-[#B0BEC5] text-sm md:text-base mb-6">
            {{ space.location_details || 'Ubicación estratégica para logística urbana y operaciones de carga.' }}
          </p>

          <!-- 🔹 Características principales -->
          <div
            class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[#B0BEC5] mb-6"
          >
            <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
              <i class="fa-solid fa-ruler-combined text-[#06D6A0]"></i>
              <span>{{ space.capacity_m2 ?? '—' }} m²</span>
            </div>
            <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
              <i class="fa-solid fa-up-down text-[#00B4D8]"></i>
              <span>{{ space.height_m ?? '—' }} m</span>
            </div>
            <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between capitalize">
              <i class="fa-solid fa-layer-group text-[#FFD166]"></i>
              <span>{{ formatType(space.subcategory) }}</span>
            </div>
          </div>

          <!-- 🔹 Descripción -->
          <p class="leading-relaxed text-[#CFD8DC] mb-8">
            {{ space.description || 'Espacio industrial preparado para almacenamiento, logística y distribución de última milla, con infraestructura moderna y adaptable a diversas necesidades operativas.' }}
          </p>

          <!-- 🔹 Especificaciones técnicas -->
          <h3 class="text-lg font-semibold mb-4 border-l-4 border-[#06D6A0] pl-3">
            Especificaciones Técnicas
          </h3>
          <ul class="grid md:grid-cols-2 gap-3 text-sm text-[#B0BEC5] bg-white/5 rounded-2xl p-4 border border-white/10">
            <li>
              <i :class="space.has_security ? 'fa-solid fa-shield-halved text-[#06D6A0]' : 'fa-solid fa-xmark text-red-400'"></i>
              <span class="ml-2">Seguridad 24 hs</span>
            </li>
            <li>
              <i :class="space.has_loading_dock ? 'fa-solid fa-truck-ramp-box text-[#06D6A0]' : 'fa-solid fa-xmark text-red-400'"></i>
              <span class="ml-2">Muelle de carga</span>
            </li>
            <li>
              <i :class="space.has_cold_chain ? 'fa-solid fa-snowflake text-[#06D6A0]' : 'fa-solid fa-xmark text-red-400'"></i>
              <span class="ml-2">Cadena de frío</span>
            </li>
            <li>
              <i :class="space.energy_3phase ? 'fa-solid fa-bolt text-[#06D6A0]' : 'fa-solid fa-xmark text-red-400'"></i>
              <span class="ml-2">Energía trifásica</span>
            </li>
          </ul>
        </div>

        <!-- ===== PANEL DERECHO ===== -->
        <div
          class="md:w-80 bg-[#1B263B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-8"
        >
          <h4 class="text-lg font-semibold mb-4 text-center">Reserva este espacio</h4>
          <p class="text-center text-4xl font-bold text-[#00B4D8] mb-1">
            ${{ space.price_per_unit ?? 'N/D' }}
          </p>
          <p class="text-center text-[#B0BEC5] mb-6">
            por {{ space.pricing_unit || 'día' }}
          </p>

          <label class="block text-xs uppercase tracking-wider text-[#B0BEC5] mb-1">Método de pago</label>
          <select
            class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8] outline-none"
            v-model="selectedPayment"
          >
            <option value="wallet">Billetera HayLugar</option>
            <option value="mercadopago">Mercado Pago</option>
          </select>

          <button
            @click="goToReservation(space.slug)"
            class="w-full mt-5 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] hover:opacity-90 text-[#0D1B2A] font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Reservar ahora
          </button>

          <p class="text-xs text-[#B0BEC5]/80 mt-4 text-center border-t border-white/10 pt-3">
            <i class="fa-solid fa-lock text-[#06D6A0]"></i> Pago seguro con HayLugar
          </p>
        </div>
      </div>
    </section>

    <!-- ===== MAPA ===== -->
    <section class="px-6 md:px-12 pb-16">
      <h3 class="text-lg font-semibold mb-4 border-l-4 border-[#06D6A0] pl-3">Ubicación</h3>
      <div class="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-[340px]">
        <CustomGoogleMap
          :center="{ lat: Number(space.latitude), lng: Number(space.longitude) }"
          :zoom="15"
          :options="{ disableDefaultUI: true, zoomControl: true }"
        >
          <GMapMarker
            :position="{ lat: Number(space.latitude), lng: Number(space.longitude) }"
            :options="{
              title: space.name,
              icon: { url: '/assets/logo.png', scaledSize: { width: 48, height: 48 } }
            }"
          />
        </CustomGoogleMap>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="text-center text-[#B0BEC5] text-sm py-8 border-t border-white/10">
      © {{ new Date().getFullYear() }} HayLugar — Logística Inteligente
    </footer>

    <!-- CTA sticky en mobile -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] text-[#0D1B2A] font-semibold text-center py-3 md:hidden"
      @click="goToReservation(space.slug)"
    >
      Reservar ahora
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-screen text-[#B0BEC5]">
    <p>Cargando datos del espacio...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import api from '../services/apiService'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import MainHeader from '../components/layout/header/MainHeader.vue'

const route = useRoute()
const router = useRouter()
const space = ref<any>(null)
const selectedPayment = ref('wallet')

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const res = await api.get(`/spaces/getbyslug/${slug}`)
    let imgs = res.data?.images
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs) } catch { imgs = [] }
    }
    space.value = { ...res.data, images: Array.isArray(imgs) ? imgs : [] }
    document.title = `${space.value.name} | HayLugar Industrial`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', `Espacio logístico en ${space.value.location} — ${space.value.capacity_m2 ?? '—'} m² disponibles.`)
  } catch (err) {
    console.error('Error al cargar el espacio industrial:', err)
  }
})

function formatType(type?: string) {
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio Logístico',
    cold_storage: 'Cámara Fría',
    logistics: 'Centro Logístico',
  }
  return type ? (map[type] || 'Industrial') : 'Industrial'
}

function goToReservation(slug: string) {
  router.push(`/industrial/${slug}/industrial-reservation/`)
}

function shareSpace() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({
      title: `HayLugar — ${space.value.name}`,
      text: `Encontrá este espacio logístico en HayLugar`,
      url
    })
  } else {
    navigator.clipboard.writeText(url)
    alert('🔗 Enlace copiado al portapapeles')
  }
}
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #00b4d8;
  filter: drop-shadow(0 0 4px rgba(0, 180, 216, 0.5));
}
.swiper-pagination-bullet {
  background-color: #06d6a0 !important;
  opacity: 0.8;
}
.swiper-pagination-bullet-active {
  background-color: #00b4d8 !important;
  opacity: 1;
}
</style>
