<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[999] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />
      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-5">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">⏱</div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Mis tickets activos</h3>
            <p class="text-xs text-gray-500">Finaliza cuando te vayas para liberar la cuadra</p>
          </div>
          <button class="ml-auto text-gray-400 hover:text-gray-600" @click="$emit('close')">✕</button>
        </div>

        <!-- Contenido -->
        <div class="mt-3 space-y-3" v-if="loading">
          <div class="h-20 rounded-lg bg-gray-100 animate-pulse"></div>
          <div class="h-20 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>

        <div v-else>
          <div v-if="!sessions.length" class="p-4 rounded-lg bg-gray-50 border text-sm text-gray-600">
            No tenés tickets activos en este momento.
          </div>

          <div v-else class="space-y-3">
            <div v-for="s in sessions" :key="s.id" class="border rounded-xl p-3 bg-white shadow-sm">
              <div class="flex items-start gap-2">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                  {{ plateText(s) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-gray-900">Ticket #{{ s.id }}</div>
                    <span
                      class="text-[11px] px-2 py-0.5 rounded-full"
                      :class="badgeClass(s.status)"
                    >
                      {{ statusLabel(s.status) }}
                    </span>
                    <div class="ml-auto text-xs text-gray-500">
                      {{ zoneText(s) }}
                    </div>
                  </div>

                  <div class="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <div class="text-[11px] text-gray-500">Inició</div>
                      <div class="font-medium">{{ fmtTime(s.start_time) }}</div>
                    </div>
                    <div>
                      <div class="text-[11px] text-gray-500">Limite estimado</div>
                      <div class="font-medium">{{ fmtTime(s.end_time) }}</div>
                    </div>
                    <div>
                      <div class="text-[11px] text-gray-500">Transcurrido</div>
                      <div class="font-medium">{{ elapsedText(s.start_time) }}</div>
                    </div>
                    <div>
                      <div class="text-[11px] text-gray-500">Restante</div>
                      <div class="font-medium">{{ remainingText(s.end_time) }}</div>
                    </div>
                  </div>

                  <div class="mt-2 flex items-center text-sm">
                    <span class="text-gray-600">Estimado:</span>
                    <span class="ml-1 font-semibold">${{ asMoney(s.estimated_total) }}</span>
                    <span v-if="s.final_total" class="ml-3 text-gray-600">Final:</span>
                    <span v-if="s.final_total" class="ml-1 font-semibold">${{ asMoney(s.final_total) }}</span>
                  </div>

                  <div class="mt-3 flex items-center gap-2">
                    <button
                      class="px-3 py-1.5 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-60"
                      :disabled="actionBusyId === s.id"
                      @click="confirmFinish(s)"
                    >
                      <span v-if="actionBusyId !== s.id">Finalizar ahora</span>
                      <span v-else class="inline-flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/></svg>
                        Procesando…
                      </span>
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50 transition"
                      @click="refresh"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>

              <!-- Mensaje de éxito por sesión -->
              <div
                v-if="successMap[s.id]"
                class="mt-3 p-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs"
              >
                Sesión finalizada. Total: ${{ asMoney(successMap[s.id].total) }}.
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="mt-3 p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {{ error }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch,defineProps, defineEmits } from 'vue'
import { useUserStore } from '../store/userStore'
import { meteredParkingService } from '../services/meteredParkingService'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e:'close'): void }>()

const userStore = useUserStore()
const sessions = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const actionBusyId = ref<number | null>(null)
const successMap = ref<Record<number, { total: number }>>({})

const open = computed(() => !!props.open)

watch(open, (val) => { if (val) refresh() })

async function refresh() {
  error.value = null
  loading.value = true
  try {
    const uid = userStore?.user?.id
    if (!uid) { sessions.value = []; return }
    sessions.value = await meteredParkingService.listActiveSessionsByUser(uid)
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'No fue posible cargar tus tickets activos.'
  } finally {
    loading.value = false
  }
}

function fmtTime(iso: string | Date) {
  try { return new Date(iso).toLocaleTimeString() } catch { return '—' }
}
function elapsedText(start: string | Date) {
  const ms = Date.now() - new Date(start).getTime()
  const min = Math.max(0, Math.round(ms / 60000))
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), r = min % 60
  return `${h}h ${r}m`
}
function remainingText(end: string | Date) {
  const ms = new Date(end).getTime() - Date.now()
  const min = Math.max(0, Math.round(ms / 60000))
  if (ms <= 0) return 'vencido'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), r = min % 60
  return `${h}h ${r}m`
}
function asMoney(v: string | number | null | undefined) {
  const n = Number(v ?? 0)
  return n.toFixed(2)
}
function plateText(s: any) {
  // si el backend adjunta patente, úsala; si no, muestra id de vehículo
  return s?.vehicle?.license_plate?.slice(-4) || (s?.vehicle_id ? `#${String(s.vehicle_id).slice(-2)}` : 'PL')
}
function zoneText(s: any) {
  // si en la API devolvés datos de la cuadra/avenida: usa street/segment; si no, el id
  return s?.zone?.label || (s?.zone_id ? `Zona ${s.zone_id}` : '')
}
function statusLabel(st: string) {
  if (st === 'active') return 'Activa'
  if (st === 'expired') return 'Vencida'
  if (st === 'completed') return 'Cerrada'
  if (st === 'cancelled') return 'Cancelada'
  return st
}
function badgeClass(st: string) {
  if (st === 'active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (st === 'expired') return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (st === 'completed') return 'bg-gray-100 text-gray-700 border border-gray-200'
  if (st === 'cancelled') return 'bg-gray-100 text-gray-500 border border-gray-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

async function confirmFinish(s: any) {
  if (actionBusyId.value) return
  const ok = window.confirm('¿Finalizar este ticket ahora? El total se recalculará prorrateado.')
  if (!ok) return

  error.value = null
  actionBusyId.value = s.id
  try {
    const res = await meteredParkingService.completeMeteredSession(s.id)
    // res = { session, total }
    successMap.value[s.id] = { total: Number(res?.total ?? 0) }
    // sacarlo de la lista local (el scanner/WS igual actualizará el mapa)
    sessions.value = sessions.value.filter(x => x.id !== s.id)
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'No se pudo finalizar el ticket.'
  } finally {
    actionBusyId.value = null
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
