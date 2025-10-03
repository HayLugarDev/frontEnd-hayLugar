<template>
  <div class="relative min-h-screen bg-white text-gray-900">
    <MainHeader />

    <!-- Encabezado -->
    <header class="px-6 pt-20 md:pt-6">
      <div class="flex items-start md:items-center gap-4 flex-col md:flex-row">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Estacionamientos Inteligentes — <span class="text-primary">UTN FRT</span>
          </h1>
          <p class="text-gray-500 mt-1 text-sm">
            Gestión en tiempo real • Accesos seguros • Optimización sostenible
          </p>
        </div>

        <!-- Tabs + Toggles -->
        <div class="ml-auto flex items-center gap-2">
          <button class="tab-btn" :class="showMap ? 'active' : ''" @click="showMap = true">
            Mapa
          </button>
          <button class="tab-btn" :class="!showMap ? 'active' : ''" @click="showMap = false">
            Lista
          </button>

          <span class="mx-2 h-6 w-px bg-gray-200" />

          <button class="layer-btn" :class="showStops ? 'on' : ''" @click="showStops = !showStops">
            🚏 Paradas
          </button>
          <button class="layer-btn" :class="showBuses ? 'on' : ''" @click="showBuses = !showBuses">
            🚌 Buses
          </button>
          <button class="layer-btn" :class="showRoutes ? 'on' : ''" @click="showRoutes = !showRoutes">
            🗺️ Rutas
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard :label="'Capacidad total'" :value="kpi.capacityTotal" />
        <KpiCard :label="'Ocupados'" :value="kpi.occupiedTotal" />
        <KpiCard :label="'Disponibles'" :value="kpi.availableTotal" :positive="true" />
        <KpiCard :label="'Ocupación'" :value="kpi.occupancyPct + '%'" :bar="kpi.occupancyPct" />
      </div>

      <!-- Estado -->
      <div class="mt-3 flex items-center gap-3 text-xs text-gray-500">
        <span>⏱ Última actualización: {{ lastUpdatedText }}</span>
        <span v-if="loading" class="text-amber-600 animate-pulse">Actualizando…</span>
        <span v-if="error" class="text-rose-600">{{ error }}</span>
      </div>
    </header>

    <!-- Contenido -->
    <div class="p-6">
      <!-- MAPA -->
      <div
        v-if="showMap"
        class="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
      >
        <!-- LOGO UTN “3D” SUPERPUESTO (impacto, sin bloquear el mapa) -->
        <div class="logo-3d-layer pointer-events-none">
          <div class="logo-3d-spin">
            <img :src="UTN_LOGO_URL" alt="UTN Logo" class="logo-3d-img" />
          </div>
        </div>

        <!-- Google Map por encima del fondo, por debajo del logo (el logo tiene blend + baja opacidad) -->
        <CustomGoogleMap class="relative z-10" :center="center" :zoom="zoom" :options="mapOptions">
          <!-- Zonas UTN -->
          <GMapPolygon
            v-for="espacio in espacios"
            :key="'poly-'+espacio.id"
            :paths="polygonPaths(espacio)"
            :options="polygonOptions(espacio)"
          />
          <!-- Marcadores de zonas -->
          <GMapMarker
            v-for="espacio in espacios"
            :key="'mk-'+espacio.id"
            :position="markerPosition(espacio)"
            :icon="markerIcon(espacio)"
            @click="openAccessModal(espacio)"
          />
          <!-- Rutas -->
          <GMapPolygon
            v-if="showRoutes"
            v-for="(route, idx) in routes"
            :key="'route-'+idx"
            :paths="route"
            :options="routeOptions"
          />
          <!-- Paradas -->
          <GMapMarker
            v-if="showStops"
            v-for="stop in busStops"
            :key="'stop-'+stop.id"
            :position="stop.position"
            :icon="busStopIcon"
            @click="activeStopId = stop.id"
          >
            <GMapInfoWindow :opened="activeStopId === stop.id" @closeclick="activeStopId = null">
              <div class="text-sm">
                <div class="font-semibold text-gray-900">{{ stop.name }}</div>
                <div class="text-gray-600">Líneas: {{ stop.lines.join(', ') }}</div>
              </div>
            </GMapInfoWindow>
          </GMapMarker>
          <!-- Buses -->
          <GMapMarker
            v-if="showBuses"
            v-for="bus in buses"
            :key="'bus-'+bus.id"
            :position="bus.position"
            :icon="busIcon(bus)"
          />
        </CustomGoogleMap>

        <!-- Leyenda -->
        <div
          class="absolute left-4 bottom-4 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-lg shadow p-3 text-xs text-gray-700 z-20"
        >
          <div class="font-semibold mb-2 text-primary">🔑 Capas</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="legend-dot bg-emerald-500"></span> <span>Alumnos</span>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <span class="legend-dot bg-blue-500"></span> <span>Docentes</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="legend-dot bg-purple-500"></span> <span>Mixto</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="legend-dot bg-sky-500"></span> <span>Paradas / Buses</span>
          </div>
        </div>
      </div>

      <!-- LISTA -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="espacio in espacios"
          :key="espacio.id"
          class="card"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">{{ espacio.name }}</h3>
            <span :class="badgeClass(espacio)" class="px-2 py-1 rounded-full text-xs font-semibold">
              {{ roleLabel(espacio.allowed_roles) }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">📍 {{ espacio.code }}</p>

          <div class="grid grid-cols-3 gap-3 mt-4">
            <StatTile :label="'Capacidad'" :val="espacio.capacity_total" />
            <StatTile
              :label="'Ocupados'"
              :val="espacio.occupied_count"
              :alert="espacio.occupied_count >= espacio.capacity_total"
            />
            <StatTile
              :label="'Disp.'"
              :val="Math.max(espacio.capacity_total - espacio.occupied_count, 0)"
              :positive="true"
            />
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500">
              <span>Ocupación</span><span>{{ occupancy(espacio) }}%</span>
            </div>
            <div class="w-full h-2 rounded bg-gray-100 mt-1 overflow-hidden">
              <div
                class="h-full rounded"
                :style="{
                  width: occupancy(espacio) + '%',
                  background: occupancyGradient(espacio)
                }"
              />
            </div>
          </div>

          <button
            class="mt-5 w-full btn-primary"
            @click="openAccessModal(espacio)"
          >
            Reservar acceso
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL RESERVA -->
    <transition name="fade">
      <div v-if="modalOpen" class="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
        <div class="modal">
          <button class="modal-close" @click="modalOpen=false">✖</button>

          <h3 class="modal-title">Reserva Inteligente</h3>
          <p class="modal-sub">Zona: <b>{{ selectedSpace?.name || '-' }}</b></p>

          <form v-if="!reservationSuccess" @submit.prevent="confirmReservation" class="space-y-4">
            <div>
              <label class="input-label">Legajo</label>
              <input v-model="form.legajo" type="text" required class="input" />
            </div>
            <div>
              <label class="input-label">Patente</label>
              <input v-model="form.patente" type="text" required class="input" />
            </div>

            <!-- Barrera animada -->
            <div class="gate">
              <div class="gate-arm" :class="{ 'gate-arm-raise': gatePreview }"></div>
              <div class="gate-base"></div>
            </div>

            <button type="submit" class="btn-primary w-full" @mouseenter="gatePreview=true" @mouseleave="gatePreview=false">
              Confirmar Reserva
            </button>
          </form>

          <div v-else class="text-center">
            <div class="success-check">✓</div>
            <h4 class="text-xl font-bold mt-2">Acceso concedido</h4>
            <p class="text-gray-500 text-sm mt-1">
              Barrera levantada automáticamente. ¡Acceso Autorizado! 🚦
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue'
import MainHeader from '../components/layout/header/MainHeader.vue'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import api from '../services/apiService'

