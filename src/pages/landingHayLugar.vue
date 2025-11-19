<template>
  <div class="min-h-screen bg-dark text-white selection:bg-accent/30 selection:text-white">

    <!-- ============================ HERO ============================ -->
    <section class="relative overflow-hidden pt-28 pb-32 bg-gradient-to-br from-primary via-primary/80 to-dark">
      <div aria-hidden class="pointer-events-none absolute inset-0 -z-10">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>

      <div class="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        <!-- IZQUIERDA -->
        <div>
          <div class="flex items-center gap-4">
            <img :src="logo" alt="HayLugar" class="h-20 w-20 md:h-28 md:w-28 drop-shadow-xl" />
            <h1 class="font-extrabold tracking-tight leading-[0.9] text-5xl md:text-6xl xl:text-7xl">
              Movilidad inteligente para un país en movimiento.
            </h1>
          </div>

          <p class="mt-6 text-xl text-white/90 leading-relaxed max-w-2xl">
            HayLugar es la plataforma argentina que integra estacionamientos de <span class="font-bold text-accent">eventos, universidades, industria, calles medidas, playas y cocheras particulares</span> en un único ecosistema en tiempo real.  
            Tecnología local con impacto urbano real.
          </p>

          <!-- BOTONES -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
            <button class="btn btn--accent" @click="goTo('/dashboard')">
              Ver espacios disponibles
            </button>
            <button class="btn btn--ghost" @click="goTo('/login')">
              Compartir mi espacio
            </button>
          </div>

          <!-- BADGES -->
          <div class="mt-6 flex flex-wrap gap-3">
            <span class="badge bg-emerald-500">Pagos seguros</span>
            <span class="badge bg-accent">100% argentino</span>
            <span class="badge bg-blue-500">Usuarios verificados</span>
            <span class="badge bg-amber-500">Soporte real</span>
          </div>
        </div>

        <!-- DERECHA — MAPA VISUAL -->
        <div class="relative">
          <div class="mapCard group">
            <h3 class="h3">Ecosistema HayLugar</h3>
            <p class="text-sm text-white/70">Visualización conceptual</p>

            <div class="mapContainer mt-6">
              <img :src="mapaVisual" alt="Mapa conceptual" class="mapImage" />
            </div>

            <p class="mt-4 text-xs text-white/80">
              * Mapa conceptual del ecosistema: eventos, industria, universidades, calles y playas.
            </p>

          </div>
        </div>
      </div>
    </section>

    <!-- ============================ SECCION VERTICALES ============================ -->
    <section class="py-24 bg-dark/90">
      <div class="container mx-auto px-6">
        <h2 class="text-center text-4xl font-bold mb-4">Un solo país. Muchas realidades.</h2>
        <p class="text-center text-white/70 max-w-2xl mx-auto">
          Cada vertical de HayLugar responde a un problema real de movilidad.  
          Todo en un mismo ecosistema.
        </p>

        <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- EVENTOS -->
          <div class="verticalCard">
            <img :src="imgEventos" class="verticalImg" alt="Eventos">
            <h3 class="verticalTitle">Eventos Masivos</h3>
            <p class="verticalDesc">Festivales, recitales y estadios con estacionamientos organizados y precios claros.</p>
          </div>

          <!-- INDUSTRIAL -->
          <div class="verticalCard">
            <img :src="imgIndustrial" class="verticalImg" alt="Industrial">
            <h3 class="verticalTitle">Parques Industriales</h3>
            <p class="verticalDesc">Gestión de flotas, accesos, turnos y espacios logísticos internos.</p>
          </div>

          <!-- UNIVERSIDADES -->
          <div class="verticalCard">
            <img :src="imgUniversidades" class="verticalImg" alt="Universidades">
            <h3 class="verticalTitle">Universidades</h3>
            <p class="verticalDesc">Acceso por legajo, capacidad en tiempo real y movilidad estudiantil ordenada.</p>
          </div>

          <!-- MEDIDO -->
          <div class="verticalCard">
            <img :src="imgMedido" class="verticalImg" alt="Medido">
            <h3 class="verticalTitle">Estacionamiento Medido</h3>
            <p class="verticalDesc">Calles con disponibilidad real y pagos integrados en segundos.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================ COMO FUNCIONA ============================ -->
    <section class="py-24 bg-white text-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">¿Cómo funciona?</h2>
        <p class="text-center text-gray-600 mt-2">Una única lógica, múltiples verticales.</p>

        <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div v-for="(p, i) in pasos" :key="i" class="card-step">
            <div class="step-number">{{ i + 1 }}</div>
            <h4 class="title">{{ p.title }}</h4>
            <p class="desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ TESTIMONIOS ============================ -->
    <section class="py-24 bg-gray-100 text-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">Historias reales.</h2>
        <p class="text-center text-gray-600 mt-2">Impacto real en ciudades reales.</p>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(t, i) in testimonios" :key="i" class="testimonial-card">
            <p class="text-gray-700 italic leading-relaxed">“{{ t.text }}”</p>
            <div class="flex items-center gap-3 mt-4">
              <p class="font-semibold text-gray-900">{{ t.name }}</p>
              <p class="text-sm text-gray-600">{{ t.city }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ CTA FINAL ============================ -->
    <section class="py-20 bg-gradient-to-br from-primary via-primary/80 to-dark text-white">
      <div class="container mx-auto px-6 text-center max-w-3xl">
        <h3 class="text-4xl font-bold">
          Estacionar nunca fue tan simple.  
          Compartir nunca fue tan útil.
        </h3>

        <p class="mt-4 text-white/90">
          Sumate a la movilidad inteligente de Argentina: más eficiente, más humana, más conectada.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button class="btn btn--accent" @click="goTo('/dashboard')">Explorar espacios</button>
          <button class="btn btn--ghost" @click="goTo('/login')">Ofrecer mi espacio</button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/10 bg-dark text-white/70">
      <div class="container mx-auto px-6 py-6 text-center text-sm">
        © {{ currentYear }} HayLugar · Movilidad inteligente — Argentina
      </div>
    </footer>

    <CookieBanner />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import CookieBanner from "../components/common/CookieBanner.vue";
import logo from "../assets/logo.png";


import mapaVisual from "../../assets/mapa-visual.png";

// Verticales
import imgEventos from "../../assets/industry.png";
import imgIndustrial from "../../assets/events.png";
import imgUniversidades from "../../assets/universidad.png";
import imgMedido from "../../assets/medido.png";

const router = useRouter();
const goTo = (path: string) => router.push(path);

const currentYear = computed(() => new Date().getFullYear());

const pasos = ref([
  { title: "Elegí tu espacio", desc: "Eventos, calles, universidades, industria o cocheras privadas." },
  { title: "Reservá al instante", desc: "Pagos seguros con tarjeta, QR o saldo HayLugar." },
  { title: "Accedé sin demoras", desc: "Códigos, QR o acceso directo según vertical." },
  { title: "Generá ingresos", desc: "Compartí tu lugar cuando no lo usás." },
]);

const testimonios = ref([
  { text: "En los recitales perdíamos una hora estacionando. HayLugar ordenó todo.", name: "Martín S.", city: "Córdoba" },
  { text: "En mi parque industrial ahora los camiones entran con turnos y todo fluye.", name: "Valeria G.", city: "Tucumán" },
  { text: "Soy estudiante y por fin consigo lugar en el campus sin dar vueltas.", name: "Luisa P.", city: "Salta" },
]);
</script>

<style scoped>
/* Buttons */
.btn {
  @apply inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-all duration-200;
}
.btn--ghost {
  @apply bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:shadow;
}
.btn--accent {
  @apply bg-accent text-white hover:bg-accent/90 hover:shadow-lg;
}
.badge {
  @apply text-xs font-semibold uppercase rounded-full px-3 py-1 shadow-sm;
}

/* Map */
.mapCard {
  @apply rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-xl border border-white/10 transition transform;
}
.mapContainer {
  @apply rounded-xl overflow-hidden bg-black/20 p-3 shadow-md;
}
.mapImage {
  @apply w-full h-full object-cover rounded-xl drop-shadow-lg;
}

/* Vertical cards */
.verticalCard {
  @apply bg-white/5 rounded-2xl p-5 shadow-lg border border-white/10 hover:border-accent/60 hover:shadow-xl transition;
}
.verticalImg {
  @apply rounded-xl mb-4 w-full h-40 object-cover;
}
.verticalTitle {
  @apply text-xl font-bold mb-2;
}
.verticalDesc {
  @apply text-white/70;
}

/* Steps */
.card-step {
  @apply bg-white rounded-2xl p-6 shadow-md text-center ring-1 ring-gray-100;
}
.step-number {
  @apply h-12 w-12 mx-auto mb-3 rounded-full bg-accent/10 text-accent font-bold grid place-items-center text-lg;
}
.title {
  @apply font-bold text-gray-900 mb-1;
}
.desc {
  @apply text-gray-700;
}

/* Testimonials */
.testimonial-card {
  @apply bg-white rounded-2xl p-6 shadow ring-1 ring-gray-100 hover:shadow-lg transition;
}

/* Halos */
.halo {
  @apply absolute rounded-full blur-3xl;
  animation: float 12s ease-in-out infinite;
}
.halo--lg {
  @apply -right-40 -top-40 h-[28rem] w-[28rem] bg-white/10;
}
.halo--sm {
  @apply -left-32 -bottom-40 h-[26rem] w-[26rem] bg-accent/20;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(12px); }
}
</style>
