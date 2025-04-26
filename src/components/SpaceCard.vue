<template>
    <router-link :to="`/espacio/${espacio.id}`">
        <div class="bg-secondary p-4 rounded-xl sm:hover:shadow-xl transition-all h-full">
            <div v-if="espacio && espacio.images && espacio.images.length" class="aspect-square relative">
                <Logo :widht="'10'" class="absolute right-2 bottom-0 z-50" />
                <!-- <img :src="`http://localhost:3000${espacio.images[0]}`" alt="Espacio"
                    class="w-full h-full object-cover rounded-lg" /> -->
                    <Carousel :images="espacio.images" class="w-full h-full object-cover rounded-lg" />
            </div>
            <div class="p-2">
                <div class="flex flex-row gap-2 items-end">
                    <div class="text-3xl md:text-2xl font-bold text-primary">{{ espacio.name }}</div>
                </div>
                <div class="grid grid-cols-4 mt-4">
                    <div class="col-span-3">
                        <p class="text-xl lg:text-sm text-gray-800">
                            <font-awesome-icon icon="map-marker-alt" class="mr-1" /> {{
                                espacio.location.split(',')[1]
                                ?.split(' ')
                                .slice(2)
                                .join(' ')
                            }}
                        </p>
                        <p class="text-md md:text-sm text-gray-500">
                            {{ espacio.location.split(',')[0] }}
                        </p>
                        <p class="text-gray-900 font-semibold">
                            <font-awesome-icon icon="money-bill-wave" class="mr-1" /> ${{ espacio.price_per_hour }}/hora
                        </p>
                    </div>
                    <span class="text-end text-gray-800 text-2xl lg:text-lg"><span class=" text-yellow-600">★</span>4,70</span>
                </div>
            </div>
            <!-- <router-link :to="`/espacio/${espacio.id}`">
            <button
                class="hidden sm:inline-block mt-3 bg-accent text-black px-6 py-3 rounded-lg w-full hover:shadow-md font-bold shadow-md transition-all">
                <font-awesome-icon icon="calendar-check" class="mr-1" /> Reservar
            </button>
        </router-link> -->
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