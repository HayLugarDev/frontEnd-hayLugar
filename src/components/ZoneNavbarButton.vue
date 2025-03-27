<template>
    <button class="px-4 py-2 text-gray-600 hover:text-primary transition-all">
        <font-awesome-icon :icon="usedIcon" class="mr-2" />
        {{ text }}
    </button>
</template>

<script setup>
const props = defineProps({
    text: String,
    usedIcon: String
});
</script>