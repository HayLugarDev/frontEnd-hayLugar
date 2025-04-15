<template>
    <div @click="router.push(route)"
        :class="`hover:scale-105 transition-al text-md sm:text-xl border p-3 sm:p-2 rounded-xl shadow-xl cursor-pointer font-medium ${color} ${background}`">
        {{ text }}
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    route: String,
    text: String,
    color: String,
    background: String
});
</script>