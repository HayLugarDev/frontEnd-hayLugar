<template>
  <div class="bg-white/5 backdrop-blur rounded-xl border border-gray-800 shadow p-4">
    <div class="text-xs text-gray-400 mb-1">{{ label }}</div>
    <div :class="positive ? 'text-emerald-400' : 'text-white'" class="text-2xl font-extrabold">
      {{ value }}
    </div>
    <div v-if="bar !== undefined" class="mt-2 w-full h-1.5 bg-gray-800 rounded overflow-hidden">
      <div
        class="h-full rounded bg-gradient-to-r from-emerald-500 to-blue-500"
        :style="{ width: Math.min(bar,100)+'%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; bar?: number; positive?: boolean }>()
</script>