/** ======= Config base ======= */
const UTN_LOGO_URL = new URL('@/assets/utn-logo.png', import.meta.url).href // cambia si tu path es otro

const showMap = ref(true)
const showStops = ref(true)
const showBuses = ref(true)
const showRoutes = ref(false)

const loading = ref(false)
const error = ref('')
const lastUpdated = ref(new Date())
const lastUpdatedText = computed(() => lastUpdated.value.toLocaleTimeString())

/** Centro UTN FRT (UI blanca, mapa dark) */
const center = { lat: -26.81705, lng: -65.19855 }
const zoom = 18
const mapOptions = {
  disableDefaultUI: true, zoomControl: true, mapTypeId: 'roadmap',
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0b0f14' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0f14' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit.station.bus', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', stylers: [{ color: '#0e1720' }] },
  ]
}

/** ======= Datos UTN (API o mock) ======= */
const espacios = ref([])

const kpi = computed(() => {
  const cap = espacios.value.reduce((a, e) => a + Number(e.capacity_total || 0), 0)
  const occ = espacios.value.reduce((a, e) => a + Number(e.occupied_count || 0), 0)
  const avail = Math.max(cap - occ, 0)
  const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0
  return { capacityTotal: cap, occupiedTotal: occ, availableTotal: avail, occupancyPct: pct }
})

