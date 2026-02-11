<template>
  <div class="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 class="text-lg font-semibold mb-3">Disponibilidad real</h3>

    <p v-if="!availability" class="text-[#90A4AE] text-sm">
      No hay información de disponibilidad cargada.
    </p>

    <div v-else class="space-y-3 text-sm">
      <p>
        <strong>Estado general:</strong>
        {{ statusText }}
      </p>

      <p v-if="availability.next_blocked">
        <strong>Próxima ocupación:</strong>
        {{ availability.next_blocked.start }} → {{ availability.next_blocked.end }}
      </p>

      <p v-if="availability.free_hours">
        <strong>Horas libres hoy:</strong>
        {{ availability.free_hours }} hs
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ availability: any | null }>()

const status = props.availability?.status || 'unknown'

const statusText =
  status === 'available'
    ? 'Disponible'
    : status === 'busy'
    ? 'Parcialmente ocupado'
    : status === 'full'
    ? 'Sin disponibilidad'
    : 'No informado'
</script>

<style scoped></style>
