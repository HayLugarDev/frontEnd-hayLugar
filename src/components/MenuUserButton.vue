<template>
    <button 
        @click="router.push(route)" 
        class="hover:bg-gray-300 p-2 w-full text-start text-primary hover:text-blue-500 font-medium">
        <font-awesome-icon :icon="usedIcon" class="xl:mr-1 text-xl" />
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