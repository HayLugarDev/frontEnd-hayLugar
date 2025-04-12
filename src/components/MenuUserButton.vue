<template>
    <button 
        @click="router.push(route)" 
        class="hover:bg-secondary p-2 text-gray-400 hover:scale-105 transition-all font-medium rounded-lg">
        <font-awesome-icon :icon="usedIcon" class="text-2xl" />
        {{ text }}
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  route: String,
  usedIcon: String,
  text: String,
});
</script>