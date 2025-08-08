<template>
  <div class="w-11/12 px-4 space-y-1">
    <button
      v-for="section in sections"
      :key="section.value"
      @click="$emit('update:activeSection', section.value)"
      :class="[
        'w-full py-2 rounded text-center',
        activeSection === section.value ? 'bg-gray-200' : 'hover:bg-gray-200'
      ]"
    >
      {{ section.label }}
    </button>
  </div>
</template>

<script setup>
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
