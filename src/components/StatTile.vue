<template>
  <div class="bg-white/5 rounded-lg border border-gray-800 p-3 text-center">
    <div class="text-[11px] text-gray-400">{{ label }}</div>
    <div
      class="text-lg font-bold"
      :class="alert ? 'text-rose-400' : positive ? 'text-emerald-400' : 'text-white'"
    >
      {{ val }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; val: string | number; alert?: boolean; positive?: boolean }>()
</script>
