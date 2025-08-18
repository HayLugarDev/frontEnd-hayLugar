<template>
  <div class="relative min-h-screen bg-secondary">
    <MainHeader />

    <!-- Encabezado + acciones -->
    <div class="px-6 pt-20 md:pt-4 flex items-center gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold text-primary">
        Estacionamiento Medido — San Miguel de Tucumán
      </h2>

      <div class="ml-auto flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-full text-sm font-medium border bg-white hover:bg-gray-50 transition"
          :class="showMap ? 'text-primary border-primary/30' : 'text-gray-700 border-gray-300'"
          @click="showMap = true"
        >
          Mapa
        </button>
        <button
          class="px-3 py-1.5 rounded-full text-sm font-medium border bg-white hover:bg-gray-50 transition"
          :class="!showMap ? 'text-primary border-primary/30' : 'text-gray-700 border-gray-300'"
          @click="showMap = false"
        >
          Lista
        </button>
        <button
          class="px-3 py-1.5 rounded-full text-sm font-medium border bg-white hover:bg-gray-50 transition"
          @click="showTickets = true"
        >
          Mis tickets
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="px-4 mt-3 flex flex-wrap gap-2 items-center">
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filterStatus === 'all' ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-white text-gray-700 border-gray-300'"
        @click="filterStatus = 'all'"
      >
        Todas
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filterStatus === 'free' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="filterStatus = 'free'"
      >
        🟢 Libres
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filterStatus === 'limited' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="filterStatus = 'limited'"
      >
        🟠 Media ocupación
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm font-semibold transition border"
        :class="filterStatus === 'full' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-white text-gray-700 border-gray-300'"
        @click="filterStatus = 'full'"
      >
        🔴 Ocupadas
      </button>

      <span class="ml-auto text-xs text-gray-500">
        Última actualización: {{ lastUpdatedText }}
      </span>
    </div>

    <div class="p-4">
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

      <!-- MAPA -->
      <div v-if="showMap" class="w-full h-[70vh] relative rounded-xl overflow-hidden shadow">
        <CustomGoogleMap :center="center" :zoom="zoom" :options="mapOptions">
          <GMapPolyline
            v-for="blk in snappedBlocksFiltered"
            :key="'blk-'+(blk.id ?? blk.label)"
            :path="blk.snappedPath"
            :options="polylineOptions(blk.status, true)"
            @click="openMetered(blk)"
            @mouseover="hovered = blk"
            @mouseout="hovered = null"
          />
        </CustomGoogleMap>

        <!-- Tooltip flotante -->
        <transition name="fade">
          <div
            v-if="hovered"
            class="absolute left-4 top-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow p-3 text-xs text-gray-700 max-w-[320px]"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-2.5 h-2.5 rounded-full"
                :class="{
                  'bg-emerald-500': hovered.status==='free',
                  'bg-amber-500': hovered.status==='limited',
                  'bg-rose-500': hovered.status==='full'
                }"
              />
              <div class="font-semibold">
                {{ hovered.label }}
                <span
                  v-if="activeSessionsMap[hovered.id]"
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
                >
                  ACTIVO
                </span>
              </div>
              <div class="ml-auto text-[11px] text-gray-500">{{ hovered.length }} m</div>
            </div>
            <div class="mt-1 text-gray-600">{{ hovered.desc }}</div>
            <button
              class="mt-2 w-full bg-primary text-white font-semibold rounded-md py-1.5 hover:bg-primary-dark transition disabled:opacity-60"
              :disabled="hovered.status==='full'"
              @click="openMetered(hovered)"
            >
              Iniciar estacionamiento
            </button>

            <!-- Finalizar (si hay ticket activo en esta cuadra) -->
            <button
              v-if="activeSessionsMap[hovered.id]"
              class="mt-2 w-full border border-rose-300 text-rose-700 font-semibold rounded-md py-1.5 hover:bg-rose-50 transition"
              @click.stop="openFinishForBlock(hovered)"
            >
              Finalizar mi estacionamiento
            </button>
          </div>
        </transition>
      </div>

      <!-- LISTA -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="blk in snappedBlocksFiltered"
          :key="'card-'+(blk.id ?? blk.label)"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
          @click="openMetered(blk)"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="{
                'bg-emerald-500': blk.status==='free',
                'bg-amber-500': blk.status==='limited',
                'bg-rose-500': blk.status==='full'
              }"
            />
            <div class="text-sm text-gray-800 font-medium">
              {{ blk.label }}
              <span
                v-if="activeSessionsMap[blk.id]"
                class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
              >
                ACTIVO
              </span>
            </div>
            <div class="ml-auto text-xs text-gray-500">
              {{ blk.length }} m aprox
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-600">
            {{ blk.desc }}
          </div>
          <button
            class="mt-3 w-full bg-primary text-white font-semibold rounded-md py-1.5 hover:bg-primary-dark transition disabled:opacity-60"
            :disabled="blk.status==='full'"
          >
            Iniciar estacionamiento
          </button>
          <button
            v-if="activeSessionsMap[blk.id]"
            class="mt-2 w-full border border-rose-300 text-rose-700 font-semibold rounded-md py-1.5 hover:bg-rose-50 transition"
            @click.stop="openFinishForBlock(blk)"
          >
            Finalizar mi estacionamiento
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div class="fixed bottom-0 left-0 w-full z-50">
      <MobileMenu :showMap="showMap" @toggle="showMap = !showMap" />
    </div>

    <!-- Modal: Estacionamiento Medido (iniciar) -->
    <MeteredAccessDialog  
      :open="modalOpen"
      :zone="selectedZone"
      @close="modalOpen = false"
      @success="handleStarted"
    />
    <MeteredActiveSessions :open="showTickets" @close="showTickets = false" />

    <!-- Modal: mis tickets activos -->
    <MeteredActiveSessions :open="showTickets" @close="showTickets = false" />

    <!-- Modal: finalizar ticket -->
    <MeteredCompleteDialog
      :open="finishOpen"
      :session-id="finishSessionId"
      :zone-label="finishZoneLabel"
      :tariff="finishTariff"
      :grace-minutes="finishGrace"
      :expected-end-i-s-o="finishExpectedEnd"
      @close="finishOpen=false"
      @completed="onFinishCompleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MainHeader from '../components/layout/header/MainHeader.vue'
