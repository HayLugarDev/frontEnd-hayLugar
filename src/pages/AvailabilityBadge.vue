<template>
  <div
    v-if="availability"
    class="flex items-center justify-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mt-2"
    :class="badgeClass"
  >
    <span class="h-2 w-2 rounded-full" :class="dotClass"></span>
    {{ statusText }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ availability: any | null }>()

const status = props.availability?.status || 'unknown'

const statusText =
  status === 'available'
    ? 'Disponible'
    : status === 'busy'
    ? 'Con ocupación'
    : status === 'full'
    ? 'Sin disponibilidad'
    : 'Disponibilidad no informada'

const badgeClass =
  status === 'available'
    ? 'bg-[#06D6A0]/20 text-[#B2FFDA]'
    : status === 'full'
    ? 'bg-red-500/20 text-red-300'
    : 'bg-yellow-400/20 text-yellow-200'

const dotClass =
  status === 'available'
    ? 'bg-[#06D6A0]'
    : status === 'full'
    ? 'bg-red-500'
    : 'bg-yellow-400'
</script>

<style scoped></style>
