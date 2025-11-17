<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">
    <!-- ===== HEADER ===== -->
    <header class="relative z-10 px-6 py-8 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10" />
        <h1 class="text-2xl md:text-3xl font-semibold tracking-wide">Eventos Inteligentes</h1>
      </div>
      <button
        class="hidden md:flex items-center gap-2 bg-[#06D6A0]/20 hover:bg-[#06D6A0]/30 px-4 py-2 rounded-xl transition-all"
      >
        <i class="fa-solid fa-leaf text-[#06D6A0]"></i>
        <span class="text-sm font-medium">Impacto sustentable</span>
      </button>
    </header>

    <!-- ===== HERO ===== -->
    <section
      class="relative w-full h-[240px] md:h-[360px] overflow-hidden flex items-center justify-center"
    >
      <video
        autoplay
        muted
        loop
        playsinline
        poster="/assets/events.png"
        class="absolute inset-0 w-full h-full object-cover brightness-75"
      >
        
      </video>
      <div class="relative z-10 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">HayLugar Eventos</h2>
        <p class="text-3xl md:text-3xl font-bold mb-2 drop-shadow-lg">
          Tecnología + Sustentabilidad + Experiencia.  
          La red inteligente que transforma los eventos del país.
        </p>
      </div>
    </section>

    <!-- ===== LISTA DE EVENTOS ===== -->
    <section class="relative z-20 container mx-auto px-6 md:px-12 py-12 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      
        <div
  v-for="event in events"
  :key="event.id"
  class="group flex-shrink-0 w-[280px] md:w-[320px] bg-[#1B263B]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/5 snap-start"
>

          <div class="relative h-52 overflow-hidden">
            <img
              :src="event.banner_url || '/assets/fallback.jpg'"
              :alt="event.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent"></div>
            <div class="absolute bottom-3 left-3 text-sm text-white">
              <span class="bg-[#06D6A0]/20 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                {{ formatType(event.type) }}
              </span>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-3">
            <h3 class="text-xl font-semibold leading-tight">{{ event.name }}</h3>
            <p class="text-[#B0BEC5] text-sm">{{ formatDateRange(event.start_date, event.end_date) }}</p>

            <div class="flex items-center justify-between mt-2">
              <span class="text-[#06D6A0] text-sm font-medium">Zonas disponibles</span>
              <span class="text-[#00B4D8] text-xs uppercase tracking-wide">Activa</span>
            </div>

            <button
              @click="goToDetail(event.id)"
              class="mt-4 bg-[#00B4D8] hover:bg-[#06D6A0] text-dark font-semibold rounded-xl px-4 py-2 transition-all text-sm"
            >
              Ver más
            </button>
          </div>
        </div>
      
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="text-center text-[#B0BEC5] text-sm py-8">
      © {{ new Date().getFullYear() }} HayLugar — Movilidad Inteligente Argentina
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listEvents, EventItem } from '../services/eventService';
import logo from '../assets/logo.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const events = ref<EventItem[]>([]);

onMounted(async () => {
  try {
    const res = await listEvents();
    events.value = res.items;
  } catch (err) {
    console.error('Error cargando eventos:', err);
  }
});

function formatType(type: string) {
  const map: Record<string, string> = {
    festival: 'Festival',
    concert: 'Concierto',
    sports: 'Deportivo',
    fair: 'Feria',
    municipal: 'Municipal',
    university: 'Universitario',
    other: 'Evento',
  };
  return map[type] || 'Evento';
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  const e = new Date(end).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} – ${e}`;
}

function goToDetail(id: number) {
  router.push({ name: 'EventDetail', params: { id } });
}

</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
/* Oculta scrollbar en navegadores modernos */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

</style>
