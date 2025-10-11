<template>
  <div class="min-h-screen text-white">
    <!-- HERO -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-dark">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -left-32 -bottom-40 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl"></div>
      </div>

      <div class="container mx-auto px-6 pt-10 md:pt-24 pb-10 md:pb-16">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
          <!-- Columna izquierda -->
          <div>
            <div class="flex items-center gap-4 group">
              <img
                :src="logo"
                alt="HayLugar"
                loading="eager"
                class="h-16 w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32
                       transition-transform duration-300 ease-out
                       motion-reduce:transition-none
                       motion-safe:group-hover:scale-110"
              />
              <h1
                class="font-extrabold tracking-tight
                       text-4xl md:text-5xl lg:text-6xl
                       transition-colors duration-300
                       group-hover:text-white"
              >
                HayLugar
              </h1>
            </div>

            <p class="mt-3 text-lg md:text-xl text-white/90">
              Conectamos personas, espacios y ciudades.<br />
              Reservá tu lugar en segundos y sé parte de una nueva <span class="font-semibold">microeconomía urbana</span>.
            </p>

            <ul class="mt-6 grid gap-2 text-white/90">
              <li>• Mapa en tiempo real con disponibilidad instantánea</li>
              <li>• Pagos digitales: Wallet HayLugar, Mercado Pago y Transferencias 3.0</li>
              <li>• Seguridad y confianza: usuarios verificados, soporte y trazabilidad total</li>
            </ul>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button class="btn bg-white/10 hover:bg-white/15 text-white border border-white/30" @click="goTo('/dashboard')">
                Quiero estacionar
              </button>
              <button class="btn bg-accent hover:bg-accent/90 text-white" @click="goTo('/login')">
                Quiero ser anfitrión
              </button>
            </div>

            <div class="mt-6">
              <p class="text-sm uppercase tracking-wide text-white/60 mb-2">Zonas activas · Tucumán</p>
              <div class="flex flex-wrap items-center gap-2 text-sm">
                <span class="chip bg-white/15 border-white/20 text-white/90">Av. Mate de Luna 2500</span>
                <span class="chip bg-white/15 border-white/20 text-white/90">Plaza Urquiza — 25 de Mayo & Santa Fe</span>
                <span class="chip bg-white/15 border-white/20 text-white/90">San Juan & Córdoba</span>
                <span class="chip bg-white/15 border-white/20 text-white/90">Parque 9 de Julio</span>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Mapa -->
          <div>
            <div class="card glass text-primary">
              <div class="flex items-center justify-between">
                <h3 class="h3">Disponibilidad en tiempo real</h3>
                <span class="text-xs">Tucumán · Demo</span>
              </div>

              <CustomGoogleMap
                class="rounded-lg overflow-hidden shadow-md mt-4 h-[380px] w-full"
                :center="center"
                :zoom="zoom"
                :options="mapOptions"
              >
                <GMapMarker
                  v-for="espacio in espacios"
                  :key="espacio.id"
                  :options="getMarkerOptions(espacio)"
                  @mouseover="handleMouseOver(espacio)"
                  @mouseout="handleMouseOut"
                  @click="() => handleMarkerClick(espacio)"
                />
              </CustomGoogleMap>

              <div class="mt-3 flex items-center justify-between">
                <p class="text-xs">* Vista demo. Cada punto verde representa un espacio compartido por un tucumano.</p>
                <button
                  class="text-xs px-3 py-1 rounded-full border border-white/70 hover:border-primary"
                  @click="setCenterToUserLocation"
                >
                  Usar mi ubicación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- KPIs -->
    <section class="py-8 bg-secondary text-gray-900">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-2xl font-bold mb-6">Una ciudad más ordenada empieza por aprovechar lo que ya tenemos</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <!-- KPI 1 -->
          <div class="kpi">
            <div class="mx-auto mb-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 1.5A10.5 10.5 0 1 0 22.5 12A10.5 10.5 0 0 0 12 1.5m.75 5.25v4.69l3.97 2.36l-.75 1.23L11.25 12V6.75z"/>
              </svg>
            </div>
            <div class="kpi-value">15–30<span class="text-base font-semibold">min</span></div>
            <div class="kpi-label">se pierden cada día buscando dónde estacionar</div>
          </div>
          <!-- KPI 2 -->
          <div class="kpi">
            <div class="mx-auto mb-2 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.23 4.26C16.9 2.29 12.76 2.89 10 5.65a7.76 7.76 0 0 0-2.22 4.17a8.33 8.33 0 0 0-5.56 2.45A8.25 8.25 0 0 0 10 22a8.39 8.39 0 0 0 8.19-6.92a7.7 7.7 0 0 0 2.46-5.55a7.84 7.84 0 0 0-.42-2.27M10 20a6.25 6.25 0 0 1-6.19-5.37A6.31 6.31 0 0 1 9.08 12H12v-2.91A6.25 6.25 0 0 1 20 12a5.73 5.73 0 0 1-.34 1.91A8.36 8.36 0 0 1 10 20"/>
              </svg>
            </div>
            <div class="kpi-value">-28%</div>
            <div class="kpi-label">menos vueltas, menos emisiones</div>
          </div>
          <!-- KPI 3 -->
          <div class="kpi">
            <div class="mx-auto mb-2 h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm10 0h2v2h-2zm0 4h4v2h-6v-2h2v-2h-2v-2h2zm4-4h2v2h-2z"/>
              </svg>
            </div>
            <div class="kpi-value">100%</div>
            <div class="kpi-label">cobro digital y trazable</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ¿Qué es HayLugar? -->
    <section class="py-14 bg-secondary text-gray-900">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-3 gap-8 items-stretch">
          <!-- Texto base -->
          <div class="card lg:col-span-1">
            <h2 class="h2">HayLugar: la app que transforma el espacio libre en oportunidad</h2>
            <p class="sub">Movilidad inteligente · Economía colaborativa · Impacto real</p>
            <ul class="ul mt-5">
              <li>Encontrá, reservá y pagá desde tu celular en tiempo real.</li>
              <li>Plataforma creada en Tucumán para conectar conductores, anfitriones e instituciones.</li>
              <li>
                <strong>Modos de operación</strong>:
                <ul class="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li><em>Anfitriones</em> – monetizá tu cochera o garage.</li>
                  <li><em>Playas</em> – gestioná cupos, cobros y ocupación digitalmente.</li>
                  <li><em>Universidades</em> – controlá accesos y movilidad en campus.</li>
                  <li><em>Estacionamiento medido</em> – sesiones trazables en vía pública.</li>
                </ul>
              </li>
            </ul>
            <p class="mt-6 font-semibold text-gray-800">
              Cada espacio cuenta.<br />
              Cada reserva genera un ingreso local.<br />
              <span class="text-primary font-bold">Esa es la nueva microeconomía urbana.</span>
            </p>
          </div>

          <!-- Tarjetas proceso -->
          <div class="card glass lg:col-span-1 flex items-center justify-center">
            <div class="grid grid-cols-2 gap-3 w-full">
              <div class="rounded-xl bg-white p-4 shadow">
                <div class="h-24 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5"></div>
                <p class="mt-3 text-sm font-semibold text-gray-900">Buscar lugar</p>
                <p class="text-xs text-gray-500">Cerca de vos · tiempo real</p>
              </div>
              <div class="rounded-xl bg-white p-4 shadow">
                <div class="h-24 rounded-lg bg-gradient-to-br from-emerald-200/40 to-white"></div>
                <p class="mt-3 text-sm font-semibold text-gray-900">Reservar</p>
                <p class="text-xs text-gray-500">Confirmación inmediata</p>
              </div>
              <div class="rounded-xl bg-white p-4 shadow">
                <div class="h-24 rounded-lg bg-gradient-to-br from-accent/30 to-white"></div>
                <p class="mt-3 text-sm font-semibold text-gray-900">Pagar</p>
                <p class="text-xs text-gray-500">QR & Wallet HayLugar</p>
              </div>
              <div class="rounded-xl bg-white p-4 shadow">
                <div class="h-24 rounded-lg bg-gradient-to-br from-slate-200 to-white"></div>
                <p class="mt-3 text-sm font-semibold text-gray-900">Historial</p>
                <p class="text-xs text-gray-500">Comprobantes y facturas</p>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="lg:col-span-1 grid gap-4 content-start">
            <div class="feature">
              <div class="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20.5 3l-5.5 2.21L9 3L3.5 5v16l6-2.5l6 2.29l5.5-2.21zm-6 16l-6-2.29V5l6 2.29z"/>
                </svg>
              </div>
              <div>
                <h4 class="title">Mapa en vivo</h4>
                <p class="desc">Disponibilidad por zona, precio y tipo de espacio.</p>
              </div>
            </div>
            <div class="feature">
              <div class="h-10 w-10 shrink-0 rounded-xl bg-accent/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 6h18v12H3zm2 2v8h14V8zm2 2h4v4H7z"/>
                </svg>
              </div>
              <div>
                <h4 class="title">Pago digital</h4>
                <p class="desc">Wallet HayLugar, Mercado Pago y Transferencias 3.0.</p>
              </div>
            </div>
            <div class="feature">
              <div class="h-10 w-10 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2l7 3v6c0 5-3.5 9.74-7 11c-3.5-1.26-7-6-7-11V5z"/>
                </svg>
              </div>
              <div>
                <h4 class="title">Seguridad y soporte</h4>
                <p class="desc">Usuarios verificados, reglas claras y asistencia inmediata.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Drivers -->
    <section class="py-12 bg-white text-gray-900">
      <div class="container mx-auto px-6">
        <h3 class="h3 text-center">Si buscás dónde estacionar, esto es para vos</h3>
        <p class="text-center text-gray-500 mt-2">Rápido, simple y 100% digital</p>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(f,i) in featuresForDrivers" :key="'drv-'+i" class="feature">
            <div class="h-10 w-10 shrink-0 rounded-xl bg-accent/15 flex items-center justify-center font-bold text-accent">{{ i+1 }}</div>
            <div>
              <h4 class="title">{{ f.title }}</h4>
              <p class="desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hosts / Playas -->
    <section class="py-14 bg-secondary text-gray-900">
      <div class="container mx-auto px-6">
        <h3 class="h3 text-center">Convertí tu espacio libre en ingresos</h3>

        <div class="mt-8 grid lg:grid-cols-3 gap-8 items-stretch">
          <div class="card h-full">
            <h4 class="h3">Gestión inteligente para playas y anfitriones</h4>
            <p class="mt-2 text-gray-600">
              Transformá cada espacio disponible en valor económico real. Controlá reservas, cobros y disponibilidad desde una sola plataforma.
            </p>
            <ul class="ul mt-4">
              <li>Cupos, reservas y sesiones en tiempo real</li>
              <li>Cobro con QR interoperable y sin filas</li>
              <li>Reportes claros y conciliación automática</li>
              <li>API para barreras, tótems y cartelería inteligente</li>
            </ul>
          </div>

          <div class="lg:col-span-2">
            <div class="card glass">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-gray-900">Tablero de ocupación · Demo</p>
                <span class="text-xs text-gray-500">Hoy 10:24</span>
              </div>

              <div class="mt-4 grid sm:grid-cols-3 gap-4">
                <div class="rounded-xl bg-white p-4 shadow ring-1 ring-gray-100">
                  <p class="text-xs text-gray-500">Cocheras</p>
                  <p class="text-2xl font-extrabold text-primary">124</p>
                  <p class="text-xs text-emerald-600 mt-1">+12 disponibles</p>
                </div>
                <div class="rounded-xl bg-white p-4 shadow ring-1 ring-gray-100">
                  <p class="text-xs text-gray-500">Ocupación</p>
                  <p class="text-2xl font-extrabold text-gray-900">76%</p>
                  <p class="text-xs text-amber-600 mt-1">pico 12–14h</p>
                </div>
                <div class="rounded-xl bg-white p-4 shadow ring-1 ring-gray-100">
                  <p class="text-xs text-gray-500">Ingresos</p>
                  <p class="text-2xl font-extrabold text-gray-900">$ 248.300</p>
                  <p class="text-xs text-gray-500 mt-1">hoy</p>
                </div>
              </div>

              <div class="mt-4 h-40 rounded-lg bg-gradient-to-br from-primary/10 to-white"></div>
              <p class="mt-3 text-xs text-gray-500">* Integración real en el panel: reservas, sesiones y pagos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-12 bg-gradient-to-br from-primary via-primary/90 to-dark text-white">
      <div class="container mx-auto px-6">
        <div class="mx-auto max-w-3xl text-center">
          <h3 class="text-3xl md:text-4xl font-bold">Unite al movimiento</h3>
          <p class="mt-2 text-white/90">Tecnología tucumana con visión global. Movilidad inteligente para una ciudad más humana y sustentable.</p>
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button class="btn bg-white/10 hover:bg-white/15 text-white border border-white/30 w-full sm:w-auto" @click="goTo('/dashboard')">
              Quiero estacionar
            </button>
            <button class="btn bg-accent hover:bg-accent/90 text-white w-full sm:w-auto" @click="goTo('/FAQView')">
              Preguntas frecuentes
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer original -->
    <footer class="border-t border-white/10 bg-dark text-white/70">
      <div class="container mx-auto px-6 py-6 text-center text-sm">
        © {{ currentYear }} HayLugar · La nueva microeconomía urbana — Tecnología tucumana con impacto global
      </div>
    </footer>

    <!-- 🔹 Bloque legal adicional -->
    <div class="bg-dark text-white/70 border-t border-white/10">
      <div class="container mx-auto px-6 py-4 text-center text-sm flex flex-col md:flex-row items-center justify-center gap-3">
        <RouterLink to="/cookies" class="hover:text-white transition-colors">Política de Cookies</RouterLink>
        <RouterLink to="/PrivacyPolicy" class="hover:text-white transition-colors">Política de Privacidad</RouterLink>
        <RouterLink to="/termsConditions" class="hover:text-white transition-colors">Términos y Condiciones</RouterLink>
        <RouterLink to="/FAQView" class="hover:text-white transition-colors">Preguntas Frecuentes</RouterLink>
      </div>
    </div>

    <!-- 🔹 Banner de cookies -->
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import CookieBanner from '../components/common/CookieBanner.vue'

