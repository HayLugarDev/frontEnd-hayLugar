<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[999] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />

      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="px-5 pt-5 pb-4 border-b bg-gradient-to-br from-white to-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-primary/90 text-white flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4h7a5 5 0 0 1 0 10H11v6H7V4zm4 6h3a1 1 0 0 0 0-2h-3v2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 leading-tight">Iniciar estacionamiento medido</h3>
              <p class="text-xs text-gray-500">Gestioná tu ticket y forma de pago</p>
            </div>
            <button class="ml-auto text-gray-400 hover:text-gray-600" @click="onClose" aria-label="Cerrar">✕</button>
          </div>

          <!-- Zone summary -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2 p-3 rounded-xl border bg-gray-50/80">
              <div class="flex items-start gap-2">
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800 line-clamp-1">{{ zoneLabel }}</div>
                  <div class="mt-1 text-[11px] text-gray-500">Tarifa por hora</div>
                  <div class="mt-1 h-6">
                    <div v-if="hourlyRate === null" class="w-24 h-5 rounded-md bg-gray-200 animate-pulse"></div>
                    <div v-else class="inline-flex items-baseline gap-1">
                      <span class="text-base font-bold text-gray-900">${{ safeHourlyRate.toFixed(2) }}</span>
                      <span class="text-xs text-gray-500">/ hora</span>
                    </div>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-full border" :class="chipClass">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotClass" />
                  {{ statusLabel }}
                </span>
              </div>
            </div>
            <div class="p-3 rounded-xl border bg-white">
              <div class="text-[11px] text-gray-500">Costo estimado</div>
              <div class="mt-1 text-2xl font-bold text-gray-900 leading-none">${{ totalCost.toFixed(2) }}</div>
              <div class="mt-1 text-[11px] text-gray-500">Se cobra al iniciar. Excedente prorrateado.</div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form class="px-5 py-5 space-y-4" @submit.prevent="submit">
          <!-- Selector modo -->
          <div class="flex items-center gap-2 text-sm">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg border transition"
              :class="mode==='saved' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
              @click="mode='saved'"
            >
              Usar vehículo guardado
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg border transition"
              :class="mode==='manual' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
              @click="mode='manual'"
            >
              Ingresar patente
            </button>
          </div>

          <!-- Vehículos guardados -->
          <div v-if="mode==='saved'">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mis vehículos</label>
              <span v-if="loadingVehicles" class="text-xs text-gray-400">Cargando…</span>
            </div>

            <div v-if="!loadingVehicles && savedVehicles.length===0" class="rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-600">
              No tenés vehículos guardados. Cambiá a “Ingresar patente” o agregá uno en tu perfil.
            </div>

            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="v in savedVehicles"
                :key="v.id"
                type="button"
                class="px-3 py-1.5 rounded-full border text-sm transition"
                :class="selectedVehicleId===v.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                @click="selectVehicle(v.id, v.license_plate)"
                :title="vehicleTitle(v)"
              >
                {{ v.license_plate || (v.type==='bicycle' ? 'Bicicleta' : '—') }}
              </button>
            </div>
          </div>

          <!-- Patente manual -->
          <div v-if="mode==='manual'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Patente</label>
            <div class="relative">
              <input
                v-model.trim="patente"
                type="text"
                class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary uppercase pr-10"
                placeholder="ABC123 o AB123CD"
                @input="patente = patente.toUpperCase()"
                required
              />
              <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7H3V7zm0 9h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1z"/>
                </svg>
              </div>
            </div>
            <p class="mt-1 text-[11px] text-gray-500">Se asociará a tu cuenta automáticamente.</p>
          </div>

          <!-- Duración + Método -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="h in [1,2,3,4]"
                  :key="h"
                  type="button"
                  class="px-2 py-1.5 rounded-lg text-sm border transition"
                  :class="durationHours === h ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  @click="durationHours = h"
                >
                  {{ h }}h
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
              <div class="relative">
                <select v-model="paymentMethod" class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary">
                  <option value="mercadopago">Mercado Pago</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
              </div>
            </div>
          </div>

          <!-- Datos de tarjeta -->
          <div v-if="paymentMethod==='tarjeta'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Titular</label>
              <input v-model.trim="card.name" type="text" class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary" placeholder="Nombre y Apellido" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">N° de tarjeta</label>
              <input v-model.trim="card.number" inputmode="numeric" maxlength="19" class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary" placeholder="0000 0000 0000 0000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Venc.</label>
              <input v-model.trim="card.exp" class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary" placeholder="MM/AA" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input v-model.trim="card.cvv" inputmode="numeric" maxlength="4" class="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary" placeholder="***" />
            </div>
          </div>

          <!-- Mensajes -->
          <div v-if="error" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {{ error }}
          </div>
          <div v-if="success" class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Estacionamiento iniciado. Ticket #{{ successSessionId }} — vence aprox. a las {{ successEndTimeText }}.
          </div>

          <!-- Actions -->
          <div class="pt-1">
            <button
              type="submit"
              class="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl py-2.5 hover:bg-primary/90 transition disabled:opacity-60"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" stroke-width="4"/>
              </svg>
              <span>{{ loading ? 'Procesando…' : 'Iniciar estacionamiento' }}</span>
            </button>
            <p class="mt-2 text-[11px] text-gray-500 text-center">Al continuar aceptás términos y condiciones del servicio.</p>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch, onMounted } from 'vue'
