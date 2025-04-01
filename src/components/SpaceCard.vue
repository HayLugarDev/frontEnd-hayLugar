<template>
    <div class="bg-white p-10 shadow-lg rounded-xl hover:shadow-xl transition-all">
        <div class="flex flex-row items-center">
            <img src="/src/assets/logo.png" alt="HayLugAR Logo" class="w-20" />
            <div class="text-2xl font-bold text-primary">{{ espacio.name }}</div>
        </div>
        <img :src="`http://localhost:3000${espacio.images[0]}`" alt="Espacio"
            class="w-full h-40 object-cover rounded-lg" />
        <p class="text-lg font-bold mt-3 text-gray-700">
            <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{ espacio.location.split(',')[0] }}
        </p>
        <p class="text-primary font-semibold">
            <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
        </p>
        <router-link :to="`/espacio/${espacio.id}`">
            <button
                class="mt-3 bg-accent text-black px-6 py-3 rounded-lg w-full hover:shadow-md font-bold shadow-md transition-all">
                <font-awesome-icon icon="calendar-check" class="mr-1" /> Reservar
            </button>
        </router-link>
    </div>
</template>
<script setup>
const props = defineProps({
    espacio: Object
});
</script>