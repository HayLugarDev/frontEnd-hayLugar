<template>
  <button
    @click="$emit('click')"
    class="flex-shrink-0 flex flex-col items-center justify-center min-w-[120px] md:min-w-[180px] px-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md"
    :style="isActive ? { background: activeGradient, borderColor: activeColor } : {}"
  >
    <div
      class="text-2xl md:text-3xl mb-1"
      :style="{ textShadow: isActive ? '0 0 6px ' + activeColor : 'none' }"
    >
      {{ icon }}
    </div>
    <span class="text-sm font-semibold text-white">{{ title }}</span>
    <span class="text-[11px] text-[#B0BEC5]">{{ subtitle }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  icon: string;
  title: string;
  subtitle?: string;
  activeColor?: string;
}>();

const route = useRoute();
const isActive = computed(() => route.path.includes(props.title.toLowerCase().split(' ')[0]));

const activeGradient = computed(() =>
  `linear-gradient(135deg, ${props.activeColor || '#00B4D8'}33, transparent)`
);
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
button:hover {
  transform: translateY(-2px);
}
</style>
