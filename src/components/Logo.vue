<template>
    <div class="items-center space-x-4">
        <img src="/src/assets/logo.png" alt="HayLugAR Logo" :class="`w-${widht}`" />
    </div>
</template>
<script setup>
const props = defineProps({
    widht: String
})
</script>