import CustomGoogleMap from '../components/layout/GoogleMap.vue'
import MobileMenu from '../components/layout/MobileMenu.vue'
import { useUniversityMap } from '../logic/useUniversityMap'
import MeteredActiveSessions from '../components/MeteredActiveSessions.vue'
import MeteredCompleteDialog from '../components/MeteredCompleteDialog.vue'
import { meteredParkingService } from '../services/meteredParkingService'
import { subscribeToMeteredRealtime } from '../services/meteredRealtime'
import { useUserStore } from '../store/userStore'
import MeteredAccessDialog from '../components/meteredAccessDialog.vue'

const { center, zoom, mapOptions, setCenterToLocation } = useUniversityMap()
center.value = { lat: -26.8309, lng: -65.2033 }
zoom.value = 16

const showMap = ref(true)
const error = ref(null)
const lastUpdated = ref(new Date())
const lastUpdatedText = computed(() => lastUpdated.value.toLocaleTimeString())
const filterStatus = ref('all') // all | free | limited | full
const hovered = ref(null)
const showTickets = ref(false)
const snappedBlocks = ref([])

const userStore = useUserStore()

// zona_id -> sesión activa del usuario
const activeSessionsMap = ref(
  /** @type {Record<number, { id:number; zone_id:number; end_time?:string|null; grace_minutes?:number }>} */ ({})
)

// diálogo de finalización
const finishOpen = ref(false)
const finishSessionId = ref(null)
const finishZoneLabel = ref('')
const finishTariff = ref(null)
const finishGrace = ref(null)
const finishExpectedEnd = ref(null)

/* =========================
   Normalización lat/lng (defensivo)
   ========================= */
