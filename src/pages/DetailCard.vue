<template>
  <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
    <span class="text-[#78909C] uppercase text-[10px] tracking-[0.16em]">
      {{ label }}
    </span>

    <span class="font-semibold text-sm">{{ value }}</span>

    <span class="text-[11px] text-[#90A4AE]">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
}>()
</script>

<style scoped></style>
