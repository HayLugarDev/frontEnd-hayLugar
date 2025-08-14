<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[999] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">P</div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Iniciar estacionamiento medido</h3>
            <p class="text-xs text-gray-500">Cobro por hora según zona</p>
          </div>
          <button class="ml-auto text-gray-400 hover:text-gray-600" @click="onClose">✕</button>
        </div>

        <!-- Zone summary -->
        <div class="mt-3 p-3 rounded-lg border bg-gray-50">
          <div class="text-sm font-semibold text-gray-800">{{ zoneLabel }}</div>
          <div class="text-xs text-gray-600">
            Tarifa:
            <span class="font-semibold">
              ${{ safeHourlyRate.toFixed(2) }}
            </span> / hora
          </div>
          <div class="text-[11px] text-gray-500 mt-1">
            Estado:
            <span
              :class="{
                'text-emerald-600': zoneStatus==='free',
                'text-amber-600': zoneStatus==='limited',
                'text-rose-600': zoneStatus==='full'
              }"
            >
              {{ statusLabel }}
            </span>
          </div>
        </div>

        <!-- Form -->
        <form class="mt-4 space-y-3" @submit.prevent="submit">
          <div>
            <label class="block text-sm font-medium text-gray-700">Patente</label>
            <input
              v-model.trim="patente"
              type="text"
              class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary uppercase"
              placeholder="Ej. ABC123 o AB123CD"
              @input="patente = patente.toUpperCase()"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Duración (hs)</label>
              <select v-model.number="durationHours" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                <option :value="1">1 hora</option>
                <option :value="2">2 horas</option>
                <option :value="3">3 horas</option>
                <option :value="4">4 horas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Método de pago</label>
              <select v-model="paymentMethod" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                <option value="mercadopago">MercadoPago</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          <!-- Datos de pago mínimos (mock) -->
          <div v-if="paymentMethod==='tarjeta'" class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Titular</label>
              <input v-model.trim="card.name" type="text" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="Nombre y Apellido" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">N° de tarjeta</label>
              <input v-model.trim="card.number" inputmode="numeric" maxlength="19" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="0000 0000 0000 0000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Venc.</label>
              <input v-model.trim="card.exp" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="MM/AA" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CVV</label>
              <input v-model.trim="card.cvv" inputmode="numeric" maxlength="4" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary" placeholder="***" />
            </div>
          </div>

          <!-- Resumen de costo -->
          <div class="mt-1 p-3 rounded-lg border bg-gray-50 text-sm">
            <div class="flex items-center">
              <span class="text-gray-600">Costo estimado:</span>
              <span class="ml-auto font-semibold">${{ totalCost.toFixed(2) }}</span>
            </div>
            <div class="text-[11px] text-gray-500">Se cobrará al iniciar. El exceso se prorratea al finalizar.</div>
          </div>

          <div v-if="error" class="text-sm text-rose-600">{{ error }}</div>

          <button
            type="submit"
            class="w-full bg-primary text-white font-semibold rounded-lg py-2 mt-2 hover:bg-primary-dark transition disabled:opacity-60"
            :disabled="loading"
          >
            <span v-if="!loading">Iniciar estacionamiento</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/></svg>
              Procesando…
            </span>
          </button>
        </form>

        <!-- Success -->
        <div
          v-if="success"
          class="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm"
        >
          Estacionamiento iniciado. Ticket #{{ successSessionId }} — vence aprox. a las {{ successEndTimeText }}.
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch, onMounted } from 'vue'
import { useUserStore } from '../store/userStore'
import { meteredParkingService } from '../services/meteredParkingService'

type ZoneLite = {
  id: number
  label: string
  status?: 'free'|'limited'|'full'
  hourly_rate?: number|null
}

const props = defineProps<{
  open: boolean
  zone: ZoneLite | null
}>()

const emits = defineEmits<{
  (e:'close'): void
  (e:'success', payload: any): void
}>()

const userStore = useUserStore()

const patente = ref('')
const durationHours = ref(2)
const paymentMethod = ref<'mercadopago'|'tarjeta'>('mercadopago')

const card = ref({ name: '', number: '', exp: '', cvv: '' })

