<template>
    <router-link :to="`/espacio/${espacio.id}`">
        <div class="bg-secondary rounded-xl transition-all h-full lg:h-80">
            <div v-if="espacio && espacio.images && espacio.images.length" class="aspect-square relative">
                <Logo :width="'10'" class="absolute right-2 bottom-0 z-30" />
                <Carousel :images="espacio.images" class="w-full h-full rounded-lg" :controls="false" />
            </div>
            <div class="p-2">
                <div class="flex flex-col items-start">
                    <div class="text-2xl md:text-lg font-bold text-primary">{{ espacio.name }}</div>
                    <p class="text-md lg:text-xs text-gray-500">
                        {{ espacio.location.split(',')[0] }}
                    </p>
                    <p class="text-gray-800 lg:text-xs">
                        ${{ espacio.vehicle_capacities.price_per_hour }}/hora
                    </p>
                </div>
                <!-- <div class="grid grid-cols-4 mt-4">
                    <span class="text-end text-gray-800 text-2xl lg:text-lg"><span
                            class=" text-yellow-600">★</span>4,70</span>
                </div> -->
            </div>
        </div>
    </router-link>
</template>
<script setup>
import Carousel from './Carousel.vue';
import Logo from './Logo.vue';

const props = defineProps({
    espacio: Object
});

</script>