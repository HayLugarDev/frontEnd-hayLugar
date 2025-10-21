<!-- src/views/LandingHayLugar.vue -->
<template>
  <div class="min-h-screen text-white bg-dark selection:bg-accent/30 selection:text-white">
    <!-- ===== HERO ===== -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-dark">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div class="halo halo--lg"></div>
        <div class="halo halo--sm"></div>
      </div>

      <header class="container mx-auto px-6 pt-10 md:pt-24 pb-12 md:pb-16 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
        <div>
          <div class="flex items-center gap-4 group">
            <img :src="logo" alt="HayLugar" class="h-16 w-16 md:h-24 md:w-24 xl:h-28 xl:w-28 transition-transform duration-300 ease-out group-hover:scale-110" />
            <h1 class="font-extrabold tracking-tight text-4xl md:text-6xl xl:text-7xl leading-[0.95]">
              Encontrá tu lugar.
            </h1>
          </div>

          <p class="mt-4 text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
            HayLugar conecta personas: quienes necesitan estacionar con quienes tienen un espacio libre.  
            Una red creada en Argentina que impulsa la microeconomía urbana con confianza, tecnología y comunidad.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-2">
            <span class="badge-solid bg-emerald-500">Pagos seguros</span>
            <span class="badge-solid bg-blue-500">Usuarios verificados</span>
            <span class="badge-solid bg-amber-500">Soporte humano</span>
            <span class="badge-solid bg-blue-400">100% argentino</span>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <button class="btn btn--accent w-full sm:w-auto" @click="goTo('/dashboard')">Buscar estacionamiento</button>
            <button class="btn btn--ghost w-full sm:w-auto" @click="goTo('/login')">Compartir mi espacio</button>
          </div>

          <div class="mt-6">
            <p class="text-sm uppercase tracking-wide text-white/90 mb-2">Zonas activas</p>
            <div class="flex flex-wrap items-center gap-2 text-sm ">
              <span v-for="(z,i) in zonas" :key="i" class="chip text-white/90">{{ z }}</span>
            </div>
          </div>
        </div>

        <!-- MAP -->
        <div>
          <div class="card glass text-primary">
            <div class="flex items-center justify-between">
              <h3 class="h3">Mapa en tiempo real</h3>
              <span class="text-xs text-white/70">Vista demo</span>
            </div>

            <div ref="mapWrap" class="mt-4 rounded-lg overflow-hidden shadow-md h-[380px] w-full bg-white/5 ring-1 ring-white/10">
              <transition name="fade">
                <CustomGoogleMap
                  v-if="mapReady"
                  class="h-full w-full"
                  :center="center"
                  :zoom="zoom"
                  :options="mapOptions"
                >
                  <GMapMarker
                    v-for="espacio in espacios"
                    :key="espacio.id"
                    :options="getMarkerOptions(espacio)"
                    @click="() => handleMarkerClick(espacio)"
                  />
                </CustomGoogleMap>
              </transition>
              <div v-if="!mapReady" class="h-full w-full grid place-items-center">
                <div class="skeleton w-10/12 h-4 rounded mb-2"></div>
                <div class="skeleton w-9/12 h-4 rounded mb-2"></div>
                <div class="skeleton w-8/12 h-4 rounded"></div>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <p class="text-xs text-white/80">* Cada punto representa un espacio compartido por la comunidad.</p>
              <button class="btn btn--tiny" @click="setCenterToUserLocation">Usar mi ubicación</button>
            </div>
          </div>
        </div>
      </header>
    </section>

    <!-- ===== COMO FUNCIONA ===== -->
    <section class="py-16 bg-white text-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">¿Cómo funciona HayLugar?</h2>
        <p class="text-center text-gray-600 mt-2">Tecnología simple para hacer más fácil la vida urbana.</p>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(p,i) in pasos" :key="i" class="card-step">
            <div class="step-number">{{ i+1 }}</div>
            <h4 class="title">{{ p.title }}</h4>
            <p class="desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIOS ===== -->
    <section class="py-16 bg-gray-50 text-gray-900">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center">Lo que dicen quienes ya usan HayLugar</h2>
        <p class="text-center text-gray-600 mt-2">Confianza real, historias reales.</p>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(t,i) in testimonios" :key="i" class="testimonial-card">
            <p class="text-gray-700 italic leading-relaxed">“{{ t.text }}”</p>
            <div class="flex items-center gap-3 mt-4">
              <div>
                <p class="font-semibold text-gray-900">{{ t.name }}</p>
                <p class="text-sm text-gray-600">{{ t.city }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="py-16 bg-gradient-to-br from-primary via-primary/90 to-dark text-white">
      <div class="container mx-auto px-6 text-center">
        <h3 class="text-3xl md:text-4xl font-bold">Un movimiento que empezó en los barrios y llega a todo el país</h3>
        <p class="mt-3 text-white/90 max-w-2xl mx-auto">
          Sumate a la red inteligente de estacionamientos.  
          Porque cuando compartimos espacio, ganamos todos.
        </p>
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button class="btn btn--accent w-full sm:w-auto" @click="goTo('/dashboard')">Buscar estacionamiento</button>
          <button class="btn btn--ghost w-full sm:w-auto" @click="goTo('/login')">Compartir mi espacio</button>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="border-t border-white/10 bg-dark text-white/70">
      <div class="container mx-auto px-6 py-6 text-center text-sm">
        © {{ currentYear }} HayLugar · La nueva microeconomía urbana — Tecnología argentina con impacto social
      </div>
      <div class="border-t border-white/10">
        <div class="container mx-auto px-6 py-4 text-center text-sm flex flex-col md:flex-row items-center justify-center gap-3">
          <RouterLink to="/cookies" class="hover:text-white transition-colors">Política de Cookies</RouterLink>
          <RouterLink to="/PrivacyPolicy" class="hover:text-white transition-colors">Política de Privacidad</RouterLink>
          <RouterLink to="/termsConditions" class="hover:text-white transition-colors">Términos y Condiciones</RouterLink>
          <RouterLink to="/FAQView" class="hover:text-white transition-colors">Preguntas Frecuentes</RouterLink>
        </div>
      </div>
    </footer>

    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import CookieBanner from '../components/common/CookieBanner.vue'
import logo from '../assets/logo.png'
import logoMarker from '../assets/logo.png'

type Espacio = { id: number; name: string; latitude: number; longitude: number; price_per_hour: number }

const router = useRouter()
const goTo = (path: string) => router.push(path)
const currentYear = computed(() => new Date().getFullYear())
const zonas = ['Centro', 'Plaza', 'Costanera', 'Parque']

const pasos = ref([
  { title: 'Encontrá un espacio', desc: 'Abrí el mapa y elegí el lugar más cercano.' },
  { title: 'Reservá desde tu celular', desc: 'En segundos, sin efectivo ni llamadas.' },
  { title: 'Estacioná tranquilo', desc: 'Tu lugar te espera y tu pago está asegurado.' },
  { title: 'Generá ingresos', desc: 'Si tenés un espacio libre, compartilo y ganá.' },
])

const testimonios = ref([
  { text: 'Empecé compartiendo la cochera de mi casa en Yerba Buena. En un mes ya tenía ingresos fijos y vecinos nuevos.', name: 'Laura M.', city: 'Yerba Buena, Tucumán' },
  { text: 'Trabajo en el centro y perdía horas buscando lugar. Con HayLugar reservo antes de salir y estaciono sin vueltas.', name: 'Diego R.', city: 'Córdoba Capital' },
  { text: 'Soy estudiante y alquilo mi cochera cuando no la uso. Es ingreso extra y ayuda a otros.', name: 'Lucía F.', city: 'San Miguel de Tucumán' },
])

const center = ref({ lat: -34.6037, lng: -58.3816 })
const zoom = ref(13)
const mapOptions = ref({
  styles: [{ elementType: 'geometry', stylers: [{ color: '#eaeaea' }] }],
  disableDefaultUI: true,
  zoomControl: true,
})
const espacios = ref([
  { id: 1, name: 'Centro', latitude: -34.6037, longitude: -58.3816, price_per_hour: 500 },
  { id: 2, name: 'Parque', latitude: -34.601, longitude: -58.385, price_per_hour: 400 },
])
const handleMarkerClick = (espacio: Espacio) => router.push({ path: '/dashboard', query: { lat: espacio.latitude, lng: espacio.longitude } })
const getMarkerOptions = (espacio: Espacio) => ({ position: { lat: espacio.latitude, lng: espacio.longitude }, icon: { url: logoMarker, scaledSize: { width: 40, height: 40 } as any } })
const setCenterToUserLocation = () => { if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(pos => (center.value = { lat: pos.coords.latitude, lng: pos.coords.longitude })) }

const mapReady = ref(false)
const mapWrap = ref<HTMLElement | null>(null)
onMounted(() => {
  if (!mapWrap.value) return
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { mapReady.value = true; io.disconnect() } })
  }, { rootMargin: '200px' })
  io.observe(mapWrap.value)
})
</script>

