<template>
    <button 
      type="button" 
      :class="[
        'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
        isSelected 
          ? 'bg-primary text-white border-primary' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      ]"
    >
      <font-awesome-icon :icon="['fas', iconType]" />
      <span>{{ vehicleType }}</span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    isSelected: Boolean, 
    vehicleType: String,
    iconType: String
  });
  </script>
  