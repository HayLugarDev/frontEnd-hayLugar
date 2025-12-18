<template>
  <div class="min-h-screen bg-[#020617] text-white selection:bg-accent/30 selection:text-white">
    <!-- HEADER -->
    <MainHeader />

    <!-- ============================ HERO ============================ -->
    <section
      class="relative overflow-hidden pt-28 pb-36 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#020617]"
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
          Nacido en Argentina · Estacionamiento inteligente en tiempo real
        </div>

        <!-- LOGO -->
        <Logo
          width="56"
          class="mb-4 md:mb-5 drop-shadow-lg opacity-90 hover:opacity-100 transition"
        />

        <!-- TITULO -->
        <h1 class="font-extrabold tracking-tight leading-[0.95] text-4xl md:text-6xl xl:text-7xl">
          Encontrá estacionamiento<br />
          donde lo necesitás, cuando lo necesitás.
        </h1>

        <!-- DESCRIPTION -->
        <p class="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
          Cocheras privadas, playas y espacios reales
          <span class="font-semibold text-accent">disponibles en tiempo real</span>.
          Reservá o publicá tu espacio en minutos.
        </p>

        <!-- CTA PRINCIPAL -->
        <div class="w-full max-w-xl mt-10 space-y-3">
          <button
            @click="goTo('/dashboard')"
            class="w-full py-4 rounded-xl text-[#0D1B2A] font-semibold
                   bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                   shadow-lg shadow-cyan-900/30
                   hover:from-[#06D6A0] hover:to-[#00B4D8]
                   transition-all duration-300"
          >
            🔍 Buscar estacionamiento
          </button>

          <button
            @click="goTo('/login')"
            class="text-sm text-white/70 hover:text-white transition"
          >
            💰 Tengo un espacio y quiero publicarlo
          </button>

          <p class="text-xs text-white/60">
            Sin llamadas · Sin vueltas · Todo desde el celular
          </p>
        </div>
      </div>
    </section>

    <!-- ============================ CÓMO FUNCIONA ============================ -->
    <section class="py-24 bg-gradient-to-b from-[#020617] to-[#0B1220] border-b border-white/10">
      <div class="container mx-auto px-6 max-w-6xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Cómo funciona HayLugar
        </h2>

        <p class="text-white/70 max-w-2xl mx-auto mb-16">
          Tres pasos simples para estacionar sin vueltas o convertir tu espacio en ingresos.
        </p>

        <div class="grid gap-10 md:grid-cols-3">
          <div
            class="relative rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition group"
          >
            <span
              class="absolute -top-4 left-1/2 -translate-x-1/2
                     bg-accent text-[#0D1B2A] text-sm font-bold
                     px-4 py-1 rounded-full shadow-lg"
            >
              Paso 1
            </span>

            <h3 class="text-xl font-semibold mt-6 mb-3">
              Buscá o publicá un espacio
            </h3>

            <p class="text-white/70 leading-relaxed">
              Ingresá tu ubicación para encontrar estacionamiento disponible
              o publicá tu espacio en pocos minutos.
            </p>
          </div>

          <div
            class="relative rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition group"
          >
            <span
              class="absolute -top-4 left-1/2 -translate-x-1/2
                     bg-accent text-[#0D1B2A] text-sm font-bold
                     px-4 py-1 rounded-full shadow-lg"
            >
              Paso 2
            </span>

            <h3 class="text-xl font-semibold mt-6 mb-3">
              Reservá o confirmá acceso
            </h3>

            <p class="text-white/70 leading-relaxed">
              Todo se gestiona desde la plataforma:
              disponibilidad en tiempo real, acceso claro y sin intermediarios.
            </p>
          </div>

          <div
            class="relative rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition group"
          >
            <span
              class="absolute -top-4 left-1/2 -translate-x-1/2
                     bg-accent text-[#0D1B2A] text-sm font-bold
                     px-4 py-1 rounded-full shadow-lg"
            >
              Paso 3
            </span>

            <h3 class="text-xl font-semibold mt-6 mb-3">
              Estacioná o generá ingresos
            </h3>

            <p class="text-white/70 leading-relaxed">
              Usá el espacio reservado con tranquilidad
              o empezá a ganar dinero con un lugar que antes estaba vacío.
            </p>
          </div>
        </div>

        <div class="mt-16">
          <button
            @click="goTo('/dashboard')"
            class="px-8 py-4 rounded-full text-[#0D1B2A] font-semibold
                   bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                   shadow-lg shadow-cyan-900/30
                   hover:from-[#06D6A0] hover:to-[#00B4D8]
                   transition-all duration-300"
          >
            Empezar ahora
          </button>

          <p class="mt-4 text-sm text-white/60">
            Sin contratos · Sin costos ocultos · 100% digital
          </p>
        </div>
      </div>
    </section>

    <!-- ============================ PARA QUIÉN ES ============================ -->
    <section class="py-20 bg-[#020617] border-b border-white/10">
      <div class="container mx-auto px-6 max-w-5xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">
          Dos formas simples de usar HayLugar
        </h2>
        <p class="text-white/70 max-w-2xl mx-auto mb-12">
          Elegí cómo participar y empezá en minutos.
        </p>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent transition"
          >
            <h3 class="text-xl font-semibold mb-2">
              Necesito estacionar ahora
            </h3>
            <p class="text-white/70 mb-4">
              Encontrá espacios reales cerca tuyo, con disponibilidad en tiempo real.
            </p>

            <button
              @click="goTo('/dashboard')"
              class="px-6 py-3 w-full rounded-full text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/20
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300"
            >
              Buscar estacionamiento
            </button>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent transition"
          >
            <h3 class="text-xl font-semibold mb-2">
              Tengo un espacio disponible
            </h3>
            <p class="text-white/70 mb-4">
              Convertí un espacio vacío en ingresos sin complicaciones.
            </p>

            <button
              @click="goTo('/login')"
              class="px-6 py-3 w-full rounded-full text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/20
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300"
            >
              Publicar mi espacio
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================ PRUEBA SOCIAL ============================ -->
    <section class="py-24 bg-gradient-to-b from-[#020617] to-[#020617]">
      <div class="container mx-auto px-6 max-w-6xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Nacido en Tucumán. Pensado para todo el país.
        </h2>

        <p class="text-white/70 max-w-3xl mx-auto mb-16">
          HayLugar empieza resolviendo un problema local y escala ciudad por ciudad,
          conectando espacios reales con personas que necesitan estacionar.
        </p>

        <div class="grid gap-8 md:grid-cols-3">
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition"
          >
            <p class="text-4xl font-bold text-accent mb-2">🇦🇷</p>
            <p class="font-semibold mb-1">Desarrollo argentino</p>
            <p class="text-white/60 text-sm">
              Producto creado y operado localmente.
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition"
          >
            <p class="text-4xl font-bold text-accent mb-2">📍</p>
            <p class="font-semibold mb-1">Expansión progresiva</p>
            <p class="text-white/60 text-sm">
              Nuevas zonas habilitadas todas las semanas.
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-8
                   hover:border-accent transition"
          >
            <p class="text-4xl font-bold text-accent mb-2">🚗</p>
            <p class="font-semibold mb-1">Espacios reales</p>
            <p class="text-white/60 text-sm">
              Cocheras, playas y espacios verificados.
            </p>
          </div>
        </div>

        <div class="mt-16">
          <p class="text-sm text-white/60 mb-3">
            ¿Todavía no está disponible en tu ciudad?
          </p>

          <button
            class="text-sm font-semibold text-accent hover:underline"
            @click="goTo('/contacto')"
          >
            Avisanos dónde estás y aceleramos la llegada
          </button>
        </div>
      </div>
    </section>

    <!-- ============================ CAPTURA DE LEADS (WhatsApp) ============================ -->
    <section class="py-24 bg-gradient-to-b from-[#020617] to-[#0B1220] border-t border-white/10">
      <div class="container mx-auto px-6 max-w-4xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿Todavía no hay espacios en tu zona?
        </h2>

        <p class="text-white/70 max-w-2xl mx-auto mb-10">
          Estamos habilitando nuevas ciudades constantemente.
          Dejanos tu ciudad y te avisamos apenas lleguemos.
        </p>

        <div
          class="max-w-2xl mx-auto bg-white/5 border border-white/10
                 rounded-2xl p-6 backdrop-blur-xl"
        >
          <form @submit.prevent="sendWhatsAppLead" class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <input
                v-model.trim="leadLocation"
                type="text"
                placeholder="Tu ciudad o provincia"
                list="argentinaProvincesList"
                autocomplete="address-level1"
                class="w-full px-4 py-3 rounded-xl bg-white/10 text-white
                       border border-white/20 focus:outline-none
                       focus:ring-2 focus:ring-accent/50"
              />
              <datalist id="argentinaProvincesList">
                <option v-for="prov in argentinaProvinces" :key="prov" :value="prov" />
              </datalist>
            </div>

            <button
              type="submit"
              class="px-6 py-3 rounded-full text-[#0D1B2A] font-semibold
                     bg-gradient-to-r from-[#00B4D8] to-[#06D6A0]
                     shadow-lg shadow-cyan-900/20
                     hover:from-[#06D6A0] hover:to-[#00B4D8]
                     transition-all duration-300
                     inline-flex items-center justify-center gap-2"
            >
              <span class="text-lg leading-none">🟢</span>
              Enviar WhatsApp
            </button>
          </form>

          <p class="text-xs text-white/50 mt-4">
            No spam · Solo avisos cuando lleguemos a tu zona
          </p>
        </div>
      </div>
    </section>

    <slot name="rest-of-landing" />

    <!-- ============================ FOOTER ============================ -->
    <section class="bg-gradient-to-b from-[#020617] via-[#020617] to-[#0EA5E9]/10 mt-16 pt-10 pb-8">
      <footer
        class="max-w-6xl mx-auto bg-white text-[#0F172A] rounded-[32px]
               shadow-[0_-10px_40px_rgba(15,23,42,0.25)]
               px-6 md:px-10 py-10"
      >
        <!-- Logo -->
        <div class="flex flex-col gap-4 mb-8">
          <div class="flex items-center gap-3">
            <Logo width="20" class="drop-shadow-lg cursor-pointer" />
          </div>
          <div class="h-px bg-[#E2E8F0]" />
        </div>

        <!-- GRID -->
        <div class="grid gap-10 md:grid-cols-[2fr,2fr,2fr,2fr]">
          <!-- Sobre -->
          <div>
            <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Sobre HayLugar</h4>
            <ul class="space-y-2 text-sm text-[#475569]">
              <li><router-link to="/help" class="hover:text-accent">Cómo funciona</router-link></li>
              <li><router-link to="/FAQView" class="hover:text-accent">Preguntas frecuentes</router-link></li>
              <li><router-link to="/add-space" class="hover:text-accent">Ser anfitrión</router-link></li>
              <li><router-link to="/corporativo" class="hover:text-accent">Corporativo</router-link></li>
            </ul>
          </div>

          <!-- Países -->
          <div>
            <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Países</h4>
            <ul class="space-y-2 text-sm text-[#475569]">
              <li class="flex items-center justify-between cursor-default hover:text-accent">
                Argentina <span class="text-xs text-[#94A3B8]">▾</span>
              </li>
            </ul>
          </div>

          <!-- Empresa -->
          <div>
            <h4 class="text-lg font-semibold mb-4 text-[#0F172A]">Empresa</h4>
            <ul class="space-y-2 text-sm text-[#475569]">
              <li><router-link to="/termsConditions" class="hover:text-accent">Términos y condiciones</router-link></li>
              <li><router-link to="/PrivacyPolicy" class="hover:text-accent">Política de privacidad</router-link></li>
              <li>
                
                <a
                  :href="whatsappLink('Hola! Quiero contactarme con HayLugar.')"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-accent inline-flex items-center gap-2"
                >
                 
                  Contacto <img src="../../assets/wp-logo.png" alt="WhatsApp" class="w-7 h-7" />
                </a>
              </li>
            </ul>
          </div>
   <!-- Redes -->
    
       <!-- Redes sociales -->
<div class="flex flex-col gap-3">
  <span class="text-sm font-semibold text-[#0F172A]">
    Seguinos
  </span>

  <div
    class="flex items-center gap-4 px-4 py-3 rounded-xl"
  >
    <a
      href="https://www.linkedin.com/company/hay-lugar/"
      target="_blank"
      rel="noopener"
      class="hover:scale-110 transition-transform"
    >
      <img src="../../assets/linkedin.png" alt="LinkedIn" class="w-7 h-7" />
    </a>

    <a
      href="https://www.instagram.com/haylugarok"
      target="_blank"
      rel="noopener"
      class="hover:scale-110 transition-transform"
    >
      <img src="../../assets/instagram.png" alt="Instagram" class="w-7 h-7" />
    </a>

    <a
      href="https://www.tiktok.com/@apphaylugar"
      target="_blank"
      rel="noopener"
      class="hover:scale-110 transition-transform"
    >
      <img src="../../assets/tiktok.png" alt="TikTok" class="w-7 h-7" />
    </a>
  </div>
</div>

        </div>

        <!-- Store badges en horizontal abajo -->
        <div class="h-px bg-[#E2E8F0] mt-10 mb-6" />

        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <a href="#" class="w-[150px] hover:opacity-90 transition">
              <img :src="googlePlayBadge" alt="Google Play" class="w-full h-auto object-contain" />
            </a>
            <a href="#" class="w-[150px] hover:opacity-90 transition">
              <img :src="appStoreBadge" alt="App Store" class="w-full h-auto object-contain" />
            </a>
            
          </div>

          <div class="text-center text-xs text-[#94A3B8]">
            © {{ currentYear }} · HayLugar · Todos los derechos reservados.
          </div>
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

// WhatsApp helpers
const WHATSAPP_PHONE = '5493813198254' // +54 9 3813 19-8254

const whatsappLink = (message) => {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`
}

// Lead capture
const leadLocation = ref('')

const argentinaProvinces = [
  "Ciudad Autónoma de Buenos Aires",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  "Tucumán"
]

const sendWhatsAppLead = () => {
  const loc = (leadLocation.value || '').trim()
  const msg = loc
    ? `Hola! Soy de ${loc} y quiero que HayLugar llegue a mi zona. ¿Me avisan cuando esté disponible?`
    : `Hola! Quiero que HayLugar llegue a mi zona. ¿Me avisan cuando esté disponible?`

  window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer')
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
