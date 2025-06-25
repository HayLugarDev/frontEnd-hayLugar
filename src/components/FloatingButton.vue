<template>
    <button
      @click="$emit('toggle')"
      :class="`text-${props.color} bg-${props.background} opacity-80 fixed left-1/2 -translate-x-1/2 bottom-10 z-30 border border-black w-max p-4 py-2 rounded-full shadow-lg hover:scale-110 transition-all`"
    >
      <span>{{ props.text }}</span>
    </button>
  </template>
  
  <script setup>
  const props = defineProps({
    text: String,
    color: String,
    background: String
  });
  
  // Permitir emitir eventos
  defineEmits(['toggle']);
  </script>