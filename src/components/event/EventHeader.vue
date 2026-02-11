<template>
  <header class="bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow-lg border border-white/10">
    <div>
      <h1 class="text-2xl font-semibold">{{ name }}</h1>
      <p class="text-sm text-[#B0BEC5] mt-1">{{ formatDateRange(start, end) }}</p>
    </div>

    <div class="flex items-center gap-3 mt-4 md:mt-0">
      <span class="bg-newgreen/20 text-newgreen px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
        {{ typeLabel }}
      </span>
      <span class="bg-[#00B4D8]/20 text-[#00B4D8] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
        Activo
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  start: string
  end: string
  type: string
}>()

const typeMap: Record<string, string> = {
  festival: 'Festival',
  concert: 'Concierto',
  sports: 'Deportivo',
  fair: 'Feria',
  municipal: 'Municipal',
  university: 'Universitario',
  other: 'Evento'
}

const typeLabel = typeMap[props.type] || 'Evento'

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  const e = new Date(end).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${s} – ${e}`
}
</script>
