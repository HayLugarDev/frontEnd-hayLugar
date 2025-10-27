<template>
  <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6">
    <h3 class="text-lg font-semibold mb-3">Zonas Disponibles</h3>
    <ul class="space-y-2">
      <li
        v-for="z in zones"
        :key="z.id"
        @click="selectZone(z.id)"
        :class="[
          'flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 cursor-pointer transition',
          selectedZone === z.id ? 'border border-[#06D6A0]/50 bg-[#06D6A0]/10' : 'hover:bg-white/10'
        ]"
      >
        <div class="flex items-center gap-2">
          <span class="inline-flex h-6 w-6 rounded-lg bg-[#06D6A0]/20 text-[#06D6A0] items-center justify-center text-sm font-bold">
            {{ z.code }}
          </span>
          <span>{{ z.name || 'Zona ' + z.code }}</span>
        </div>
        <span class="text-xs text-[#B0BEC5]">{{ z.capacity_total }} lugares</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EventZone } from '../../services/eventService'
const props = defineProps<{ zones: EventZone[], modelValue?: number }>()
const emit = defineEmits(['update:modelValue'])

const selectedZone = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function selectZone(id: number) {
  selectedZone.value = id
}
</script>