function normalizePoint(p) {
  let lat = Number(p?.lat)
  let lng = Number(p?.lng)
  // Heurística AR: |lat| ~ 22..55, |lng| ~ 53..73
  const looksSwapped = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) > 55 && Math.abs(lng) < 55
  if (looksSwapped) [lat, lng] = [lng, lat]
  return { lat, lng }
}
function normalizePath(raw) {
  if (!raw || !Array.isArray(raw)) return []
  return raw.map(normalizePoint).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
}

/* =========================
   Google Directions (snapping)
   ========================= */
function waitForGoogle() {
  return new Promise((resolve, reject) => {
    let tries = 0
    const t = setInterval(() => {
      tries++
      if (window.google?.maps?.DirectionsService) {
        clearInterval(t); resolve(true)
      }
      if (tries > 200) { clearInterval(t); reject(new Error('Google Maps no cargó')) }
    }, 100)
  })
}
function getSnappedPath(origin, destination) {
  return new Promise((resolve, reject) => {
    const svc = new window.google.maps.DirectionsService()
    svc.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (res, status) => {
        if (status === 'OK' && res?.routes?.[0]?.overview_path) {
          const pts = res.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))
          resolve(pts)
        } else {
          reject(new Error('No se pudo calcular ruta'))
        }
      }
    )
  })
}

/* Cache de snapping por bloque y versión de datos */
const snapCache = new Map() // key: `${id}:${updated_at}` => path[]

async function snapBlock(dto) {
  const pathRaw = normalizePath(dto?.geo?.path)
  if (pathRaw.length < 2) return []

  const key = `${dto.id}:${dto.updated_at ?? ''}`
  if (snapCache.has(key)) return snapCache.get(key)

  const origin = pathRaw[0]
  const destination = pathRaw[pathRaw.length - 1]

  try {
    const snapped = await getSnappedPath(origin, destination)
    snapCache.set(key, snapped)
    return snapped
  } catch {
    // fallback: línea recta si falla Directions
    snapCache.set(key, pathRaw)
    return pathRaw
  }
}

/* =========================
   Carga inicial (DTO -> UI)
   ========================= */
async function loadBlocksFromBackend() {
  try {
    const resp = await meteredParkingService.getBlocks({
      country_code: 'AR',
      admin1: 'Tucumán',
      city: 'San Miguel de Tucumán',
      active: true,
      limit: 1000
    })

    const data = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : []

    await waitForGoogle()

    const mapped = []
    for (const dto of data) {
      const snappedPath = await snapBlock(dto)
      const label = `${dto.street}${dto.segment_ref ? ' — ' + dto.segment_ref : ''}`
      const desc = `${dto.region?.city || ''}${dto.region?.neighborhood ? ' · ' + dto.region.neighborhood : ''}`
      const length = dto.length_m && dto.length_m > 0
        ? dto.length_m
        : Math.max(30, Math.round(polylineLengthMeters(snappedPath)))

      mapped.push({
        id: dto.id,
        label,
        desc,
        status: dto.status,
        snappedPath,
        length,
        hourly_rate: dto.pricing?.price_per_hour ?? null
      })
    }

    snappedBlocks.value = mapped
    lastUpdated.value = new Date()
  } catch (e) {
    console.error(e)
    error.value = 'No fue posible cargar los bloques de estacionamiento.'
  }
}

/* =========================
   Longitud aproximada polyline
   ========================= */
function polylineLengthMeters(path) {
  if (!path || path.length < 2) return 0
  const R = 6371000, toRad = d => (d * Math.PI) / 180
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i]
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng)
    const la1 = toRad(a.lat), la2 = toRad(b.lat)
    const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(la1) * Math.cos(la2)
    total += 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  }
  return total
}

/* =========================
   Estilos de línea
   ========================= */
const polylineOptions = (status, clickable = false) => {
  const base = { strokeOpacity: 0.95, strokeWeight: 6, clickable,
    zIndex: status === 'free' ? 30 : status === 'limited' ? 25 : 20 }
  if (status === 'free') return { ...base, strokeColor: '#10b981' }
  if (status === 'limited') return { ...base, strokeColor: '#f59e0b' }
  return { ...base, strokeColor: '#ef4444' }
}

