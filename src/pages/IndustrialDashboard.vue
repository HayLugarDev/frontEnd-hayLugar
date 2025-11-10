<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">
    <!-- ===== HEADER ===== -->
    <header class="relative z-10 px-6 py-8 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
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
        poster="/assets/industrial_cover.jpg"
        class="absolute inset-0 w-full h-full object-cover brightness-75"
      ></video>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent"></div>
      <div class="relative z-10 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          Espacios Logísticos en Red
        </h2>
        <p class="text-[#B0BEC5] font-light max-w-2xl mx-auto">
          Almacená, transportá y optimizá tus operaciones con inteligencia urbana HayLugar.
        </p>
      </div>
    </section>

    <!-- ===== FILTROS ===== -->
    <section class="container mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center gap-4 justify-center">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Buscar por ciudad o nombre..."
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
      />
      <select
        v-model="filters.type"
        class="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 w-full md:w-48"
      >
        <option value="">Todos los tipos</option>
        <option value="warehouse">Depósito</option>
        <option value="dock">Dársena</option>
        <option value="yard">Patio Logístico</option>
        <option value="cold_storage">Cámara Fría</option>
      </select>
      <button
        @click="fetchSpaces"
        class="bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 transition-all"
      >
        Buscar
      </button>
    </section>

    <!-- ===== LISTA DE ESPACIOS ===== -->
    <section
      v-if="spaces.length"
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
              :src="space.image_url || '/assets/warehouse_default.jpg'"
              :alt="space.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent"></div>
            <div class="absolute bottom-3 left-3">
              <span class="bg-[#06D6A0]/20 px-3 py-1 rounded-full font-medium uppercase text-xs tracking-wider">
                {{ formatType(space.subcategory) }}
              </span>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-2">
            <h3 class="text-xl font-semibold leading-tight">{{ space.name }}</h3>
            <p class="text-[#B0BEC5] text-sm">
              {{ space.city }}, {{ space.admin1 }}
            </p>
            <div class="flex justify-between mt-2 text-sm">
              <span>{{ space.capacity_m2 }} m²</span>
              <span class="text-[#00B4D8] font-semibold">${{ space.price_per_day }}/día</span>
            </div>
            <button
              @click="goToDetail(space.id)"
              class="mt-4 bg-[#00B4D8] hover:bg-[#06D6A0] text-dark font-semibold rounded-xl px-4 py-2 transition-all text-sm"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </transition-group>
    </section>

    <div v-else class="text-center py-20 text-[#B0BEC5]">
      <p>No se encontraron espacios logísticos.</p>
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="text-center text-[#B0BEC5] text-sm py-8 border-t border-white/10">
      © {{ new Date().getFullYear() }} HayLugar — Logística Inteligente
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logo from '../assets/logo.png'
import api from '../services/apiService'
import { useRouter } from 'vue-router'

const router = useRouter()
const spaces = ref<any[]>([])
const filters = ref({ search: '', type: '' })

const fetchSpaces = async () => {
  try {
    const res = await api.get('/spaces', {
      params: { category: 'industrial', search: filters.value.search, type: filters.value.type },
    })
    spaces.value = res.data.items || []
  } catch (err) {
    console.error('Error cargando espacios industriales:', err)
  }
}

onMounted(fetchSpaces)

function formatType(type: string) {
  const map: Record<string, string> = {
    warehouse: 'Depósito',
    dock: 'Dársena',
    yard: 'Patio',
    cold_storage: 'Refrigerado',
    logistics: 'Logística',
  }
  return map[type] || 'Industrial'
}

function goToDetail(id: number) {
  router.push({ name: 'IndustrialDetail', params: { id } })
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
