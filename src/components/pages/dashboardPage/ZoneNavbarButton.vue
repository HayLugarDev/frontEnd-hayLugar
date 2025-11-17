<template>
  <button
    @click="handleClick"
    class="flex-shrink-0 flex items-center gap-3 min-w-[140px] md:min-w-[200px] px-4 py-3 rounded-xl border border-white/10 bg-secondary transition-all duration-300 shadow-sm hover:shadow-md"
    :class="{ 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0': disabled }"
    :style="isActive && !disabled ? { background: activeGradient, borderColor: activeColor } : {}"
  >
    <!-- Ícono -->
    <component
      :is="icon"
      class="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 transition-all duration-300"
      :style="{
        color: disabled ? '#999' : isActive ? activeColor : 'lightblue',
        filter: isActive && !disabled ? 'drop-shadow(0 0 6px ' + activeColor + ')' : 'none'
      }"
    />

    <!-- Textos -->
    <div class="flex flex-col text-left">
      <span
        class="text-sm font-semibold"
        :class="disabled ? 'text-gray-400' : 'text-gray-600'"
      >{{ title }}</span>
      <span class="text-[11px]" :class="disabled ? 'text-gray-400' : 'text-gray-400'">
        {{ subtitle }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  icon: any
  title: string
  subtitle?: string
  activeColor?: string
  disabled?: boolean
}>()

const emit = defineEmits(['click'])
const route = useRoute()

const isActive = computed(() =>
  route.path.includes(props.title.toLowerCase().split(' ')[0])
)

const activeGradient = computed(
  () => `linear-gradient(135deg, ${props.activeColor || '#00B4D8'}33, transparent)`
)

function handleClick() {
  if (!props.disabled) emit('click')
}
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
button:hover {
  transform: translateY(-2px);
}
</style>
