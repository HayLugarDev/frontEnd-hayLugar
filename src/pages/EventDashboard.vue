<template>

  <MainHeader />

  <!-- BOTÓN ATRÁS MOBILE -->
  <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">

    <!-- SAFE AREA -->
    <div class="safe-top"></div>

    <!-- CONTENIDO REAL -->
    <div class="px-6 py-3 sm:py-4 xl:px-16
           flex items-center justify-between gap-6 text-white">

      <BackButton />
    </div>
  </div>

  <!-- MENÚ INFERIOR MOBILE -->
  <MobileButtonNav @navigate="(path) => router.push(path)" class="md:hidden" :showMap="false" />

  <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white overflow-hidden">
    <header class="relative z-10 px-6 pt-16 py-4 md:p-8 md:px-12 flex items-center justify-between md:hidden">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="HayLugar" class="h-10 w-10 md:hidden" />
        <h1 class="text-2xl md:text-3xl font-semibold tracking-wide">Eventos Inteligentes</h1>
      </div>
      <button
        class="hidden md:flex items-center gap-2 bg-newgreen/20 hover:bg-newgreen/30 px-4 py-2 rounded-xl transition-all">
        <i class="fa-solid fa-leaf text-newgreen"></i>
        <span class="text-sm font-medium">Impacto sustentable</span>
      </button>
    </header>

    <!-- ===== HERO ===== -->
    <section class="relative w-full h-[240px] md:h-[360px] overflow-hidden flex items-center justify-center pt-10">
      <video autoplay muted loop playsinline poster="/assets/events.png"
        class="absolute inset-0 w-full h-full object-cover brightness-75">

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
    <section class="relative z-20 container mx-auto px-6 md:px-12 py-12
         flex md:grid gap-6 
         overflow-x-auto md:overflow-visible
         snap-x snap-mandatory md:snap-none 
         scrollbar-hide
         md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      <div v-for="event in events" :key="event.id" class="group flex-shrink-0 md:flex-shrink bg-[#1B263B]/70 backdrop-blur-md 
         rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl
         transition-all duration-300 transform hover:-translate-y-2 
         border border-white/5 snap-start w-[260px] sm:w-[280px] md:w-full">

        <div class="relative h-52 overflow-hidden">
          <img :src="event.banner_url || '/assets/fallback.jpg'" :alt="event.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent"></div>
          <div class="absolute bottom-3 left-3 text-sm text-white">
            <span class="bg-newgreen/20 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
              {{ formatType(event.type) }}
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col gap-3">
          <h3 class="text-xl font-semibold leading-tight">{{ event.name }}</h3>
          <p class="text-[#B0BEC5] text-sm">{{ formatDateRange(event.start_date, event.end_date) }}</p>

          <div class="flex items-center justify-between mt-2">
            <span class="text-newgreen text-sm font-medium">Zonas disponibles</span>
            <span class="text-[#00B4D8] text-xs uppercase tracking-wide">Activa</span>
          </div>

          <button @click="goToDetail(event.id)"
            class="mt-4 bg-[#00B4D8] hover:bg-newgreen text-dark font-semibold rounded-xl px-4 py-2 transition-all text-sm">
            Ver más
          </button>
        </div>
      </div>

    </section>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listEvents, EventItem } from '../services/eventService';
import logo from '../assets/logo.png';
import { useRouter } from 'vue-router';
import MobileButtonNav from '../components/layout/MobileButtonNav.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';
import BackButton from '../components/common/BackButton.vue';

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
