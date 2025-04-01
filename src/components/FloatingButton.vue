<template>
    <button :class="`${color} ${background} p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center space-x-2`">
        <font-awesome-icon icon="plus" class="text-lg" />
        <span class="hidden md:block">{{ text }}</span>
    </button>
</template>

<script setup>
const props = defineProps({
    text: String,
    color: String,
    background: String
});
</script>