<style scoped>
.btn{ @apply inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold transition-all duration-200; }
.btn--ghost{ @apply bg-white/10 text-white border border-white/30 hover:bg-white/15 hover:shadow; }
.btn--accent{ @apply bg-accent text-white hover:bg-accent/90 hover:shadow; }
.btn--tiny{ @apply text-xs px-3 py-1 rounded-full border border-white/70 hover:border-accent; }
.badge-solid{ @apply text-xs font-semibold tracking-wide uppercase rounded-full px-3 py-1 shadow-sm; }
.chip{ @apply rounded-full px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-sm shadow-sm; }
.card{ @apply rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow ring-1 ring-white/10; }
.card-step{ @apply bg-white rounded-2xl p-6 shadow ring-1 ring-gray-100 text-center; }
.step-number{ @apply h-10 w-10 mx-auto mb-3 rounded-full bg-accent/10 text-accent font-bold grid place-items-center; }
.testimonial-card{ @apply bg-white rounded-2xl p-6 shadow ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg; }
.h3{ @apply text-xl font-bold text-gray-900; }
.halo{ @apply absolute rounded-full blur-3xl; animation: float 12s ease-in-out infinite; }
.halo--lg{ @apply -right-40 -top-40 h-[28rem] w-[28rem] bg-white/10; }
.halo--sm{ @apply -left-32 -bottom-40 h-[26rem] w-[26rem] bg-accent/20; }
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}
.skeleton{ @apply animate-pulse bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded; }
.fade-enter-active,.fade-leave-active{transition:opacity .25s ease;}
.fade-enter-from,.fade-leave-to{opacity:0;}
</style>
