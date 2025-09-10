<template>
    <button class="px-3 py-2 text-gray-600 hover:text-primary transition-all text-sm">
        <font-awesome-icon :icon="usedIcon" />
        {{ text }}
    </button>
</template>

<script setup>
const props = defineProps({
    text: String,
    usedIcon: String
});
</script>