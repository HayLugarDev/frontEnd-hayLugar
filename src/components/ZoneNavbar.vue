<template>
<div class="flex overflow-x-auto p-4 bg-white shadow-md rounded-lg space-x-4 text-xs sm:text-sm md:text-xl">
    <ZoneNavbarButton :text="'Centro'" :usedIcon="'city'" />
    <ZoneNavbarButton :text="'Zonas verdes'" :usedIcon="'leaf'" />
    <ZoneNavbarButton :text="'Garages privados'" :usedIcon="'car'" />
    <ZoneNavbarButton :text="'Motos'" :usedIcon="'motorcycle'" />
</div>
</template>

<script setup>
import ZoneNavbarButton from "../components/ZoneNavbarButton.vue";
const props = defineProps({
    text: String,
    usedIcon: String
});
</script>