import logo from '../assets/logo.png'
import logoMarker from '../assets/logo.png'

/** Router / año / rutas */
const router = useRouter()
const goTo = (path: string) => router.push(path)
const currentYear = computed(() => new Date().getFullYear())

/** Mapa */
const center = ref({ lat: -26.8333, lng: -65.2167 })
const zoom = ref(15)

const mapOptions = ref<any>({
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#eaeaea' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#333' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#d6d6d6' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e3f1' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  ],
  disableDefaultUI: true,
  draggable: true,
  zoomControl: true,
  fullscreenControl: false,
  scrollwheel: true,
  streetViewControl: false,
})

/** Tipos */
type Espacio = {
  id: string | number
  name: string
  location: string
  latitude: number | string
  longitude: number | string
  price_per_hour: number
}

/** Demo de espacios */
const espacios = ref<Espacio[]>([
  { id: 1, name: 'Plaza Urquiza', location: '25 de Mayo & Santa Fe', latitude: -26.8195, longitude: -65.2161, price_per_hour: 450 },
  { id: 2, name: 'San Juan & Córdoba', location: 'Microcentro', latitude: -26.8286, longitude: -65.2055, price_per_hour: 500 },
  { id: 3, name: 'Av. Mate de Luna', location: 'Alt. 2500', latitude: -26.8290, longitude: -65.2550, price_per_hour: 400 },
  { id: 4, name: 'Parque 9 de Julio', location: 'Av. Coronel Suárez', latitude: -26.8299, longitude: -65.2038, price_per_hour: 380 },
])

