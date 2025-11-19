<template>
  <button v-if="route.path === '/dashboard'" @click="$emit('toggle')"
    class="md:left-1/2 md:-translate-x-1/2 md:bottom-5 z-30 w-max p-4 py-2 rounded-full text-lg text-primary/80
           hidden md:flex items-center gap-2 border border-primary/30 bg-black/40 backdrop-blur-md
           hover:bg-white/10 hover:shadow-lg hover:shadow-primary/30
           transition-all duration-300">
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