import { useUserStore } from '../store/userStore'
import { meteredParkingService } from '../services/meteredParkingService'
import { vehiclesService, type Vehicle } from '../services/vehicleService'

type ZoneLite = { id: number; label: string; status?: 'free'|'limited'|'full'; hourly_rate?: number|null }

const props = defineProps<{ open: boolean; zone: ZoneLite | null }>()
const emits = defineEmits<{ (e:'close'): void; (e:'success', payload: any): void }>()

const userStore = useUserStore()

// --------- estado UI
const mode = ref<'saved'|'manual'>('saved') // nuevo
const savedVehicles = ref<Vehicle[]>([])
const loadingVehicles = ref(false)
const selectedVehicleId = ref<number|null>(null)

const patente = ref('')
const durationHours = ref(2)
const paymentMethod = ref<'mercadopago'|'tarjeta'>('mercadopago')
const card = ref({ name: '', number: '', exp: '', cvv: '' })

const loading = ref(false)
const error = ref<string|null>(null)
const success = ref<any|null>(null)

// --------- zone & tarifa
const open = computed(() => !!props.open)
const zoneId = computed<number | null>(() => props.zone?.id != null ? Number(props.zone.id) : null)
const zoneLabel = computed(() => props.zone?.label || 'Zona medida')
const zoneStatus = computed<ZoneLite['status']>(() => props.zone?.status || 'free')

const statusLabel = computed(() => zoneStatus.value === 'free' ? 'Libre' : zoneStatus.value === 'limited' ? 'Media ocupación' : 'Ocupada')
const hourlyRate = ref<number | null>(props.zone?.hourly_rate ?? null)
const safeHourlyRate = computed(() => Number(hourlyRate.value ?? 250))

const chipClass = computed(() => {
  const s = zoneStatus.value
  if (s === 'free')     return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s === 'limited')  return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
})
const dotClass = computed(() => {
  const s = zoneStatus.value
  if (s === 'free')     return 'bg-emerald-500'
  if (s === 'limited')  return 'bg-amber-500'
  return 'bg-rose-500'
})

// --------- helpers
const vehicleTitle = (v: Vehicle) =>
  `${v.license_plate || (v.type==='bicycle' ? 'Bicicleta' : '—')} · ${v.brand ?? ''} ${v.model ?? ''}`.trim()

