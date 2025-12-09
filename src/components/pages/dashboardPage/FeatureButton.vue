<script setup>
const props = defineProps({
  icon: { type: Object, required: true },
  color: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  onClick: { type: Function, required: true }
});
</script>

<template>
  <button :disabled="!enabled" @click="enabled && onClick()" :class="[
    'flex flex-col items-center justify-center pb-2 pt-1 min-w-[150px] snap-center bg-white/10 backdrop-blur-xl border-b border-white/20 rounded-2xl transition-all duration-300 shadow-2xl',
    enabled
      ? `hover:bg-white/20 hover:border-[${color}] hover:shadow-[0_0_20px_${color}55]`
      : 'opacity-40 pointer-events-none'
  ]">
    <component :is="icon" class="w-5 h-5" :style="{ color }" />
    <span class="text-white font-semibold text-[10px] md:text-xs mt-1">
      {{ title }}
    </span>
    <span class="text-gray-400 text-[9px]">
      {{ subtitle }}
    </span>
  </button>
</template>
