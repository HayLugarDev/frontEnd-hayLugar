<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[999] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />

      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">⏹</div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Finalizar estacionamiento</h3>
            <p class="text-xs text-gray-500">Se calculará el total final (uso + penalidad si corresponde)</p>
          </div>
          <button class="ml-auto text-gray-400 hover:text-gray-600" @click="onClose">✕</button>
        </div>

        <!-- Zona -->
        <div class="mt-3 p-3 rounded-lg border bg-gray-50">
          <div class="text-sm font-semibold text-gray-800">
            {{ zoneLabel || 'Zona medida' }}
          </div>
          <div class="text-[11px] text-gray-500 mt-1">
            Ticket #{{ sessionId }} — se cerrará ahora
          </div>
        </div>

        <!-- Resumen previo -->
        <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2 rounded-lg border bg-white">
            <div class="text-gray-500">Tarifa</div>
            <div class="font-semibold">${{ (tariff ?? 0).toFixed(2) }}/h</div>
          </div>
          <div class="p-2 rounded-lg border bg-white">
            <div class="text-gray-500">Gracia</div>
            <div class="font-semibold">{{ graceMinutes ?? 5 }} min</div>
          </div>
          <div class="p-2 rounded-lg border bg-white">
            <div class="text-gray-500">Estado</div>
            <div
              class="font-semibold"
              :class="{
                'text-amber-600': previewOverdue,
                'text-emerald-600': !previewOverdue
              }"
            >
              {{ previewOverdue ? 'Posible penalidad' : 'Sin penalidad' }}
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</div>

        <!-- Botones -->
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            class="w-full border border-gray-300 text-gray-700 font-semibold rounded-lg py-2 hover:bg-gray-50 transition"
            @click="onClose"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            class="w-full bg-rose-600 text-white font-semibold rounded-lg py-2 hover:bg-rose-700 transition disabled:opacity-60"
            :disabled="loading"
            @click="confirmFinish"
          >
            <span v-if="!loading">Finalizar ahora</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/></svg>
              Procesando…
            </span>
          </button>
        </div>

        <!-- Resultado -->
        <div v-if="result" class="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <div class="font-semibold">Ticket cerrado correctamente</div>
          <div class="mt-1 grid grid-cols-2 gap-2 text-[13px]">
            <div class="flex items-center justify-between">
              <span>Uso (min):</span><span class="font-semibold">{{ result.usage_minutes }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Overdue (min):</span><span class="font-semibold">{{ result.overdue_minutes }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Monto uso:</span><span class="font-semibold">${{ result.usage_bill.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Penalidad:</span><span class="font-semibold">${{ result.penalty_bill.toFixed(2) }}</span>
            </div>
            <div class="col-span-2 mt-1 border-t pt-2 flex items-center justify-between">
              <span>Total final:</span><span class="font-bold text-emerald-700 text-base">${{ result.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Cerrar tras éxito -->
        <div v-if="result" class="mt-3">
          <button class="w-full border border-emerald-300 text-emerald-700 font-semibold rounded-lg py-2 hover:bg-emerald-50 transition"
                  @click="emitCloseAfterSuccess">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, watch } from 'vue'
import { meteredParkingService } from '../services/meteredParkingService'

const props = defineProps<{
  open: boolean
  sessionId: number | null
  zoneLabel?: string
  tariff?: number | null
  graceMinutes?: number | null
  expectedEndISO?: string | null
}>()

const emits = defineEmits<{
  (e:'close'): void
  (e:'completed', payload: any): void
}>()

const loading = ref(false)
const error = ref<string|null>(null)
const result = ref<null | {
  usage_minutes: number
  overdue_minutes: number
  usage_bill: number
  penalty_bill: number
  total: number
}>(null)

const open = computed(() => !!props.open)
const sessionId = computed(() => props.sessionId ?? null)
const zoneLabel = computed(() => props.zoneLabel ?? 'Zona medida')
const tariff = computed(() => Number(props.tariff ?? 0))
const graceMinutes = computed(() => Number(props.graceMinutes ?? 5))

const previewOverdue = computed(() => {
  if (!props.expectedEndISO) return false
  try {
    const end = new Date(props.expectedEndISO).getTime()
    const grace = graceMinutes.value * 60 * 1000
    return Date.now() > (end + grace)
  } catch { return false }
})

watch(open, v => { if (v) { error.value = null; result.value = null } })

const onClose = () => emits('close')

const confirmFinish = async () => {
  error.value = null
  result.value = null
  if (!sessionId.value) { error.value = 'Sesión inválida'; return }
  loading.value = true
  try {
    const data = await meteredParkingService.completeSession(sessionId.value)
    result.value = {
      usage_minutes: Number(data?.usage_minutes ?? 0),
      overdue_minutes: Number(data?.overdue_minutes ?? 0),
      usage_bill: Number(data?.usage_bill ?? 0),
      penalty_bill: Number(data?.penalty_bill ?? 0),
      total: Number(data?.total ?? 0),
    }
    emits('completed', data)
  } catch (e:any) {
    error.value = e?.response?.data?.message || e?.message || 'No se pudo finalizar la sesión'
  } finally {
    loading.value = false
  }
}

const emitCloseAfterSuccess = () => emits('close')
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
