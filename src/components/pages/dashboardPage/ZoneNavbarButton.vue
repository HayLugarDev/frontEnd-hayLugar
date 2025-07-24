<template>
    <button class=" inline-flex flex-col px-4 py-2 text-gray-600 hover:shadow-xl hover:bg-gray-100 rounded-xl">
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