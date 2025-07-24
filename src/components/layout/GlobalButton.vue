<template>
    <div @click="router.push(route)"
        :class="`hover:scale-105 transition-al text-md sm:text-xl border p-3 px-6 rounded-xl shadow-xl cursor-pointer font-medium text-${color} bg-${background}`">
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