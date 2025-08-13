<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[999] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="onClose" />
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">UTN</div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Confirmar acceso</h3>
            <p class="text-xs text-gray-500">Solo para miembros activos de la universidad</p>
          </div>
          <button class="ml-auto text-gray-400 hover:text-gray-600" @click="onClose">✕</button>
        </div>

        <!-- Space summary -->
        <div class="mt-3 p-3 rounded-lg border bg-gray-50">
          <div class="text-sm font-semibold text-gray-800">{{ space?.name }}</div>
          <div class="text-xs text-gray-600">📍 {{ space?.location }}</div>
          <div class="text-xs mt-1" :class="(spaceCapacity > 0) ? 'text-emerald-600' : 'text-rose-600'">
            {{ (spaceCapacity > 0) ? 'Disponible' : 'Sin disponibilidad' }}
          </div>
        </div>

        <!-- Form -->
        <form class="mt-4 space-y-3" @submit.prevent="submit">
          <div>
            <label class="block text-sm font-medium text-gray-700">Legajo</label>
            <input
              v-model.trim="legajo"
              type="text"
              inputmode="numeric"
              class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="Ej. 12345"
              required
            />
          </div>

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
            <p class="text-[11px] text-gray-500 mt-1">Se validará contra tus vehículos registrados o se creará uno mínimo con esa patente.</p>
          </div>

          <!-- Duración (demo) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Duración (hs)</label>
            <select v-model.number="durationHours" class="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
              <option :value="2">2 horas</option>
              <option :value="4">4 horas</option>
              <option :value="6">6 horas</option>
            </select>
          </div>

          <div v-if="error" class="text-sm text-rose-600">{{ error }}</div>

          <button
            type="submit"
            class="w-full bg-primary text-white font-semibold rounded-lg py-2 mt-2 hover:bg-primary-dark transition disabled:opacity-60"
            :disabled="loading"
          >
            <span v-if="!loading">Confirmar acceso</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/></svg>
              Validando…
            </span>
          </button>
        </form>

        <!-- Success -->
        <div v-if="success" class="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          Acceso autorizado. Reserva creada #{{ success?.reservation?.id }} ({{ success?.reservation?.status }}).
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { verifyLegajo, lookupOrCreateVehicle, createUniversityReservation } from '../services/universityAccessService'
import { useUserStore } from '../store/userStore'

type SpaceLite = {
  id: number
  owner_id: number
  university_id: number
  name: string
  location: string
  latitude: number|string
  longitude: number|string
  access_group?: 'students'|'staff'
  capacity?: number|null
  vehicle_capacities?: any
}

const props = defineProps<{
  open: boolean
  space: SpaceLite | null
}>()

const emits = defineEmits<{
  (e:'close'): void
  (e:'success', payload: any): void
}>()

const userStore = useUserStore()
const legajo = ref('')
const patente = ref('')
const durationHours = ref(2)
const loading = ref(false)
const error = ref<string|null>(null)
const success = ref<any|null>(null)

const open = computed(() => props.open)
const space = computed(() => props.space)

const spaceCapacity = computed(() => {
  if (!space.value) return 0
  if (typeof space.value.capacity === 'number') return space.value.capacity
  try {
    const caps = typeof space.value.vehicle_capacities === 'string'
      ? JSON.parse(space.value.vehicle_capacities)
      : (space.value.vehicle_capacities || [])
    return caps.reduce((acc: number, it: any) => acc + Number(it.capacity || 0), 0)
  } catch { return 0 }
})

watch(open, (val) => {
  if (val) {
    error.value = null
    success.value = null
  }
})

const onClose = () => emits('close')

const submit = async () => {
  if (!space.value) return
  error.value = null
  loading.value = true
  success.value = null

  try {
    // 1) Verificar legajo activo en esa universidad
    await verifyLegajo(userStore.user.id, space.value.university_id)

    // 2) Buscar/crear vehículo por patente -> vehicle_id
    const vehicleId = await lookupOrCreateVehicle(patente.value)

    // 3) Crear reserva universitaria (gratis, auto-aprobada en backend)
    const start = new Date()
    const end = new Date(start.getTime() + durationHours.value * 60 * 60 * 1000)

    const payload = {
      owner_id: space.value.owner_id,
      space_id: space.value.id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      total: 0,
      vehicle_type: 'car',          // simplificado
      vehicle_id: vehicleId,
      payment_method: null,
      payment_data: null
    }

    const res = await createUniversityReservation(payload)
    success.value = res
    emits('success', res)

  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'No se pudo confirmar el acceso'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease}
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
