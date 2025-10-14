<template>
    <router-link :to="`/espacio/${espacio.slug}`" class="block hover:scale-[1.02] transition-transform duration-300">
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

                    <p v-if="espacio.distancia" class="text-md md:text-[10px] text-gray-400 font-medium">
                        📍 A {{ espacio.distancia.toFixed(1) }} km de distancia
                    </p>

                    <div class="w-full flex flex-row justify-between items-start md:text-xs text-center py-2">
                        <div class="flex flex-row justify-start">
                            <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="p-1 border rounded-xl">
                                <font-awesome-icon :icon="['fas', `${getVehicleIcon(v.type)}`]"
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
                        class="flex flex-col items-start bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-primary rounded-xl px-4 py-1 shadow-sm">
                        <div class="flex items-center gap-1">
                            <span
                                class="bg-primary/10 text-primary rounded-md text-[10px] font-bold uppercase tracking-wide">
                                {{
                                    espacio.reservation_period === 'hour'
                                        ? 'POR HORA'
                                        : espacio.reservation_period === 'day'
                                            ? 'POR DÍA'
                                            : espacio.reservation_period === 'week'
                                ? 'POR SEMANA'
                                : 'POR MES'
                                }}
                            </span>
                            <font-awesome-icon icon="fa-regular fa-clock" class="text-primary text-xs" />
                        </div>

                        <div class="text-gray-700 text-xs font-semibold">
                            <template v-if="espacio.reservation_period !== 'hour'">
                                Todos los días 🗓️
                            </template>
                            <template v-else>
                                <span class="text-gray-800">
                                    {{ disponibilidad.start }} <span class="text-gray-500"> - </span> {{
                                    disponibilidad.end }} hs
                                </span>
                            </template>
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
import { getVehicleIcon, vehicleIconTranslations } from '../../../utils/vehicleTypeIconTraslation';

const props = defineProps({
    espacio: Object
});

const disponibilidad = computed(() => {
    if (!props.espacio?.availability) return {};
    return typeof props.espacio.availability === 'string'
        ? JSON.parse(props.espacio.availability)
        : props.espacio.availability;
});

</script>
