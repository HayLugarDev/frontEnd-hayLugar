<template>
    <router-link :to="`/espacio/${espacio.id}`">
        <div class="bg-secondary rounded-xl transition-all h-full lg:h-80 min-h-[22rem] lg:p-2 md:p-0">
            <div class="relative aspect-square overflow-hidden rounded-lg p-2 lg:p-0">
                <Carousel :images="espacio.images" class="w-full h-full object-cover" :controls="false" />
            </div>
            <div class="p-1">
                <div class="flex flex-col items-start px-4 md:px-0">
                    <div class="text-xl md:text-xs  font-bold text-primary line-clamp-1">
                        {{ capitalizeFirst(espacio.name) }}
                    </div>

                    <p class="text-md md:text-xs text-gray-800 line-clamp-1">
                        {{ espacio.location.split(',')[1] }}
                    </p>

                    <p class="text-sm md:text-[10px] text-gray-500 line-clamp-1">
                        {{ espacio.location.split(',')[0] }}
                    </p>

                    <div class="w-full flex flex-row justify-between items-start md:text-xs text-center py-2">
                        <div class="flex flex-row justify-start">
                            <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="p-1 border rounded-xl">
                                <font-awesome-icon :icon="['fas', `${vehicleTypeTranslations[v.type]}`]"
                                    class="text-gray-700 text-sm md:text-sm" />
                                <p v-if="v.price_per_hour" class="text-[.6rem] font-normal md:hidden"> ${{
                                    v.price_per_hour.toLocaleString() }}/h</p>
                            </div>
                        </div>
                        <span class="flex items-center gap-1 text-sm">
                            <span :class="espacio.average_rating ? 'text-yellow-500' : 'text-gray-400'">⭐</span>
                            <span class="text-black font-medium">
                                {{ espacio.space_reviews.length > 0 ? espacio.average_rating.toFixed(1) : '5.0' }}
                            </span>
                        </span>
                    </div>
                </div>

                <div class="col-span-2 mb-2">
                    <div
                        class="bg-blue-100 text-primary rounded-lg p-2 text-start text-md md:text-[10px] font-semibold">
                        <div v-if="disponibilidad.dateRange && disponibilidad.dateRange.length === 2">
                            <span>
                                {{ formatDate(disponibilidad.dateRange[0]) }} al {{ disponibilidad.dateRange[1] }}
                            </span>
                        </div>
                        <div>
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
import { ref, onMounted, computed } from 'vue';
import { capitalizeFirst } from '../../../utils/capitalizeFirstCharAt';
import { formatDate } from '../../../utils/FormatDate';
import Carousel from '../../common/Carousel.vue';

const props = defineProps({
    espacio: Object
});

const disponibilidad = computed(() => {
    if (!props.espacio?.availability) return {};
    return typeof props.espacio.availability === 'string'
        ? JSON.parse(props.espacio.availability)
        : props.espacio.availability;
});

const vehicleTypeTranslations = {
    car: 'car-side',
    motorcycle: 'motorcycle',
    van: 'truck-pickup',
    bicycle: 'bicycle',
};
</script>
