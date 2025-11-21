<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#1B263B] text-white relative">
    <!-- Header -->
      <MainHeader class="hidden md:block" />
    <header
      class="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10 backdrop-blur-md bg-[#0D1B2A]/80"
    >
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          ← Volver
        </button>
        <button
          @click="router.push('/impact-dashboard')"
          class="px-5 py-2 rounded-xl bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold transition shadow-md hover:shadow-lg"
        >
          Impacto Global
        </button>
      </div>

      <div class="text-center flex-1">
        <p class="text-xs text-[#B0BEC5] uppercase tracking-widest">Detalle del evento</p>
        <h1 class="text-xl md:text-2xl font-semibold truncate">{{ event?.name || 'Cargando…' }}</h1>
      </div>

      <div class="flex items-center gap-2">
        <span class="hidden md:inline text-xs text-[#B0BEC5]">Powered by HayLugar</span>
        <span class="inline-flex h-2 w-2 rounded-full bg-[#06D6A0] animate-pulse"></span>
      </div>
    </header>

    <!-- Hero Banner -->
    <section class="relative h-[240px] md:h-[340px] overflow-hidden">
      <img
        :src="event?.banner_url || '/assets/event_placeholder.jpg'"
        class="absolute inset-0 w-full h-full object-cover brightness-75"
        :alt="event?.name || 'Evento'"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent"></div>

      <div class="relative z-10 h-full container mx-auto px-6 md:px-12 flex flex-col justify-end pb-6">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span
              class="px-3 py-1 rounded-full bg-[#06D6A0]/20 text-[#06D6A0] text-xs uppercase tracking-wider"
            >
              {{ event ? formatType(event.type) : '—' }}
            </span>
            <p class="mt-2 text-[#B0BEC5]">
              {{ event ? formatDateRange(event.start_date, event.end_date) : 'Cargando…' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-[#B0BEC5]">Estado</span>
            <span
              class="px-3 py-1 rounded-xl bg-[#00B4D8]/20 text-[#00B4D8] text-xs font-semibold"
              >Activo</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <nav class="container mx-auto px-6 md:px-12 pt-6">
      <ul class="flex gap-2 md:gap-3 overflow-x-auto">
        <li v-for="t in tabs" :key="t.key">
          <button
            :class="[
              'px-4 md:px-5 py-2 rounded-xl text-sm font-medium transition border whitespace-nowrap',
              currentTab===t.key
                ? 'bg-white text-[#0D1B2A] border-white'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            ]"
            @click="currentTab = t.key"
          >
            {{ t.label }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Tab content -->
    <section class="container mx-auto px-6 md:px-12 py-6 md:py-10 transition-all duration-500">
      <!-- OVERVIEW -->
      <div v-if="currentTab==='overview'" class="grid gap-6 md:grid-cols-3">
        <div class="md:col-span-2 bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold mb-3">Descripción</h2>
          <p class="text-[#B0BEC5] leading-relaxed">
            {{
              event?.description ||
              'Este evento utiliza la red de movilidad inteligente de HayLugar para ordenar accesos y estacionamientos, medir el impacto ambiental y mejorar la experiencia.'
            }}
          </p>

          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div class="bg-white/5 rounded-xl p-4 text-center">
              <p class="text-xs text-[#B0BEC5]">Inicio</p>
              <p class="font-semibold">{{ event ? formatDate(event.start_date) : '—' }}</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4 text-center">
              <p class="text-xs text-[#B0BEC5]">Fin</p>
              <p class="font-semibold">{{ event ? formatDate(event.end_date) : '—' }}</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4 text-center">
              <p class="text-xs text-[#B0BEC5]">Organiza</p>
              <p class="font-semibold">{{ event?.organizer || 'HayLugar' }}</p>
            </div>
          </div>
        </div>

        <aside class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-md">
          <h3 class="text-lg font-semibold mb-3">Zonas</h3>
          <ul class="space-y-2">
            <li
              v-for="z in zones"
              :key="z.id"
              class="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 hover:bg-white/10 transition"
            >
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex h-6 w-6 rounded-lg bg-[#06D6A0]/20 text-[#06D6A0] items-center justify-center text-sm font-bold"
                  >{{ z.code }}</span
                >
                <span class="text-sm">{{ z.name || ('Zona ' + z.code) }}</span>
              </div>
              <span class="text-xs text-[#B0BEC5]">{{ z.capacity_total }} cap.</span>
            </li>
          </ul>
          <button
            class="mt-5 w-full bg-[#00B4D8] hover:bg-[#06D6A0] text-[#0D1B2A] font-semibold rounded-xl px-4 py-2 transition shadow"
            @click="currentTab='reserve'"
          >
            Reservar ahora
          </button>
        </aside>
      </div>

      <!-- MAPA -->
    <div v-else-if="currentTab==='map'" class="grid gap-6 md:grid-cols-3">
    <div class="md:col-span-2 bg-[#1B263B]/70 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <EventMap
        :center="{ lat: -31.27921977572083, lng: -64.45465541996977 }"
        :zones="zones"
        :accessPoints="accessPoints"
        :bounds="{
          north: -31.2765,
          south: -31.2818,
          east: -64.4509,
          west: -64.4574
        }"
      />
    </div>

    <aside class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-md">
      <h3 class="text-lg font-semibold mb-3">Accesos y zonas</h3>
      <ul class="space-y-2">
        <li
          v-for="a in accessPoints"
          :key="a.id"
          class="bg-white/5 rounded-xl px-3 py-2 flex justify-between items-center"
        >
          <span class="text-sm">{{ a.name }}</span>
          <span class="text-xs text-[#B0BEC5] uppercase">{{ a.type }}</span>
        </li>
      </ul>
    </aside>
  </div>


      <!-- RESERVA -->
      <div v-else-if="currentTab==='reserve'" class="grid gap-6 md:grid-cols-3">
        <div class="md:col-span-2 bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold mb-6">Generar reserva</h2>
          <form @submit.prevent="onReserve" class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="text-sm text-[#B0BEC5]">Zona</label>
              <select
                v-model="form.zone_id"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              >
                <option disabled value="">Seleccioná una zona</option>
                <option v-for="z in zones" :key="z.id" :value="z.id">
                  {{ z.code }} — {{ z.name || 'Zona' }} (cap. {{ z.capacity_total }})
                </option>
              </select>
            </div>

            <div>
              <label class="text-sm text-[#B0BEC5]">Desde</label>
              <input
                type="datetime-local"
                v-model="form.valid_from"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label class="text-sm text-[#B0BEC5]">Hasta</label>
              <input
                type="datetime-local"
                v-model="form.valid_to"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div class="md:col-span-2">
              <label class="text-sm text-[#B0BEC5]">Código de ticket (opcional)</label>
              <input
                type="text"
                v-model="form.ticket_code"
                placeholder="Ej: PASSLINE-ABC123"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div class="md:col-span-2 flex items-center justify-between mt-2">
              <p class="text-xs text-[#B0BEC5]">
                Tu QR se genera con firma ES256 y funciona incluso sin internet.
              </p>
              <button
                type="submit"
                :disabled="reserving"
                class="bg-[#00B4D8] hover:bg-[#06D6A0] disabled:opacity-60 text-[#0D1B2A] font-semibold rounded-xl px-5 py-2 transition"
              >
                {{ reserving ? 'Generando…' : 'Generar QR' }}
              </button>
            </div>
          </form>
        </div>

        <aside class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-md">
          <h3 class="text-lg font-semibold mb-3">Consejos de ingreso</h3>
          <ul class="space-y-2 list-disc list-inside text-[#B0BEC5] text-sm">
            <li>Llegá 20 min antes del inicio de tu franja.</li>
            <li>Mostrá tu QR con brillo al máximo.</li>
            <li>Seguinos en la app para actualizaciones offline.</li>
          </ul>
        </aside>
      </div>

      <!-- IMPACTO -->
      <div v-else-if="currentTab==='impact'" class="grid gap-6 md:grid-cols-3">
        <div class="md:col-span-2 bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold mb-4">Impacto socio-ambiental</h2>

          <div v-if="impact" class="grid gap-4 sm:grid-cols-3">
            <MetricBox label="Ocupación" :value="impact.occupancy_pct + '%'" />
            <MetricBox label="Vehículos activos" :value="String(impact.vehicles_active)" />
            <MetricBox label="CO₂ evitado" :value="impact.co2_saved_kg + ' kg'" />
          </div>

          <div class="mt-6">
            <h3 class="text-sm text-[#B0BEC5] mb-2">Evolución (últimos snapshots)</h3>
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
              <svg :width="chartW" :height="chartH" viewBox="0 0 300 80" class="w-full">
                <polyline
                  :points="polylinePoints"
                  fill="none"
                  stroke="#06D6A0"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              <p class="text-xs text-[#B0BEC5] mt-2">Ocupación (%)</p>
            </div>
          </div>
        </div>

        <aside class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6 shadow-md">
          <h3 class="text-lg font-semibold mb-3">Sustentabilidad HayLugar</h3>
          <p class="text-[#B0BEC5] text-sm leading-relaxed">
            Ordenando los flujos de acceso y promoviendo bicicletas y caminatas, reducimos emisiones y mejoramos la experiencia.
          </p>
        </aside>
      </div>

      <!-- FALLBACK -->
      <div v-else class="text-center text-[#B0BEC5] py-16">Seleccioná una pestaña.</div>
    </section>

    <!-- Modal QR / Token -->
    <div v-if="showQR" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6">
      <div class="bg-[#0D1B2A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h3 class="text-lg font-semibold">Tu pase digital</h3>
        <p class="text-[#B0BEC5] text-sm mt-1">QR/Token firmado — válido en las fechas seleccionadas</p>

        <div class="mt-5 bg-[#1B263B] rounded-xl p-4 break-all text-xs text-[#B0BEC5] max-h-48 overflow-auto">
          {{ lastReservation?.qr_token }}
        </div>

        <div class="mt-4 flex items-center gap-3">
          <button @click="copyToken" class="px-4 py-2 rounded-xl bg-white text-[#0D1B2A] font-semibold hover:opacity-90">
            Copiar token
          </button>
          <button @click="showQR=false" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
            Cerrar
          </button>
        </div>

        <p v-if="copied" class="mt-3 text-[#06D6A0] text-sm">Token copiado ✔</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-10 text-center text-[#B0BEC5] text-xs border-t border-white/10">
      © {{ new Date().getFullYear() }} HayLugar — Red de Movilidad Inteligente
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainHeader from '../components/layout/header/MainHeader.vue'
import {
  getEvent,
  getZones,
  getAssets,
  getImpact,
  getImpactSeries,
  createReservation,
  type EventDetail,
  type EventZone,
  type EventAccessPoint,
  type ImpactSnapshot,
} from '../services/eventService'
import EventMap from '../components/EventMap.vue'

const route = useRoute()
const router = useRouter()

const eventId = Number(route.params.id)
const loading = ref(true)
const event = ref<EventDetail | null>(null)
const zones = ref<EventZone[]>([])
const accessPoints = ref<EventAccessPoint[]>([])
const overlaySrc = ref<string | null>(null)

const impact = ref<ImpactSnapshot | null>(null)
const impactSeries = ref<ImpactSnapshot[]>([])

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'map', label: 'Mapa' },
  { key: 'reserve', label: 'Reservar' },
  { key: 'impact', label: 'Impacto' },
] as const
const currentTab = ref<typeof tabs[number]['key']>('overview')

// Reserva / QR state
const form = ref({
  zone_id: '' as number | '',
  valid_from: '',
  valid_to: '',
  ticket_code: '',
})
const reserving = ref(false)
const lastReservation = ref<{ qr_token: string } | null>(null)
const showQR = ref(false)
const copied = ref(false)

// charts
const chartW = 300
const chartH = 80
const polylinePoints = computed(() => {
  if (!impactSeries.value?.length) return ''
  const values = impactSeries.value.map((s) => parseFloat(s.occupancy_pct))
  const max = Math.max(100, ...values)
  const step = chartW / (values.length - 1 || 1)
  return values
    .map((v, i) => {
      const x = Math.round(i * step)
      const y = Math.round(chartH - (v / max) * (chartH - 6) - 3)
      return `${x},${y}`
    })
    .join(' ')
})

onMounted(async () => {
  try {
    loading.value = true
    const [ev, z, assets] = await Promise.all([
      getEvent(eventId),
      getZones(eventId),
      getAssets(eventId),
    ])
    event.value = ev
    zones.value = z
    accessPoints.value = ev?.access_points || []
    overlaySrc.value = assets.find((a) => a.asset_type === 'svg_overlay')?.url || null

    const [snap, series] = await Promise.all([getImpact(eventId), getImpactSeries(eventId)])
    impact.value = snap
    impactSeries.value = series
  } catch (e) {
    console.error('Error cargando detalle:', e)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/events')
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  const e = new Date(end).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${s} – ${e}`
}

function formatType(type: string) {
  const map: Record<string, string> = {
    festival: 'Festival',
    concert: 'Concierto',
    sports: 'Deportivo',
    fair: 'Feria',
    municipal: 'Municipal',
    university: 'Universitario',
    other: 'Evento',
  }
  return map[type] || 'Evento'
}

async function onReserve() {
  try {
    copied.value = false
    if (!form.value.zone_id || !form.value.valid_from || !form.value.valid_to) {
      alert('Completá zona, fecha y hora.')
      return
    }
    reserving.value = true
    const res = await createReservation(eventId, {
      zone_id: Number(form.value.zone_id),
      valid_from: new Date(form.value.valid_from),
      valid_to: new Date(form.value.valid_to),
      ticket_code: form.value.ticket_code || undefined,
    })
    lastReservation.value = { qr_token: res.qr_token }
    showQR.value = true
  } catch (e) {
    console.error('Error al reservar:', e)
    alert('No se pudo generar el QR. Intentá nuevamente.')
  } finally {
    reserving.value = false
  }
}

async function copyToken() {
  if (!lastReservation.value?.qr_token) return
  try {
    await navigator.clipboard.writeText(lastReservation.value.qr_token)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<script lang="ts">
export default {
  components: {
    MetricBox: {
      props: { label: { type: String, required: true }, value: { type: String, required: true } },
      template: `
        <div class="bg-white/5 rounded-xl p-4 border border-white/10">
          <p class="text-xs text-[#B0BEC5]">{{ label }}</p>
          <p class="text-xl font-semibold mt-1">{{ value }}</p>
        </div>
      `,
    },
  },
}
</script>

<style scoped>
/* micro-animación sutil de “vida” en el fondo si querés sumar luego
@keyframes glow {
  0%, 100% { opacity: .25; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.03); }
}
*/
</style>