/** Hover (reservado para futuros tooltips) */
const hoveredSpace = ref<Espacio | null>(null)
const handleMouseOver = (espacio: Espacio) => { hoveredSpace.value = espacio }
const handleMouseOut = () => { hoveredSpace.value = null }

/** Click en marker -> dashboard con query */
const handleMarkerClick = (espacio: Espacio) => {
  router.push({ path: '/dashboard', query: { lat: String(espacio.latitude), lng: String(espacio.longitude) } })
}

/** Icono del marker */
const markerIcon = logoMarker
const getMarkerOptions = (espacio: Espacio): any => ({
  position: { lat: Number(espacio.latitude), lng: Number(espacio.longitude) },
  icon: {
    url: markerIcon,
    scaledSize: { width: 40, height: 40 } as any,
  },
  title: `${espacio.name} · $${espacio.price_per_hour}/h`,
})

/** Geolocalización del usuario */
const setCenterToUserLocation = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    (pos) => { center.value = { lat: pos.coords.latitude, lng: pos.coords.longitude } },
    (err) => { console.error('Error al obtener geolocalización:', err) }
  )
}

/** DATA para secciones dinámicas */
const featuresForDrivers = ref([
  { title: 'Encontrá un lugar al instante', desc: 'Mapa en vivo con disponibilidad actualizada.' },
  { title: 'Ahorro de tiempo y combustible', desc: 'Menos vueltas, menos estrés, más tiempo para vos.' },
  { title: 'Pagá sin efectivo ni contacto', desc: 'Wallet HayLugar, QR interoperable o Mercado Pago.' },
  { title: 'Estacioná con respaldo', desc: 'Usuarios verificados, reglas claras y soporte humano.' },
])
</script>

<style scoped>
/* Helpers locales sin @apply; lo demás vive en tu main.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all .2s;
}
.chip {
  border-radius: 9999px;
  padding: .25rem .75rem;
  border-width: 1px;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
}
</style>
