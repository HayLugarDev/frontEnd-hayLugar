<template>
  <div class="p-6 border-2 w-full md:w-11/12 mx-auto flex flex-col rounded-2xl cursor-pointer transition-colors duration-200"
    :class="isSelected ? 'border-gray-900 bg-gray-200' : 'border-gray-300 hover:border-gray-500'"
    @click="$emit('update:modelValue', value)">
    <span class="text-2xl text-gray-800">{{ title }}</span>
    <span class="text-gray-500 text-lg font-normal">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  value: { type: String, required: true },
});

defineEmits(['update:modelValue']);

const isSelected = computed(() => props.modelValue === props.value);
</script>
