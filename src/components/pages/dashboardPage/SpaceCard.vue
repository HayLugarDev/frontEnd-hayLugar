<template>
    <router-link :to="`/espacio/${espacio.id}`">
        <div class="bg-secondary rounded-xl transition-all h-full lg:h-80 p-2 md:p-0">
            <div v-if="espacio && espacio.images && espacio.images.length" class="aspect-square relative">
                <!-- <Logo :width="'10'" class="absolute right-2 bottom-0 z-30" /> -->
                <Carousel :images="espacio.images" class="w-full h-full rounded-lg" :controls="false" />
            </div>
            <div class="p-1">
                <div class="flex flex-col items-start px-1 md:px-0">
                    <div class="text-2xl md:text-sm font-bold text-primary">{{ espacio.name }}</div>
                    <p class="text-lg lg:text-xs text-gray-800">
                        {{ espacio.location.split(',')[1] }}
                    </p>
                    <p class="text-lg lg:text-xs text-gray-500">
                        {{ espacio.location.split(',')[0] }}
                    </p>
                    <div class="w-full flex flex-row justify-between items-start md:text-xs text-center py-2">
                        <div class="flex flex-row justify-start">
                            <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="p-1 border rounded-xl">
                                <font-awesome-icon :icon="['fas', `${vehicleTypeTranslations[v.type]}`]"
                                    class="text-gray-500 text-xl md:text-sm" />
                                <p v-if="v.price_per_hour" class="text-sm font-normal md:hidden">Hora: ${{
                                    v.price_per_hour.toLocaleString() }}</p>
                            </div>
                        </div>
                        <div class="text-gray-800 font-semibold text-2xl md:text-sm">
                            <span class="text-yellow-600">★</span> {{ Number(espacio.average_rating).toFixed(1) }}
                        </div>
                    </div>
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
import Carousel from '../../common/Carousel.vue';
import Logo from '../../layout/Logo.vue';
import { computed } from 'vue';

const props = defineProps({
    espacio: Object
});

const vehicleOptions = computed(() => {
    if (!espacio.value?.vehicle_capacities) return [];

    return espacio.value.vehicle_capacities.map(v => (vehicleLabel(v.type)));
});

function vehicleLabel(type) {
    switch (type) {
        case 'car': return 'car-side';
        case 'van': return 'truck-pickup';
        case 'motorcycle': return 'motorcycle';
        case 'bicycle': return 'bicycle';
        default: return type;
    }
}

const vehicleTypeTranslations = {
    car: 'car-side',
    motorcycle: 'motorcycle',
    van: 'truck-pickup',
    bicycle: 'bicycle',
    // truck: 'Camión',
    // suv: 'SUV',
};

const reverseVehicleTypeTranslations = Object.fromEntries(
    Object.entries(vehicleTypeTranslations).map(([en, es]) => [es, en])
);

</script>