const loading = ref(false)
const error = ref<string|null>(null)
const success = ref<any|null>(null)

/** Derivados seguros (evitan ?. en template y NPEs) */
const open = computed(() => !!props.open)
const zoneId = computed<number | null>(() => (props.zone && typeof props.zone.id !== 'undefined')
  ? Number(props.zone.id)
  : null
)
const zoneLabel = computed(() => props.zone?.label || 'Zona medida')
const zoneStatus = computed<ZoneLite['status']>(() => props.zone?.status || 'free')

const statusLabel = computed(() => {
  const s = zoneStatus.value
  return s === 'free' ? 'Libre' : s === 'limited' ? 'Media ocupación' : 'Ocupada'
})

/** Tarifa (fallback 250 si no hay backend de tarifa) */
const hourlyRate = ref<number | null>(props.zone?.hourly_rate ?? null)
const safeHourlyRate = computed(() => Number(hourlyRate.value ?? 250))

/** Pide tarifa real si existe endpoint; no rompe si falla */
const fetchRate = async () => {
  if (!zoneId.value) return
  try {
    const t = await meteredParkingService.getTariff(zoneId.value) // GET /metered/zone/:id/tariff (si lo tenés)
    if (t && typeof t.hourly_rate === 'number') {
      hourlyRate.value = t.hourly_rate
    } else if (props.zone?.hourly_rate != null) {
      hourlyRate.value = Number(props.zone.hourly_rate)
    }
  } catch {
    if (props.zone?.hourly_rate != null) {
      hourlyRate.value = Number(props.zone.hourly_rate)
    } else {
      hourlyRate.value = 250
    }
  }
}

/** Reseteos leves al abrir y al cambiar la zone */
watch(() => props.open, (val) => {
  if (val) {
    error.value = null
    success.value = null
    patente.value = ''
    if (props.zone?.hourly_rate != null) hourlyRate.value = Number(props.zone.hourly_rate)
    // intenta refrescar tarifa real al abrir
    fetchRate()
  }
})

watch(() => props.zone?.id, () => {
  // si cambia la zona, refrescamos tarifa y limpiamos estado
  error.value = null
  success.value = null
  if (props.zone?.hourly_rate != null) hourlyRate.value = Number(props.zone.hourly_rate)
  fetchRate()
})

onMounted(fetchRate)

const totalCost = computed(() =>
  Math.max(0, Number(safeHourlyRate.value) * Number(durationHours.value || 0))
)

const onClose = () => emits('close')

/** Campos de success seguros para template */
const successSessionId = computed(() => success.value?.session?.id ?? success.value?.id ?? '—')
const successEndTimeText = computed(() => {
  const s = success.value?.session
  const iso = s?.end_time ?? s?.end_time_real ?? s?.end_time_expected
  if (s?.end_time_fmt) return s.end_time_fmt
  if (iso) {
    try { return new Date(iso).toLocaleTimeString() } catch { /* ignore */ }
  }
  return '—'
})

/** Enviar start-session */
const submit = async () => {
  error.value = null
  success.value = null

  if (!zoneId.value) {
    error.value = 'Zona inválida. Cerrá y volvé a intentar desde el mapa.'
    return
  }

  const uid = userStore?.user?.id
  if (!uid) {
    error.value = 'Debes iniciar sesión para continuar.'
    return
  }

  if (!patente.value || patente.value.length < 5) {
    error.value = 'Ingresá una patente válida.'
    return
  }

  loading.value = true
  try {
    // 1) Asegurar vehículo
    const vehicleId = await meteredParkingService.ensureVehicle(patente.value)
    if (!vehicleId) throw new Error('No se pudo registrar/asegurar el vehículo')

    // 2) Crear sesión/ticket (enviamos block_id; si tu backend espera zone_id lo incluimos también)
    const start = new Date()
    const end = new Date(start.getTime() + durationHours.value * 60 * 60 * 1000)

    const payload: any = {
      user_id: uid,
      block_id: zoneId.value,           // <- recomendado (backend)
      zone_id: zoneId.value,            // <- por compatibilidad con tu mock anterior
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
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease}
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