/* =========================
   Filtro UI
   ========================= */
const snappedBlocksFiltered = computed(() => {
  const list = Array.isArray(snappedBlocks.value) ? snappedBlocks.value : []
  const withPath = list.filter(b => Array.isArray(b.snappedPath) && b.snappedPath.length >= 2)
  if (filterStatus.value === 'all') return withPath
  return withPath.filter(b => b.status === filterStatus.value)
})

/* =========================
   Modales (iniciar + finalizar)
   ========================= */
const modalOpen = ref(false)
const selectedZone = ref(null)
const openMetered = zone => {
  selectedZone.value = {
    id: zone.id ?? zone.label ?? Math.random(),
    label: zone.label ?? zone.labelText ?? 'Zona medida',
    status: zone.status,
    hourly_rate: zone.hourly_rate ?? null
  }
  modalOpen.value = true
}
const handleStarted = () => { modalOpen.value = false }

/* =========================
   Sesiones activas del usuario
   ========================= */
async function loadMyActiveSessions() {
  const uid = userStore?.user?.id
  if (!uid) return
  try {
    const list = await meteredParkingService.listActiveSessionsByUser(uid)
    const map = {}
    for (const s of list) {
      map[Number(s.zone_id)] = s
    }
    activeSessionsMap.value = map
  } catch (e) {
    console.error('No se pudieron cargar mis sesiones activas', e)
  }
}

async function openFinishForBlock(blk) {
  const s = activeSessionsMap.value[blk.id]
  if (!s) return
  finishSessionId.value = s.id
  finishZoneLabel.value = blk.label

  try {
    const t = await meteredParkingService.getTariff(blk.id)
    finishTariff.value = t?.hourly_rate ?? null
  } catch { finishTariff.value = null }

  finishGrace.value = s?.grace_minutes ?? 5
  finishExpectedEnd.value = s?.end_time ?? null

  finishOpen.value = true
}

function onFinishCompleted() {
  loadMyActiveSessions()
}

/* =========================
   Tiempo real (Socket.IO)
   ========================= */
let unsubscribe = null

async function upsertFromRealtime(dto) {
  try {
    await waitForGoogle()
    const snappedPath = await snapBlock(dto)

    const label = `${dto.street}${dto.segment_ref ? ' — ' + dto.segment_ref : ''}`
    const desc = `${dto.region?.city || ''}${dto.region?.neighborhood ? ' · ' + dto.region.neighborhood : ''}`
    const length = dto.length_m && dto.length_m > 0
      ? dto.length_m
      : Math.max(30, Math.round(polylineLengthMeters(snappedPath)))

    const item = {
      id: dto.id,
      label,
      desc,
      status: dto.status,
      snappedPath,
      length,
      hourly_rate: dto.pricing?.price_per_hour ?? null
    }

    const i = snappedBlocks.value.findIndex(b => b.id === item.id)
    if (i >= 0) {
      snappedBlocks.value[i] = item
    } else {
      snappedBlocks.value.unshift(item)
    }
    lastUpdated.value = new Date()

    // refresca sesiones propias ante cambios
    await loadMyActiveSessions()
  } catch (e) {
    console.error('Realtime upsert failed', e)
  }
}

/* =========================
   Init
   ========================= */
onMounted(async () => {
  setCenterToLocation(-26.8309, -65.2033)
  await loadBlocksFromBackend()
  await loadMyActiveSessions()

  // Suscripción tiempo real (misma región que cargás)
  unsubscribe = subscribeToMeteredRealtime({
    region: { country_code: 'AR', admin1: 'Tucumán', city: 'San Miguel de Tucumán' },
    onUpdate: upsertFromRealtime,
    onBulk: async (list) => {
      for (const dto of list) await upsertFromRealtime(dto)
      await loadMyActiveSessions()
    },
  })
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
