<template>
  <div class="min-h-screen bg-[#0F172A] text-white selection:bg-accent/30 selection:text-white">

    <!-- ============================ HERO B2B ============================ -->
    <section class="relative overflow-hidden pt-32 pb-28 bg-gradient-to-br from-[#0D1B2A] via-[#1B2535] to-[#0A1220]">
      <!-- Decoración -->
      <div class="absolute inset-0 -z-10 opacity-40">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>

      <div class="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        <!-- IZQUIERDA -->
        <div>
          <div class="flex items-center gap-4 mb-5">
            <img :src="logo" class="h-20 w-20 drop-shadow-xl" alt="HayLugar" />
            <h1 class="text-5xl md:text-6xl font-extrabold leading-[0.9]">
              HayLugar for Business
            </h1>
          </div>

          <p class="text-white/85 text-xl max-w-2xl leading-relaxed">
            La plataforma argentina que moderniza la movilidad urbana, la gestión de estacionamientos
            y el acceso vehicular en entornos complejos: 
            <span class="text-accent font-semibold">municipios, universidades, parques industriales, eventos y empresas.</span>
          </p>

          <!-- CTA -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
            <button
              @click="contact"
              class="px-6 py-3 rounded-full bg-accent text-white font-semibold shadow-xl hover:bg-accent/90 transition-all"
            >
              Solicitar una demo
            </button>

            <button
              @click="goTo('/dashboard')"
              class="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/15 transition-all"
            >
              Ver plataforma
            </button>
          </div>
        </div>

        <!-- DERECHA: GRÁFICO -->
        <div
          class="rounded-2xl bg-white/5 backdrop-blur-xl p-6 shadow-xl border border-white/10 hover:-translate-y-1 transition"
        >
          <h3 class="text-lg font-semibold mb-2">Solución integral multivertical</h3>
          <p class="text-white/70 text-sm">
            Un ecosistema único: movilidad, acceso y estacionamiento en tiempo real.
          </p>

          <div class="mt-5 rounded-2xl overflow-hidden bg-black/30 shadow-lg ring-1 ring-white/15">
            <img :src="mapaVisual" class="w-full h-full object-cover" alt="Mapa verticales HayLugar" />
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ PROPUESTA DE VALOR ============================ -->
    <section class="py-20 md:py-24 bg-white text-[#0F172A]">
      <div class="container mx-auto px-6">

        <h2 class="text-center text-3xl md:text-4xl font-bold">
          Una infraestructura digital para tu ciudad, campus o industria.
        </h2>

        <p class="text-center text-[#64748B] max-w-3xl mx-auto mt-3">
          HayLugar es más que estacionamiento. Es una capa de inteligencia urbana que conecta espacios,
          regula accesos y optimiza la movilidad en tiempo real.
        </p>

        <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- MUNICIPIOS -->
          <div class="b2bCard">
            <img :src="imgMunicipios" class="b2bImg" alt="Municipios" />
            <h3 class="b2bTitle">Municipios</h3>
            <p class="b2bDesc">
              Estacionamiento medido inteligente, control de infracciones,
              analítica urbana, integraciones QR y ordenamiento vial en tiempo real.
            </p>
          </div>

          <!-- UNIVERSIDADES -->
          <div class="b2bCard">
            <img :src="imgUniversidades" class="b2bImg" alt="Universidades" />
            <h3 class="b2bTitle">Universidades</h3>
            <p class="b2bDesc">
              Acceso por legajo, zonas diferenciadas, panel de control,
              capacidad dinámica y visualización de sectores.
            </p>
          </div>

          <!-- INDUSTRIA -->
          <div class="b2bCard">
            <img :src="imgIndustrial" class="b2bImg" alt="Parques industriales" />
            <h3 class="b2bTitle">Parques Industriales</h3>
            <p class="b2bDesc">
              Turnos de camiones, dársenas, patios logísticos,
              accesos y seguridad perimetral desde un solo tablero.
            </p>
          </div>

          <!-- EVENTOS -->
          <div class="b2bCard">
            <img :src="imgEventos" class="b2bImg" alt="Eventos" />
            <h3 class="b2bTitle">Eventos Masivos</h3>
            <p class="b2bDesc">
              Recitales, festivales y estadios: precios claros,
              accesos guiados, reducción de caos vehicular y control total.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================ MÓDULOS ENTERPRISE ============================ -->
    <section class="py-20 md:py-24 bg-[#F8FAFC] text-[#0F172A]">
      <div class="container mx-auto px-6">

        <h2 class="text-center text-3xl md:text-4xl font-bold">
          Módulos listos para implementar
        </h2>
        <p class="text-center text-[#64748B] max-w-3xl mx-auto mt-2">
          Cada organización elige qué módulos necesita.
        </p>

        <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          <div class="moduleCard">
            <h4 class="moduleTitle">• Gestión de accesos</h4>
            <p class="moduleDesc">Flujos por QR, patentes, legajo o permisos especiales.</p>
          </div>

          <div class="moduleCard">
            <h4 class="moduleTitle">• Estacionamiento medido</h4>
            <p class="moduleDesc">Calles inteligentes con disponibilidad visible y pagos digitales.</p>
          </div>

          <div class="moduleCard">
            <h4 class="moduleTitle">• Analytics + Dashboard</h4>
            <p class="moduleDesc">Ocupación, ingresos, accesos, flujos y predicciones.</p>
          </div>

          <div class="moduleCard">
            <h4 class="moduleTitle">• Playas & sectores</h4>
            <p class="moduleDesc">Visualización por cuadrantes, real time, conteo automático.</p>
          </div>

          <div class="moduleCard">
            <h4 class="moduleTitle">• Integración con flotas</h4>
            <p class="moduleDesc">Empresas pueden gestionar vehículos, roles y accesos internos.</p>
          </div>

          <div class="moduleCard">
            <h4 class="moduleTitle">• Turnos logísticos</h4>
            <p class="moduleDesc">Puntos de carga/descarga con reserva a demanda.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================ CTA FINAL ============================ -->
    <section class="py-20 bg-gradient-to-br from-[#0D1B2A] via-[#1B2535] to-[#0A1220] text-white">
      <div class="container mx-auto px-6 text-center max-w-3xl">

        <h3 class="text-4xl md:text-5xl font-bold">
          Llevá tu ciudad, campus o industria al siguiente nivel.
        </h3>

        <p class="mt-4 text-white/80">
          Implementación rápida, soporte local y tecnología argentina pensada para escalar.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            @click="contact"
            class="px-6 py-3 rounded-full bg-accent text-white font-semibold shadow-xl hover:bg-accent/90 transition"
          >
            Solicitar demo
          </button>

          <button
            @click="goTo('/dashboard')"
            class="px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition font-semibold"
          >
            Ver plataforma en vivo
          </button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/10 bg-[#0F172A] text-white/70">
      <div class="container mx-auto px-6 py-6 text-center text-sm">
        © {{ currentYear }} HayLugar for Business — Tecnología argentina para movilidad urbana
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import logo from "../assets/logo.png";
import mapaVisual from "../assets/mapa-visual.png";

import imgEventos from "../assets/events.png";
import imgMunicipios from "../assets/medido.png";
import imgIndustrial from "../assets/industry.png";
import imgUniversidades from "../assets/universidad.png";

const router = useRouter();
const goTo = (p) => router.push(p);
const contact = () => router.push("/contacto");

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* Tarjetas B2B */
.b2bCard {
  @apply bg-white rounded-2xl p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]
         border border-[#E2E8F0] hover:shadow-[0_18px_55px_rgba(15,23,42,0.12)]
         transition-all duration-200;
}
.b2bImg {
  @apply w-full h-40 object-cover rounded-xl mb-4;
}
.b2bTitle {
  @apply text-lg font-bold mb-1;
}
.b2bDesc {
  @apply text-sm text-[#475569];
}

/* Módulos */
.moduleCard {
  @apply bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-lg transition duration-200;
}
.moduleTitle {
  @apply text-base font-bold text-[#0F172A] mb-1;
}
.moduleDesc {
  @apply text-sm text-[#64748B];
}

/* Halos */
.halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  animation: float 14s ease-in-out infinite;
}
.halo--lg {
  right: -10rem;
  top: -10rem;
  width: 28rem;
  height: 28rem;
  background: rgba(59, 130, 246, 0.4);
}
.halo--sm {
  left: -6rem;
  bottom: -12rem;
  width: 24rem;
  height: 24rem;
  background: rgba(45, 212, 191, 0.4);
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(12px); }
}
</style>
