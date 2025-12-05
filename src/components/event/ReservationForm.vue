<template>
  <form @submit.prevent="submitReservation" class="space-y-4">
    <label class="block text-sm text-[#B0BEC5]">Zona</label>
    <select v-model="zone_id" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2">
      <option disabled value="">Seleccioná una zona</option>
      <option v-for="z in zones" :key="z.id" :value="z.id">
        {{ z.code }} — {{ z.name }}
      </option>
    </select>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-sm text-[#B0BEC5]">Desde</label>
        <input type="datetime-local" v-model="from" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2" />
      </div>
      <div>
        <label class="text-sm text-[#B0BEC5]">Hasta</label>
        <input type="datetime-local" v-model="to" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2" />
      </div>
    </div>

    <div>
      <label class="text-sm text-[#B0BEC5]">Código de ticket (opcional)</label>
      <input v-model="ticket" type="text" placeholder="PASSLINE-XYZ123"
             class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2" />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-[#00B4D8] hover:bg-newgreen text-[#0D1B2A] font-semibold rounded-xl px-5 py-3 transition disabled:opacity-60"
    >
      {{ loading ? 'Generando QR...' : 'Generar Pase Inteligente' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createReservation, type EventZone } from '../../services/eventService'

const props = defineProps<{ eventId: number; zones: EventZone[] }>()
const emit = defineEmits(['reservationCreated'])

const zone_id = ref<number | ''>('')
const from = ref('')
const to = ref('')
const ticket = ref('')
const loading = ref(false)

async function submitReservation() {
  if (!zone_id.value || !from.value || !to.value) return alert('Completá todos los campos')
  loading.value = true
  try {
    const res = await createReservation(props.eventId, {
      zone_id: Number(zone_id.value),
      valid_from: new Date(from.value),
      valid_to: new Date(to.value),
      ticket_code: ticket.value || undefined
    })
    emit('reservationCreated', res.qr_token)
  } catch (e) {
    alert('Error generando la reserva.')
  } finally {
    loading.value = false
  }
}
</script>