/** ======= UI Helpers ======= */
const roleLabel = (role) =>
  role === 'professor' ? 'Docentes' : role === 'student' ? 'Alumnos' : 'Mixto'

const badgeClass = (e) =>
  e.allowed_roles === 'professor'
    ? 'bg-blue-50 text-blue-700 border border-blue-200'
    : e.allowed_roles === 'student'
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-purple-50 text-purple-700 border border-purple-200'

const occupancy = (esp) => {
  const c = Number(esp.capacity_total || 0)
  const o = Number(esp.occupied_count || 0)
  return c > 0 ? Math.min(100, Math.round((o / c) * 100)) : 0
}

const occupancyGradient = (esp) => {
  const pct = occupancy(esp)
  if (pct >= 90) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (pct >= 60) return 'linear-gradient(90deg, #facc15, #f59e0b)'
  return 'linear-gradient(90deg, #10b981, #34d399)'
}

/** ======= Map bindings (zonas) ======= */
const markerPosition = (esp) => {
  const lat = Number(esp?.center?.lat)
  const lng = Number(esp?.center?.lng)
  return { lat: isFinite(lat) ? lat : center.lat, lng: isFinite(lng) ? lng : center.lng }
}

const polygonPaths = (esp) => {
  const poly = esp?.polygon
  try {
    const coords = Array.isArray(poly?.coordinates) ? poly.coordinates[0] : []
    return coords.map(([lng, lat]) => ({ lat: Number(lat), lng: Number(lng) }))
  } catch { return [] }
}

const polygonOptions = (esp) => {
  const color =
    esp.allowed_roles === 'professor' ? '#3b82f6'
    : esp.allowed_roles === 'student' ? '#10b981'
    : '#9333ea'
  return {
    fillColor: color,
    fillOpacity: 0.18,
    strokeColor: '#111827',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    clickable: false,
    zIndex: 1,
  }
}

