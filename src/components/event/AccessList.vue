<template>
  <div class="bg-[#1B263B]/70 border border-white/10 rounded-2xl p-6">
    <h3 class="text-lg font-semibold mb-3">Accesos</h3>
    <ul class="space-y-2 max-h-[400px] overflow-auto pr-2">
      <li v-for="a in accessPoints" :key="a.id" class="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
        <div class="flex items-center gap-3">
          <i :class="getIcon(a.type)" class="text-[#00B4D8]"></i>
          <span>{{ a.name || 'Acceso ' + a.type }}</span>
        </div>
        <span class="text-xs text-[#B0BEC5] uppercase">{{ a.type }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { EventAccessPoint } from '../../services/eventService'
const props = defineProps<{ accessPoints: EventAccessPoint[] }>()

function getIcon(type: string) {
  const map: Record<string, string> = {
    vehicle: 'fa-solid fa-car',
    pedestrian: 'fa-solid fa-person-walking',
    vip: 'fa-solid fa-star',
    staff: 'fa-solid fa-user-tie',
    emergency: 'fa-solid fa-truck-medical',
  }
  return map[type] || 'fa-solid fa-circle'
}
</script>
