<template>
  <!-- Modo desktop -->
  <div class="hidden sm:flex flex-col w-11/12 px-4 space-y-2">
    <button
      v-for="section in sections"
      :key="section.value"
      @click="$emit('update:activeSection', section.value)"
      :class="[
        'w-full flex items-center justify-start gap-3 py-3 px-4 rounded-2xl font-semibold text-base transition-all duration-300',
        activeSection === section.value
          ? 'bg-newgreen/60 text-white shadow-md scale-[1.02]'
          : 'bg-white/10 text-gray-200 hover:bg-white/20 hover:scale-[1.01]'
      ]"
    >
      <span>{{ section.label }}</span>
    </button>
  </div>

  <!-- Modo mobile: dropdown -->
  <div class="sm:hidden w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white">
    <MobileMenuDropdown
      :modelValue="activeSection"
      @update:modelValue="$emit('update:activeSection', $event)"
      :options="sections"
    />
  </div>
</template>

<script setup>
import MobileMenuDropdown from './MobileMenuDropdown.vue'

defineProps({
  activeSection: String,
  sections: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['update:activeSection'])
</script>