/** Marcador SVG pulsante */
const markerIcon = (esp) => {
  const full = Number(esp.occupied_count) >= Number(esp.capacity_total)
  const base =
    esp.allowed_roles === 'professor' ? '#3b82f6'
      : esp.allowed_roles === 'student' ? '#10b981'
      : '#9333ea'
  const color = full ? '#dc2626' : base

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="${color}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="10" fill="url(#g)">
      <animate attributeName="r" values="8;12;8" dur="1.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="32" cy="32" r="6" fill="${color}" filter="url(#glow)" />
    <circle cx="32" cy="32" r="9" fill="none" stroke="#facc15" stroke-width="1.5" opacity="0.8"/>
  </svg>`
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: { width: 36, height: 36 },
    anchor: { x: 18, y: 18 },
  }
}

/** ======= Paradas y buses (simulación) ======= */
const busStops = ref([
  { id: 1, name: 'Av. Independencia / Lugones', lines: ['A', '5', '8'], position: { lat: -26.81795, lng: -65.19890 } },
  { id: 2, name: 'Av. Independencia / Cossio',   lines: ['3', '5'],     position: { lat: -26.81695, lng: -65.19925 } },
  { id: 3, name: 'Av. Roca / México',            lines: ['A', '9'],     position: { lat: -26.81735, lng: -65.19790 } },
])
const activeStopId = ref(null)

const busStopIcon = {
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38">
      <circle cx="19" cy="19" r="10" fill="#0ea5e9" opacity="0.9"/>
      <rect x="16" y="10" width="6" height="12" rx="2" fill="#fff"/>
      <rect x="18" y="22" width="2" height="5" rx="1" fill="#fff"/>
    </svg>
  `),
  scaledSize: { width: 30, height: 30 },
  anchor: { x: 15, y: 15 }
}

/** Rutas y buses animados */
const routes = ref([
  [
    { lat: -26.81810, lng: -65.19930 },
    { lat: -26.81760, lng: -65.19840 },
    { lat: -26.81680, lng: -65.19840 },
    { lat: -26.81680, lng: -65.19920 },
    { lat: -26.81810, lng: -65.19930 },
  ],
  [
    { lat: -26.81790, lng: -65.19960 },
    { lat: -26.81730, lng: -65.19860 },
    { lat: -26.81670, lng: -65.19870 },
  ]
])

const routeOptions = {
  fillColor: '#0ea5e9',
  fillOpacity: 0.06,
  strokeColor: '#0ea5e9',
  strokeOpacity: 0.7,
  strokeWeight: 2,
  clickable: false,
  zIndex: 0,
}

const buses = ref([
  { id: 'bus-1', routeIndex: 0, t: 0.0, speed: 0.008, position: { lat: -26.81810, lng: -65.19930 } },
  { id: 'bus-2', routeIndex: 1, t: 0.3, speed: 0.010, position: { lat: -26.81770, lng: -65.19900 } },
])

const busIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <circle cx="22" cy="22" r="12" fill="#0ea5e9" opacity=".15"/>
      <rect x="15" y="14" width="14" height="16" rx="3" fill="#0ea5e9"/>
      <rect x="17" y="16" width="10" height="6" rx="1.5" fill="#fff"/>
      <circle cx="18" cy="31" r="2" fill="#1f2937"/>
      <circle cx="26" cy="31" r="2" fill="#1f2937"/>
    </svg>`
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: { width: 36, height: 36 },
    anchor: { x: 18, y: 18 },
  }
}

function lerp(a, b, t) { return a + (b - a) * t }
function lerpPos(p0, p1, t) { return { lat: lerp(p0.lat, p1.lat, t), lng: lerp(p0.lng, p1.lng, t) } }

function advanceBus(bus) {
  const path = routes.value[bus.routeIndex]
  if (!path || path.length < 2) return
  const segCount = path.length - 1
  bus.t = (bus.t + bus.speed) % segCount
  const i = Math.floor(bus.t)
  const frac = bus.t - i
  const p0 = path[i]
  const p1 = path[(i + 1) % path.length]
  bus.position = lerpPos(p0, p1, frac)
}

let busTimer = null
function startBuses() {
  stopBuses()
  busTimer = setInterval(() => {
    if (!showBuses.value) return
    buses.value.forEach(advanceBus)
    lastUpdated.value = new Date()
  }, 900)
}
function stopBuses() { if (busTimer) { clearInterval(busTimer); busTimer = null } }

/** ======= Modal reserva ======= */
const modalOpen = ref(false)
const selectedSpace = ref(null)
const form = ref({ legajo: '', patente: '' })
const gatePreview = ref(false)
const reservationSuccess = ref(false)

const openAccessModal = (esp) => {
  selectedSpace.value = esp
  form.value = { legajo: '', patente: '' }
  gatePreview.value = false
  reservationSuccess.value = false
  modalOpen.value = true
}

const confirmReservation = () => {
  // Demo: éxito inmediato
  reservationSuccess.value = true
  // Simular incremento de ocupación
  const idx = espacios.value.findIndex(e => e.id === selectedSpace.value.id)
  if (idx >= 0) {
    const e = { ...espacios.value[idx] }
    e.occupied_count = Math.min(e.capacity_total, e.occupied_count + 1)
    espacios.value.splice(idx, 1, e)
  }
  setTimeout(() => { modalOpen.value = false }, 2200)
}

/** ======= Carga de datos ======= */
async function fetchSpacesFromAPI() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('university-Space/university/spaces', {
      params: { university_id: 1 }
    })
    if (Array.isArray(data)) {
      espacios.value = data.map(normalizeServerSpace)
    } else {
      espacios.value = mockSpaces()
    }
    lastUpdated.value = new Date()
  } catch (e) {
    error.value = 'Mostrando demo sin conexión'
    espacios.value = mockSpaces()
  } finally {
    loading.value = false
  }
}

function normalizeServerSpace(s) {
  return {
    id: s.id,
    code: s.code,
    name: s.name,
    allowed_roles: s.allowed_roles, // 'student' | 'professor' | 'both'
    capacity_total: Number(s.capacity_total || 0),
    occupied_count: Number(s.occupied_count || 0),
    center: { lat: Number(s.center?.lat), lng: Number(s.center?.lng) },
    polygon: s.polygon,
    last_update: s.last_update
  }
}

function mockSpaces() {
  return [
    {
      id: 1,
      code: "UTN-FRT-STUD",
      name: "Playa Alumnos - UTN FRT",
      allowed_roles: "student",
      capacity_total: 80,
      occupied_count: Math.floor(Math.random() * 40) + 10,
      center: { lat: -26.81676, lng: -65.19852 },
      polygon: { type: "Polygon", coordinates: [[[-65.19866,-26.8169],[-65.19838,-26.8169],[-65.19838,-26.81662],[-65.19866,-26.81662],[-65.19866,-26.8169]]] },
      last_update: new Date().toISOString()
    },
    {
      id: 2,
      code: "UTN-FRT-STAFF",
      name: "Playa Docentes - UTN FRT",
      allowed_roles: "professor",
      capacity_total: 40,
      occupied_count: Math.floor(Math.random() * 30) + 5,
      center: { lat: -26.81747, lng: -65.19865 },
      polygon: { type: "Polygon", coordinates: [[[-65.19878,-26.8176],[-65.19853,-26.8176],[-65.19853,-26.81735],[-65.19878,-26.81735],[-65.19878,-26.8176]]] },
      last_update: new Date().toISOString()
    }
  ]
}

/** Variación suave de ocupación para “tiempo real” */
let occTimer = null
function startRealtimeOccupancy() {
  stopRealtimeOccupancy()
  occTimer = setInterval(() => {
    if (!espacios.value.length) return
    const n = Math.floor(Math.random() * espacios.value.length)
    const e = { ...espacios.value[n] }
    const delta = Math.random() > 0.55 ? 1 : -1
    const next = Math.min(e.capacity_total, Math.max(0, e.occupied_count + delta))
    e.occupied_count = next
    espacios.value.splice(n, 1, e)
    lastUpdated.value = new Date()
  }, 7000)
}
function stopRealtimeOccupancy() { if (occTimer) { clearInterval(occTimer); occTimer = null } }

onMounted(async () => {
  await fetchSpacesFromAPI()
  startRealtimeOccupancy()
  startBuses()
})
onUnmounted(() => {
  stopRealtimeOccupancy()
  stopBuses()
})

/** ======= Componentes internos (render functions => sin runtime-compiler) ======= */
const KpiCard = defineComponent({
  name: 'KpiCard',
  props: { label: String, value: [String, Number], bar: Number, positive: Boolean },
  setup(props) {
    return () => h('div', { class: 'kpi' }, [
      h('div', { class: 'kpi-label' }, props.label),
      h('div', { class: ['kpi-value', props.positive ? 'text-emerald-600' : 'text-gray-900'] }, String(props.value ?? '—')),
      props.bar !== undefined
        ? h('div', { class: 'kpi-bar' }, [
            h('div', { class: 'kpi-bar-fill', style: { width: Math.min(Number(props.bar), 100) + '%' } })
          ])
        : null
    ])
  }
})

const StatTile = defineComponent({
  name: 'StatTile',
  props: { label: String, val: [String, Number], alert: Boolean, positive: Boolean },
  setup(props) {
    return () => h('div', { class: 'tile' }, [
      h('div', { class: 'tile-label' }, props.label),
      h('div', { class: ['tile-value', props.alert ? 'text-rose-600' : props.positive ? 'text-emerald-600' : 'text-gray-900'] }, String(props.val ?? '—'))
    ])
  }
})
</script>

<style scoped>
:root { --primary: #3b82f6; }
.text-primary { color: var(--primary); }

/* Tabs / toggles */
.tab-btn {
  @apply px-3 py-1.5 rounded-full text-sm font-medium border transition bg-white;
  @apply text-gray-600 border-gray-300 hover:bg-gray-50;
}
.tab-btn.active {
  @apply text-white bg-[#3b82f6] border-[#3b82f6] shadow;
}
.layer-btn {
  @apply px-3 py-1.5 rounded-full text-xs font-medium border transition bg-white;
  @apply text-gray-600 border-gray-300 hover:bg-gray-50;
}
.layer-btn.on {
  @apply bg-sky-600 text-white border-sky-600 shadow;
}

/* KPI cards */
.kpi {
  @apply bg-white rounded-xl border border-gray-200 shadow p-4;
}
.kpi-label { @apply text-xs text-gray-500 mb-1; }
.kpi-value { @apply text-2xl font-extrabold; }
.kpi-bar   { @apply mt-2 w-full h-1.5 bg-gray-100 rounded overflow-hidden; }
.kpi-bar-fill { @apply h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded; }

/* Cards lista */
.card {
  @apply bg-white rounded-2xl border border-gray-200 p-5 shadow-md transition transform;
}
.card:hover { box-shadow: 0 12px 32px rgba(0,0,0,.08); transform: translateY(-2px); }

/* Tiles */
.tile { @apply bg-white rounded-lg border border-gray-200 p-3 text-center; }
.tile-label { @apply text-[11px] text-gray-500; }
.tile-value { @apply text-lg font-bold; }

/* Legend */
.legend-dot { @apply inline-block w-3 h-3 rounded-full; }

/* Modal */
.modal {
  @apply relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl;
}
.modal-close { @apply absolute top-3 right-3 text-gray-400 hover:text-gray-600; }
.modal-title { @apply text-2xl font-extrabold text-primary tracking-tight; }
.modal-sub { @apply text-sm text-gray-500 mb-5; }
.input-label { @apply block text-sm font-medium text-gray-700; }
.input {
  @apply mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30;
}

/* Success badge */
.success-check {
  width: 90px; height: 90px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #10b981, #0ea5e9);
  display: grid; place-items: center; font-size: 48px; font-weight: 900; color: white;
  box-shadow: 0 0 40px rgba(16,185,129,.4);
  animation: pop .5s ease;
}
@keyframes pop { from { transform: scale(.7); opacity: 0 } to { transform: scale(1); opacity: 1 } }

/* Gate animation */
.gate { position: relative; height: 56px; margin: 10px 0 4px; }
.gate-arm {
  position: absolute; left: 0; top: 16px; width: 120px; height: 10px;
  background: repeating-linear-gradient(90deg, #e11d48, #e11d48 12px, #f59e0b 12px, #f59e0b 24px);
  border-radius: 6px; transform-origin: 0 50%; transition: transform .6s cubic-bezier(.2,.9,.2,1);
  box-shadow: 0 0 14px rgba(234,88,12,.2);
}
.gate-base {
  position: absolute; left: 0; bottom: 0; width: 18px; height: 28px;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(0,0,0,.06);
}
.gate-arm-raise { transform: rotate(-70deg); }

/* Logo UTN 3D (impacto) */
.logo-3d-layer {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  z-index: 20; /* por encima del mapa */
  pointer-events: none;
}
.logo-3d-spin { perspective: 1000px; animation: spinY 22s linear infinite; }
.logo-3d-img {
  width: 280px; max-width: 45vw;
  opacity: 0.10;                           /* sutil */
  mix-blend-mode: soft-light;              /* se “mezcla” con el mapa */
  filter: drop-shadow(0 0 24px rgba(59,130,246,.25));
  transform: rotateY(25deg) rotateX(14deg) translateZ(0);
}
@keyframes spinY {
  from { transform: rotateY(0deg) rotateX(14deg); }
  to   { transform: rotateY(360deg) rotateX(14deg); }
}

/* Transiciones */
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
