<template>
<div class="inline-flex gap-2 sm:gap-6 overflow-x-auto whitespace-nowrap no-scrollbar rounded sm:rounded-lg text-sm md:text-lg">
    <ZoneNavbarButton :text="'Centro'" :usedIcon="'city'" />
    <ZoneNavbarButton :text="'Parques'" :usedIcon="'leaf'" />
    <ZoneNavbarButton :text="'Atracciones'" :usedIcon="'fa-camera'" />
    <ZoneNavbarButton :text="'Garages'" :usedIcon="'car'" />
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