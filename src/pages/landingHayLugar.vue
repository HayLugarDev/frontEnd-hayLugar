<template>
  <div class="min-h-screen bg-[#020617] text-white selection:bg-accent/30 selection:text-white">
 <MainHeader class="hidden md:block" />
    <!-- ============================ HERO OSCURO ============================ -->
    <section class="relative overflow-hidden pt-10 pb-28 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#020617]">
      <!-- Halos -->
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>
      
      <div class="container mx-auto px-6 grid lg:grid-cols-2">

       
        <div>
            
          <div class="flex items-center gap-4 mb-4">
          
            <h1
              class="font-extrabold tracking-tight leading-[0.9] text-4xl md:text-6xl xl:text-7xl">
              Movilidad inteligente para un país en movimiento.
            </h1>
          </div>

          <p class="mt-4 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
            HayLugar conecta <span class="font-semibold text-accent">eventos, universidades, industria, estacionamiento medido, playas y cocheras particulares</span>
            en un mismo ecosistema de estacionamiento en tiempo real.  
            Una solución pensada y desarrollada en Argentina para ordenar la ciudad y activar la microeconomía urbana.
          </p>

          <!-- BOTONES -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <button
              class="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold
                     bg-white/10 text-white border border-white/30
                     hover:bg-white/15 hover:shadow-md transition-all duration-200"
              @click="goTo('/dashboard')"
            >
              Ver espacios disponibles
            </button>

            <button
              class="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold
                     bg-white/10 text-white border border-white/30
                     hover:bg-white/15 hover:shadow-md transition-all duration-200"
              @click="goTo('/login')"
            >
              Compartir mi espacio
            </button>
          </div>

          <!-- BADGES -->
          <div class="mt-6 flex flex-wrap gap-3">
            <span class="text-[0.7rem] font-semibold uppercase rounded-full px-3 py-1 shadow-sm bg-white/10">
              Pagos seguros
            </span>
            <span class="text-[0.7rem] font-semibold uppercase rounded-full px-3 py-1 shadow-sm bg-white/10">
              100% argentino
            </span>
            <span class="text-[0.7rem] font-semibold uppercase rounded-full px-3 py-1 shadow-sm bg-white/10">
              Usuarios verificados
            </span>
            <span class="text-[0.7rem] font-semibold uppercase rounded-full px-3 py-1 shadow-sm bg-white/10">
              Soporte humano
            </span>
          </div>
        </div>

        <!-- DERECHA — MAPA VISUAL / ECOSISTEMA -->
        <div class="relative">
          <div
            class="rounded-2xl bg-white/5 backdrop-blur-xl p-6 md:p-7 lg:p-8
                   shadow-[0_18px_60px_rgba(0,0,0,0.45)] border border-white/15
                   transition-transform duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <h3 class="text-lg md:text-xl font-semibold">
                  Ecosistema HayLugar
                </h3>
                <p class="text-xs text-white/70">
                  Eventos · Universidades · Industria · Calles medidas · Playas
                </p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase
                       bg-white/10 text-white border border-white/40"
              >
                Tiempo real
              </span>
            </div>

            <div class="mt-5 rounded-2xl overflow-hidden bg-black/40 shadow-lg ring-1 ring-white/15">
              <img
                :src="mapaVisual"
                alt="Mapa conceptual HayLugar"
                class="w-full h-full object-cover"
              />
            </div>

            <p class="mt-3 text-[0.7rem] text-white/70">
              Recitales, campus, zonas industriales,
              estacionamiento medido, playas y cocheras privadas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ SECCIÓN VERTICALES ============================ -->
    <section class="py-20 md:py-24 bg-white text-[#0F172A]">
      <div class="container mx-auto px-6">
        <h2 class="text-center text-3xl md:text-4xl font-bold mb-3">
          Un solo país. Múltiples formas de estacionar.
        </h2>
        <p class="text-center text-[#64748B] max-w-2xl mx-auto">
          HayLugar se adapta a la realidad de cada ciudad, barrio y punto clave del país.
        </p>

        <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- EVENTOS -->
          <div
            class="bg-white rounded-2xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)]
                   border border-[#E2E8F0] hover:shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                   transition-all duration-200"
          >
            <img :src="imgEventos" alt="Eventos" class="w-full h-40 object-cover rounded-xl mb-4" />
            <h3 class="text-lg font-semibold mb-1">Eventos masivos</h3>
            <p class="text-sm text-[#64748B]">
              Recitales, festivales y estadios con estacionamiento organizado y señalizado, sin caos en los accesos.
            </p>
          </div>

          <!-- INDUSTRIAL -->
          <div
            class="bg-white rounded-2xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)]
                   border border-[#E2E8F0] hover:shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                   transition-all duration-200"
          >
            <img :src="imgIndustrial" alt="Parques industriales" class="w-full h-40 object-cover rounded-xl mb-4" />
            <h3 class="text-lg font-semibold mb-1">Parques industriales</h3>
            <p class="text-sm text-[#64748B]">
              Turnos para camiones, accesos por sectores y visibilidad de dársenas y patios logísticos.
            </p>
          </div>

          <!-- UNIVERSIDADES -->
          <div
            class="bg-white rounded-2xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)]
                   border border-[#E2E8F0] hover:shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                   transition-all duration-200"
          >
            <img :src="imgUniversidades" alt="Universidades" class="w-full h-40 object-cover rounded-xl mb-4" />
            <h3 class="text-lg font-semibold mb-1">Universidades</h3>
            <p class="text-sm text-[#64748B]">
              Acceso por legajo, zonas diferenciadas para docentes y estudiantes y capacidad en tiempo real.
            </p>
          </div>

          <!-- MEDIDO -->
          <div
            class="bg-white rounded-2xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.09)]
                   border border-[#E2E8F0] hover:shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                   transition-all duration-200"
          >
            <img :src="imgMedido" alt="Estacionamiento medido" class="w-full h-40 object-cover rounded-xl mb-4" />
            <h3 class="text-lg font-semibold mb-1">Estacionamiento medido</h3>
            <p class="text-sm text-[#64748B]">
              Calles ordenadas, disponibilidad visible y pagos en segundos con QR o tarjeta.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ ¿CÓMO FUNCIONA? ============================ -->
    <section class="py-20 md:py-24 bg-[#F8FAFC] text-[#0F172A]">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">
          ¿Cómo funciona HayLugar?
        </h2>
        <p class="text-center text-[#64748B] mt-2">
          La misma lógica inteligente, aplicada a cada vertical.
        </p>

        <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(p, i) in pasos"
            :key="i"
            class="bg-white rounded-2xl p-6 shadow-md ring-1 ring-[#E2E8F0] text-center
                   hover:shadow-lg transition-all duration-200"
          >
            <div
              class="h-12 w-12 mx-auto mb-3 rounded-full bg-accent/10 text-accent font-bold
                     flex items-center justify-center text-lg"
            >
              {{ i + 1 }}
            </div>
            <h4 class="font-semibold text-[#0F172A] mb-1">
              {{ p.title }}
            </h4>
            <p class="text-sm text-[#64748B]">
              {{ p.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ TESTIMONIOS ============================ -->
    <section class="py-20 md:py-24 bg-white text-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">
          Historias reales. Impacto real.
        </h2>
        <p class="text-center text-gray-600 mt-2">
          Lo que pasó cuando la gente empezó a usar HayLugar en serio.
        </p>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(t, i) in testimonios"
            :key="i"
            class="bg-white rounded-2xl p-6 shadow-md ring-1 ring-[#E2E8F0]
                   hover:shadow-lg transition-all duration-200"
          >
            <p class="text-gray-700 italic leading-relaxed">
              “{{ t.text }}”
            </p>
            <div class="flex items-center gap-3 mt-4">
              <div>
                <p class="font-semibold text-gray-900">
                  {{ t.name }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ t.city }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ CTA FINAL ============================ -->
    <section class="py-20 bg-gradient-to-br from-white via-[#E2E8F0] to-white text-[#0F172A]">
      <div class="container mx-auto px-6 text-center max-w-3xl">
        <h3 class="text-3xl md:text-4xl font-bold">
          Estacionar nunca fue tan simple.  
          Compartir nunca fue tan útil.
        </h3>

        <p class="mt-4 text-[#64748B]">
          Sumate a una red que nace en Argentina para ordenar el tránsito, reducir vueltas innecesarias
          y crear una nueva microeconomía urbana.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold
                   bg-accent text-white hover:bg-accent/90 shadow-xl hover:shadow-2xl
                   transition-all duration-200"
            @click="goTo('/dashboard')"
          >
            Explorar espacios
          </button>
          <button
            class="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold
                   bg-white text-[#0F172A] border border-gray-300 hover:bg-white/80 hover:shadow-md
                   transition-all duration-200"
            @click="goTo('/login')"
          >
            Ofrecer mi espacio
          </button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-gray-200 bg-white text-gray-600">
      <div class="container mx-auto px-6 py-6 text-center text-sm">
        © {{ currentYear }} HayLugar · Movilidad inteligente — Argentina
      </div>
    </footer>

    <CookieBanner />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import MainHeader from '../components/layout/header/MainHeader.vue';
import CookieBanner from "../components/common/CookieBanner.vue";
import Logo from '../components/layout/Logo.vue';

// Mapa ilustrado conceptual
import mapaVisual from "../../assets/mapa-visual.png";

// Verticales
import imgEventos from "../../assets/events.png";
import imgIndustrial from "../../assets/industry.png";
import imgUniversidades from "../../assets/universidad.png";
import imgMedido from "../../assets/medido.png";

const router = useRouter();
const goTo = (path) => router.push(path);

const currentYear = computed(() => new Date().getFullYear());

const pasos = ref([
  {
    title: "Elegí tu espacio",
    desc: "Eventos, calles, universidades, industria, playas o cocheras privadas."
  },
  {
    title: "Reservá al instante",
    desc: "Pagos seguros con tarjeta, QR o saldo en la app."
  },
  {
    title: "Accedé sin vueltas",
    desc: "QR, código, legajo o flujo definido según la vertical."
  },
  {
    title: "Generá ingresos",
    desc: "Si tenés lugar libre, compartilo y cobrás desde tu ciudad."
  }
]);

const testimonios = ref([
  {
    text: "En los recitales tardábamos más en estacionar que en entrar. Con HayLugar se ordenó todo el acceso.",
    name: "Martín S.",
    city: "Córdoba"
  },
  {
    text: "En el parque industrial ahora los camiones tienen turnos y los accesos son mucho más fluidos.",
    name: "Valeria G.",
    city: "Tucumán"
  },
  {
    text: "En la universidad por fin consigo lugar sin dar mil vueltas alrededor del campus.",
    name: "Luisa P.",
    city: "Salta"
  }
]);
</script>

<style scoped>
.halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.75;
  animation: float 14s ease-in-out infinite;
}
.halo--lg {
  right: -11rem;
  top: -8rem;
  width: 28rem;
  height: 28rem;
  background: rgba(59, 130, 246, 0.4);
}
.halo--sm {
  left: -8rem;
  bottom: -10rem;
  width: 26rem;
  height: 26rem;
  background: rgba(45, 212, 191, 0.5);
}
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
}
</style>
