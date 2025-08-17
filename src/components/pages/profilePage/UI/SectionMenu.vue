<template>
  <!-- Modo desktop -->
  <div class="hidden md:block w-11/12 px-4 space-y-1">
    <button v-for="section in sections" :key="section.value" @click="$emit('update:activeSection', section.value)"
      :class="[
        'w-full py-2 rounded text-center',
        activeSection === section.value ? 'bg-gray-200' : 'hover:bg-gray-200'
      ]">
      {{ section.label }}
    </button>
  </div>

  <!-- Modo mobile: dropdown -->
  <div class="block md:hidden w-full">
    <MobileMenuDropdown :modelValue="activeSection" @update:modelValue="$emit('update:activeSection', $event)"
      :options="sections"/>
  </div>
</template>

<script setup>
import MobileMenuDropdown from './MobileMenuDropdown.vue';

defineProps({
  activeSection: String,
  sections: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['update:activeSection']);
</script>
