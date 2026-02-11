<template>
  <div class="min-h-screen bg-[#0A0F1C] text-white selection:bg-accent/30 selection:text-white">

    <!-- HEADER -->
    <MainHeader />

    <!-- ====================================================================== -->
    <!--                                HERO B2B                                -->
    <!-- ====================================================================== -->
    <section class="relative overflow-hidden pt-32 pb-32 bg-gradient-to-br from-[#0D1B2A] via-[#142135] to-[#0A0F1C]">
      
      <!-- Halos -->
      <div class="absolute inset-0 -z-10 opacity-70">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>

      <div class="container mx-auto px-6 max-w-5xl">
        
        <div class="max-w-3xl">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 
                   text-xs font-medium text-white/70 mb-5"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Plataforma Enterprise
          </div>

          <!-- TITULO -->
          <h1 class="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
            La infraestructura digital<br />
            para la movilidad urbana.
          </h1>

          <!-- DESCRIPCIÓN -->
          <p class="mt-6 text-xl text-white/70 leading-relaxed max-w-2xl">
            Gestioná estacionamiento, accesos, flotas y movilidad en tiempo real.
            Una solución unificada para municipios, universidades, industrias y empresas.
          </p>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row gap-4 mt-10">
            <button 
              @click="openCalendar"
              class="px-8 py-3 rounded-xl bg-accent text-[#0D1B2A] font-semibold shadow-xl hover:bg-accent/90 transition">
              Agendar reunión
            </button>

            <button 
              @click="goTo('/dashboard')"
              class="px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 font-semibold transition">
              Ver plataforma
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!--                        SECCIÓN: PROPUESTA DE VALOR                      -->
    <!-- ====================================================================== -->
    <section class="py-24 bg-[#0A0F1C]">
      <div class="container mx-auto px-6 max-w-6xl text-center">

        <h2 class="text-3xl md:text-5xl font-extrabold mb-6">Conectamos infraestructura, movilidad y datos.</h2>

        <p class="text-white/50 max-w-3xl mx-auto text-lg leading-relaxed">
          HayLugar for Business unifica estacionamiento, accesos, permisos, sensores y analítica 
          en un ecosistema integral que se adapta a cualquier escala: desde ciudades hasta campus o industrias.
        </p>

        <div class="grid md:grid-cols-3 gap-10 mt-14">

          <!-- CARD 1 -->
          <div
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center 
                   hover:bg-white/10 transition shadow-lg shadow-black/20"
          >
            <div class="text-4xl mb-4 text-accent">
              <i class="fa-solid fa-building-city"></i>
            </div>
            <h3 class="text-lg font-bold">Gobiernos & Smart Cities</h3>
            <p class="text-white/60 text-sm mt-2 leading-relaxed">
              Ordenamiento urbano, estacionamiento inteligente y datos estratégicos.
            </p>
          </div>

          <!-- CARD 2 -->
          <div
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center 
                   hover:bg-white/10 transition shadow-lg shadow-black/20"
          >
            <div class="text-4xl mb-4 text-accent">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 class="text-lg font-bold">Universidades & Campus</h3>
            <p class="text-white/60 text-sm mt-2 leading-relaxed">
              Accesos por legajo, zonas dinámicas y control total del tránsito interno.
            </p>
          </div>

          <!-- CARD 3 -->
          <div
            class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center 
                   hover:bg-white/10 transition shadow-lg shadow-black/20"
          >
            <div class="text-4xl mb-4 text-accent">
              <i class="fa-solid fa-industry"></i>
            </div>
            <h3 class="text-lg font-bold">Industria & Logística</h3>
            <p class="text-white/60 text-sm mt-2 leading-relaxed">
              Dársenas, flotas, turnos y patios logísticos centralizados.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!--                     SECTION: MÓDULOS READY-TO-USE                       -->
    <!-- ====================================================================== -->
    <section class="py-24 bg-[#0D1B2A] border-t border-white/10">
      <div class="container mx-auto px-6 max-w-6xl">

        <h2 class="text-center text-3xl md:text-5xl font-extrabold">
          Módulos hechos para escalar
        </h2>

        <p class="text-center text-white/60 max-w-3xl mx-auto mt-3">
          Elegí qué módulos activar y ponelos en marcha en cuestión de días.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">

          <!-- MODULE -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Accesos inteligentes</h4>
            <p class="text-white/60 text-sm">QR · Patente · Legajo · Roles avanzados.</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Estacionamiento medido</h4>
            <p class="text-white/60 text-sm">Pago digital, sensores, disponibilidad en vivo.</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Playas & Cocheras privadas</h4>
            <p class="text-white/60 text-sm">Cuadrantes, reservas y capacidad en tiempo real.</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Logística industrial</h4>
            <p class="text-white/60 text-sm">Turnos, muelles, flotas y dársenas.</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Eventos masivos</h4>
            <p class="text-white/60 text-sm">Accesos guiados, QR, control perimetral.</p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent transition">
            <h4 class="font-bold text-lg mb-1">Analytics + Insights</h4>
            <p class="text-white/60 text-sm">Métricas avanzadas y dashboards ejecutivos.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!--                             CTA FINAL                                   -->
    <!-- ====================================================================== -->
    <section class="py-28 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0A0F1C] text-center">
      <h3 class="text-4xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
        Tu ciudad, campus o industria<br />con movilidad inteligente.
      </h3>

      <p class="text-white/70 max-w-3xl mx-auto mt-4 text-lg">
        Tecnología argentina pensada para operar a escala nacional con estándares globales.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <button 
          @click="openCalendar"
          class="px-10 py-3 rounded-xl bg-accent text-[#0D1B2A] font-semibold hover:bg-accent/90 transition">
          Solicitar demo corporativa
        </button>

        <button 
          @click="goTo('/dashboard')"
          class="px-10 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition font-semibold">
          Ver plataforma en vivo
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer
      class="max-w-6xl mx-auto bg-white text-[#0F172A] rounded-[32px] shadow-[0_-10px_40px_rgba(15,23,42,0.25)]
            px-6 md:px-10 py-10 mb-10"
    >

      <!-- Logo + divider -->
      <div class="flex flex-col gap-4 mb-8">
        <div class="flex items-center gap-3">
          <Logo width="32" class="drop-shadow-lg cursor-pointer" />
          <span class="text-2xl font-bold tracking-tight">HayLugar</span>
        </div>
        <div class="h-px bg-[#E2E8F0]" />
      </div>

      <!-- GRID PRINCIPAL -->
      <div class="grid gap-10 md:grid-cols-[2fr,2fr,2fr,2fr]">

        <!-- Sobre Nosotros -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Sobre HayLugar</h4>
          <ul class="space-y-2 text-sm text-[#475569]">
            <li><router-link to="/help" class="hover:text-accent">Cómo funciona</router-link></li>
            <li><router-link to="/FAQView" class="hover:text-accent">Preguntas frecuentes</router-link></li>
            <li><router-link to="/add-space" class="hover:text-accent">Ser anfitrión</router-link></li>
            <li><router-link to="/" class="hover:text-accent">HayLugar</router-link></li>
          </ul>
        </div>

        <!-- Localidades -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Localidades</h4>
          <ul class="space-y-2 text-sm text-[#475569]">
            <li class="flex items-center justify-between cursor-default hover:text-accent">
              Argentina <span class="text-xs text-[#94A3B8]">▾</span>
            </li>
            <li class="flex items-center justify-between cursor-default hover:text-accent">
              Chile <span class="text-xs text-[#94A3B8]">▾</span>
            </li>
            <li class="flex items-center justify-between cursor-default hover:text-accent">
              México <span class="text-xs text-[#94A3B8]">▾</span>
            </li>
            <li class="flex items-center justify-between cursor-default hover:text-accent">
              Perú <span class="text-xs text-[#94A3B8]">▾</span>
            </li>
          </ul>
        </div>

        <!-- Empresa -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Empresa</h4>
          <ul class="space-y-2 text-sm text-[#475569]">
            <li><router-link to="/termsConditions" class="hover:text-accent">Términos y condiciones</router-link></li>
            <li><router-link to="/PrivacyPolicy" class="hover:text-accent">Política de privacidad</router-link></li>
            <li><router-link to="/contacto" class="hover:text-accent">Contacto</router-link></li>
          </ul>
        </div>

        <!-- Apps y comunidad -->
        <div class="flex flex-col items-start gap-3 mt-[-8px]">

          <!-- Google Play -->
          <a href="#" class="w-[150px] hover:opacity-90 transition">
            <img :src="googlePlayBadge" alt="Google Play" class="w-full h-auto object-contain" />
          </a>

          <!-- App Store -->
          <a href="#" class="w-[150px] hover:opacity-90 transition">
            <img :src="appStoreBadge" alt="App Store" class="w-full h-auto object-contain" />
          </a>

          <!-- Redes Sociales -->
          <div class="flex items-center gap-3 mt-4">
            <a
              href="https://www.linkedin.com/company/hay-lugar/"
              target="_blank"
            >
              <img src="../../assets/linkedin.png" alt="LinkedIn" class="w-20 h-15" />
            </a>
            <a
              href="https://www.instagram.com/haylugarok?igsh=MXh2bm43cTY3NjJscQ%3D%3D&utm_source=qr"
              target="_blank"
            >
              <img src="../../assets/instagram.png" alt="Instagram" class="w-20 h-15" />
            </a>
            <a
              href="https://www.tiktok.com/@apphaylugar?_r=1&_t=ZM-91v2JMPkRJI"
              target="_blank"
            >
              <img src="../../assets/tiktok.png" alt="TikTok" class="w-20 h-15" />
            </a>
          </div>
        </div>

      </div>

      <!-- Divider inferior -->
      <div class="h-px bg-[#E2E8F0] mt-10 mb-4" />

      <!-- COPYRIGHT -->
      <div class="text-center text-xs text-[#94A3B8]">
        © {{ currentYear }} · HayLugar · Todos los derechos reservados.
      </div>

    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainHeader from '../components/layout/header/MainHeader.vue'
import Logo from '../components/layout/Logo.vue'
import googlePlayBadge from '../../assets/GooglePlay.png'
import appStoreBadge from '../../assets/appstore.png'

const router = useRouter()
const goTo = (path) => router.push(path)

// URL del calendar corporativo (CONFIGURAR EN .env)
const B2B_CALENDAR_URL =
  import.meta.env.VITE_B2B_CALENDAR_URL ||
  'https://calendar.google.com/calendar/u/0/r?cid=apphaylugar@gmail.com' // reemplazá por tu link público de agenda

const openCalendar = () => {
  window.open(B2B_CALENDAR_URL, '_blank')
}

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* ---------------- HALOS ---------------- */
.halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.7;
  animation: float 14s ease-in-out infinite;
}
.halo--lg {
  right: -10rem;
  top: -8rem;
  width: 26rem;
  height: 26rem;
  background: rgba(59,130,246,0.35);
}
.halo--sm {
  left: -8rem;
  bottom: -10rem;
  width: 22rem;
  height: 22rem;
  background: rgba(45,212,191,0.45);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(14px); }
}
</style>
