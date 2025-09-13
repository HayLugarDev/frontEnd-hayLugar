<template>
    <router-link :to="`/espacio/${espacio.id}`">
        <div class="bg-secondary rounded-xl transition-all h-full lg:h-80 min-h-[22rem] lg:p-2 md:p-0">
            <div class="relative w-full h-48 overflow-hidden rounded-lg">
                <Carousel :images="espacio.images" class="w-full h-full object-cover" :controls="false" />
            </div>
            <div class="p-1">
                <div class="flex flex-col items-start px-1 md:px-0">
                    <div class="text-md lg:text-xs font-bold text-primary line-clamp-1">
                        {{ capitalizeFirst(espacio.name) }}
                    </div>

                    <p class="text-xs text-gray-800 line-clamp-1">
                        {{ espacio.location.split(',')[1] }}
                    </p>

                    <p class="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                        {{ espacio.location.split(',')[0] }}
                    </p>

                    <div class="w-full flex flex-row justify-between items-start md:text-xs text-center py-2">
                        <div class="flex flex-row justify-start">
                            <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="p-1 border rounded-xl">
                                <font-awesome-icon :icon="['fas', `${vehicleTypeTranslations[v.type]}`]"
                                    class="text-gray-700 text-sm md:text-sm" />
                                <p v-if="v.price_per_hour" class="text-[.6rem] font-normal md:hidden">Hora: ${{
                                    v.price_per_hour.toLocaleString() }}</p>
                            </div>
                        </div>
                        <div class="text-gray-800 font-semibold text-md md:text-sm">
                            <span class="text-yellow-600">★</span> {{ Number(espacio.average_rating).toFixed(1) }}
                        </div>
                    </div>
                </div>

                <div class="col-span-2 mb-2">
                    <div
                        class="bg-blue-100 text-primary rounded-lg px-4 py-2 text-start text-[10px] font-semibold">
                        <div v-if="disponibilidad.dateRange && disponibilidad.dateRange.length === 2">
                            <span>
                                {{ formatDate(disponibilidad.dateRange[0]) }} al {{ disponibilidad.dateRange[1] }}
                            </span>
                        </div>
                        <div class="text-[10px]">
                            <span>Horario: </span>
                            <span v-if="disponibilidad.start && disponibilidad.end">
                                {{ disponibilidad.start }} a {{ disponibilidad.end }} hs
                            </span>
                            <span v-else>
                                No especificados
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>
<script setup>
import { capitalizeFirst } from '../../../utils/capitalizeFirstCharAt';
import { formatDate } from '../../../utils/FormatDate';
import Carousel from '../../common/Carousel.vue';
import { computed } from 'vue';

const props = defineProps({
    espacio: Object
});

const disponibilidad = computed(() => {
    if (!props.espacio?.availability) return {};
    return typeof props.espacio.availability === 'string'
        ? JSON.parse(props.espacio.availability)
        : props.espacio.availability;
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