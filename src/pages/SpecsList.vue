<template>
  <ul
    class="grid md:grid-cols-2 gap-3 text-sm text-[#B0BEC5] bg-white/5 rounded-2xl p-4 border border-white/10"
  >
    <li
      v-for="item in specs"
      :key="item.label"
      class="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
      :class="item.active ? 'bg-[#06D6A0]/10' : 'opacity-70'"
    >
      <i
        :class="['fa-solid text-lg', item.active ? item.iconActive : item.iconInactive]"
      />

      <div>
        <p class="font-medium text-sm">{{ item.label }}</p>
        <p class="text-xs text-[#90A4AE]">{{ item.description }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ space: any }>()

const specs = [
  {
    label: 'Seguridad perimetral',
    active: !!props.space.has_security,
    iconActive: 'text-[#06D6A0] fa-shield-halved',
    iconInactive: 'text-[#B0BEC5] fa-shield-halved',
    description: props.space.has_security
      ? 'Control de accesos y vigilancia activa.'
      : 'A definir según la operación.',
  },
  {
    label: 'Muelle de carga',
    active: !!props.space.has_loading_dock,
    iconActive: 'text-[#06D6A0] fa-truck-ramp-box',
    iconInactive: 'text-[#B0BEC5] fa-truck-ramp-box',
    description: props.space.has_loading_dock
      ? 'Operación directa de camiones.'
      : 'Sin muelle dedicado.',
  },
  {
    label: 'Cadena de frío',
    active: !!props.space.has_cold_chain,
    iconActive: 'text-[#06D6A0] fa-snowflake',
    iconInactive: 'text-[#B0BEC5] fa-snowflake',
    description: props.space.has_cold_chain
      ? 'Infraestructura refrigerada.'
      : 'Sin cámaras de frío.',
  },
  {
    label: 'Energía trifásica',
    active: !!props.space.energy_3phase,
    iconActive: 'text-[#FFD166] fa-bolt',
    iconInactive: 'text-[#B0BEC5] fa-bolt',
    description: props.space.energy_3phase
      ? 'Apto para maquinaria industrial.'
      : 'Disponible a coordinar.',
  },
]
</script>
