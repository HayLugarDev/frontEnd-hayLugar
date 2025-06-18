<template>
<div class="absolute w-full bottom-0 bg-gray-900 md:hidden text-3xl flex flex-row items-center justify-around p-4 text-gray-300">
    <font-awesome-icon :icon="['fas', 'user']" @click="router.push('/profile')" />
    <font-awesome-icon icon="fa-align-justify" @click=""/>
    <font-awesome-icon :icon="['fas', 'map-location-dot']" />
</div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();


</script>