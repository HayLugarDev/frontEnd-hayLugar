<template>
  <div class="min-h-screen bg-[#020617] text-white selection:bg-accent/30 selection:text-white">
    <!-- HEADER -->
    <MainHeader />

<!-- ============================ HERO ============================ -->
<section
  class="relative overflow-hidden pt-16 pb-36 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#020617]"
>
  <!-- Halos -->
  <div class="pointer-events-none absolute inset-0 -z-10">
    <div class="halo halo--lg"></div>
    <div class="halo halo--sm"></div>
  </div>

  <div class="container mx-auto px-6 flex flex-col items-center text-center max-w-4xl">

    <!-- Badge -->
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10
             text-xs font-medium text-white/70 mb-6"
    >
      <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
      Nace en Argentina · Pensado para todo el país
    </div>

    <!-- LOGO (versión reducida elegante) -->
    <Logo 
      width="56"
      class="mb-4 md:mb-5 drop-shadow-lg opacity-90 hover:opacity-100 transition"
    />

    <!-- TITULO -->
    <h1 class="font-extrabold tracking-tight leading-[0.9] text-4xl md:text-6xl xl:text-7xl">
      Movilidad inteligente<br />para un país en movimiento.
    </h1>

    <!-- DESCRIPTION -->
    <p class="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
      Conectamos
      <span class="font-semibold text-accent">
        eventos, universidades, industria, estacionamiento medido, playas y cocheras particulares
      </span>
      en un mismo ecosistema en tiempo real.
    </p>

    <!-- ============================ BUSCADOR ============================ -->
    <div
      class="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20
             rounded-2xl p-5 mt-10 shadow-xl"
    >
      <form @submit.prevent="handleSearch" class="grid sm:grid-cols-3 gap-4">

        <!-- Campo Ciudad -->
        <input
          v-model="filters.city"
          type="text"
          placeholder="Ciudad"
          class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60
                 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />

        <!-- Campo Vertical -->
        <select
          v-model="filters.vertical"
          class="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20
                 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option class="text-black" value="">Tipo de espacio</option>
          <option class="text-black" value="eventos">Eventos</option>
          <option class="text-black" value="universidades">Universidades</option>
          <option class="text-black" value="industrial">Industria</option>
          <option class="text-black" value="medido">Estacionamiento medido</option>
          <option class="text-black" value="playas">Playas / cocheras</option>
        </select>

        <!-- Fecha -->
        <input
          v-model="filters.date"
          type="date"
          class="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20
                 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />

        <!-- BOTON -->
        <div class="sm:col-span-3">
          <button
            class="w-full py-3 rounded-xl text-[#0D1B2A] font-semibold
                   bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                   shadow-lg shadow-cyan-900/30
                   hover:from-[#06D6A0] hover:to-[#00B4D8]
                   transition-all duration-300"
          >
            Buscar espacios disponibles
          </button>
        </div>

      </form>
    </div>

  </div>
</section>



    <!-- ============================ PARA QUIÉN ES ============================ -->
    <section class="py-20 bg-[#020617] border-b border-white/10">
      <div class="container mx-auto px-6 max-w-5xl text-center">
        
        <h2 class="text-3xl md:text-4xl font-bold mb-3">¿Para quién es HayLugar?</h2>
        <p class="text-white/70 max-w-2xl mx-auto mb-12">
          Conectamos a quienes necesitan estacionar con quienes gestionan espacios infrautilizados.
        </p>

        <div class="grid md:grid-cols-2 gap-8">
          
          <!-- Necesito estacionar -->
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent transition"
          >
            <h3 class="text-xl font-semibold mb-2">Personas que necesitan estacionar</h3>
            <p class="text-white/70 mb-4">
              Disponibilidad en tiempo real, pagos simples y acceso sin vueltas.
            </p>

            <button
              @click="goTo('/dashboard')"
              class="px-6 py-3 w-full rounded-full text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/20
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300"
            >
              Buscar ahora
            </button>
          </div>

          <!-- Tengo espacios -->
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent transition"
          >
            <h3 class="text-xl font-semibold mb-2">Quienes gestionan espacios</h3>
            <p class="text-white/70 mb-4">
              Universidades, playas, municipios, industrias o cocheras particulares.
            </p>

            <button
              @click="goTo('/login')"
             class="px-6 py-3 w-full rounded-full text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/20
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300">
              Empezar como anfitrión
            </button>
          </div>

        </div>
      </div>
    </section>
    <slot name="rest-of-landing" />
<section class="bg-gradient-to-b from-[#020617] via-[#020617] to-[#0EA5E9]/10 mt-16 pt-10 pb-8">
  <footer
    class="max-w-6xl mx-auto bg-white text-[#0F172A] rounded-[32px] shadow-[0_-10px_40px_rgba(15,23,42,0.25)]
           px-6 md:px-10 py-10"
  >

    <!-- Logo + divider -->
    <div class="flex flex-col gap-4 mb-8">
      <div class="flex items-center gap-3">
        <Logo width="12" class="drop-shadow-lg cursor-pointer" />
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
          <li><router-link to="/corporativo" class="hover:text-accent">Corporativo</router-link></li>
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

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/company/hay-lugar/"
            target="_blank"
          >
            <img src="../../assets/linkedin.png" alt="LinkedIn" class="w-20 h-15" />
          </a>

          <!-- Instagram -->
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
</section>


    <!-- Cookie banner -->
    <CookieBanner />
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainHeader from '../components/layout/header/MainHeader.vue'
import CookieBanner from '../components/common/CookieBanner.vue'
import Logo from '../components/layout/Logo.vue'
import googlePlayBadge from '../../assets/GooglePlay.png'
import appStoreBadge from '../../assets/appstore.png'
const router = useRouter()

const goTo = (path) => router.push(path)

const currentYear = computed(() => new Date().getFullYear())

const filters = ref({
  city: '',
  vertical: '',
  date: ''
})

const handleSearch = () => {
  router.push({
    path: '/dashboard',
    query: {
      city: filters.value.city || undefined,
      vertical: filters.value.vertical || undefined,
      date: filters.value.date || undefined
    }
  })
}
</script>


<style scoped>
/* Halos */
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
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
}
</style>
