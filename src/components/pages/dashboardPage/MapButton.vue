<template>
  <button v-if="route.path === '/dashboard'" @click="$emit('toggle')"
    :class="`text-${props.color} bg-${props.background} opacity-80 md:left-1/2 md:-translate-x-1/2 md:bottom-10 z-30 border-2 first-line:border-gray-300 w-max p-4 py-2 rounded-full shadow-lg hover:scale-110 transition-all`">
    <span>{{ props.text }}</span>
  </button>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  text: String,
  color: String,
  background: String
});

defineEmits(['toggle']);
</script>