const selectVehicle = (id: number, plate: string | null) => {
  selectedVehicleId.value = id
  // Para referencia visual, llenamos la patente (no se usa si mode='saved')
  patente.value = plate || ''
}

const fetchRate = async () => {
  if (!zoneId.value) return
  try {
    const t = await meteredParkingService.getTariff(zoneId.value)
    if (t && typeof t.hourly_rate === 'number') hourlyRate.value = t.hourly_rate
    else if (props.zone?.hourly_rate != null)  hourlyRate.value = Number(props.zone.hourly_rate)
  } catch {
    if (props.zone?.hourly_rate != null) hourlyRate.value = Number(props.zone.hourly_rate)
    else hourlyRate.value = 250
  }
}

const fetchMyVehicles = async () => {
  loadingVehicles.value = true
  try {
    const list = await vehiclesService.getAllVehicles()
    savedVehicles.value = Array.isArray(list) ? list : []
    // auto-selección: si hay al menos uno, quedate con el más reciente
    if (savedVehicles.value.length) {
      const first = savedVehicles.value[0]
      selectedVehicleId.value = first.id
      patente.value = first.license_plate || ''
    }
  } finally {
    loadingVehicles.value = false
  }
}

// resets al abrir / cambiar zona
watch(() => props.open, async (val) => {
  if (val) {
    error.value = null; success.value = null
    mode.value = 'saved'
    await Promise.all([fetchRate(), fetchMyVehicles()])
  }
})
watch(() => props.zone?.id, async () => {
  error.value = null; success.value = null
  await fetchRate()
})

onMounted(() => { if (open.value) { fetchRate(); fetchMyVehicles() } })

const totalCost = computed(() => Math.max(0, Number(safeHourlyRate.value) * Number(durationHours.value || 0)))
const onClose = () => emits('close')

const successSessionId = computed(() => success.value?.session?.id ?? success.value?.id ?? '—')
const successEndTimeText = computed(() => {
  const s = success.value?.session
  const iso = s?.end_time ?? s?.end_time_real ?? s?.end_time_expected
  if (s?.end_time_fmt) return s.end_time_fmt
  if (iso) { try { return new Date(iso).toLocaleTimeString() } catch {} }
  return '—'
})

// --------- submit
const submit = async () => {
  error.value = null
  success.value = null

  if (!zoneId.value) { error.value = 'Zona inválida. Cerrá y volvé a intentar desde el mapa.'; return }
  const uid = userStore?.user?.id
  if (!uid) { error.value = 'Debes iniciar sesión para continuar.'; return }

  let vehicleId: number | null = null

  if (mode.value === 'saved') {
    if (!selectedVehicleId.value) {
      error.value = 'Elegí un vehículo guardado o cambiá a “Ingresar patente”.'
      return
    }
    vehicleId = selectedVehicleId.value
  } else {
    if (!patente.value || patente.value.length < 5) {
      error.value = 'Ingresá una patente válida.'
      return
    }
    vehicleId = await meteredParkingService.ensureVehicle(patente.value)
    if (!vehicleId) { error.value = 'No se pudo registrar/asegurar el vehículo'; return }
  }

  // tiempos
  const start = new Date()
  const end = new Date(start.getTime() + durationHours.value * 60 * 60 * 1000)

  loading.value = true
  try {
    const payload: any = {
      user_id: uid,
      block_id: zoneId.value,
      zone_id: zoneId.value, // compat
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      estimated_total: totalCost.value,
      vehicle_id: vehicleId,
      payment_method: paymentMethod.value,
      payment_data: paymentMethod.value === 'tarjeta'
        ? { name: card.value.name, number: card.value.number, exp: card.value.exp, cvv: card.value.cvv }
        : null
    }
    const res = await meteredParkingService.createMeteredSession(payload)
    success.value = res
    emits('success', res)
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'No se pudo iniciar el estacionamiento'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
