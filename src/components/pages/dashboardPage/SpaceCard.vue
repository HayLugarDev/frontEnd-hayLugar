<template>
  <router-link
    :to="`/espacio/${espacio.slug}`"
    class="block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden 
             shadow-md flex flex-col h-full transition-all duration-300"
    >

      <!-- IMAGEN + CONTROLES -->
      <div class="relative w-full h-44 overflow-hidden">
        <Carousel :images="images" :controls="hovered" class="w-full h-full object-cover" />

        <!-- PRICE BADGE -->
        <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl">
          <span class="text-[#06D6A0] font-bold text-sm">${{ getMinPrice() }}</span>
          <span class="text-gray-300 text-[10px]">/h</span>
        </div>
      </div>

      <!-- CONTENIDO -->
      <div class="flex flex-col flex-1 p-4">

        <!-- TITULO -->
        <h3 class="text-white font-semibold text-base leading-tight line-clamp-1">
          {{ capitalizeFirst(espacio.name) }}
        </h3>

        <!-- UBICACIÓN -->
        <p class="text-gray-300 text-xs mt-1 line-clamp-1">
          {{ ciudad }}
        </p>
        <p class="text-gray-400 text-[11px] -mt-1 line-clamp-1">
          {{ calle }}
        </p>

        <!-- DISTANCIA -->
        <p v-if="espacio.distancia"
           class="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
          📍 A {{ espacio.distancia.toFixed(1) }} km
        </p>

        <!-- ICONOS VEHÍCULOS -->
        <div class="flex flex-row justify-start gap-2 mt-3">
          <div
            v-for="v in espacio.vehicle_capacities"
            :key="v.type"
            class="flex items-center gap-1 bg-white/5 border border-white/10 
                   px-2 py-1 rounded-lg text-white"
          >
            <font-awesome-icon :icon="['fas', `${getVehicleIcon(v.type)}`]" class="text-xs" />
            <span v-if="v.price_per_hour" class="text-[10px]">
              ${{ v.price_per_hour }}/h
            </span>
          </div>
        </div>

        <!-- RATING -->
        <div class="flex items-center justify-end mt-2 text-xs gap-1">
          <span :class="espacio.average_rating ? 'text-yellow-400' : 'text-gray-500'">⭐</span>
          <span class="text-gray-200 font-medium">
            {{ espacio.space_reviews.length > 0 ? espacio.average_rating.toFixed(1) : '5.0' }}
          </span>
        </div>

        <!-- AVAILABILITY BADGE -->
        <div
          class="mt-3 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-gray-200 
                 flex items-center justify-between"
        >
          <div class="flex items-center gap-1">
            <span class="text-xs text-[#00B4D8] font-semibold uppercase">
              {{ labelHorario }}
            </span>
          </div>

          <div>
            <template v-if="espacio.reservation_period !== 'hour'">
              Todos los días 🗓️
            </template>

            <template v-else>
              {{ disponibilidad.start }} - {{ disponibilidad.end }} hs
            </template>
          </div>
        </div>

      </div>

    </div>
  </router-link>
</template>

<script setup>
import { ref, computed } from 'vue'
import Carousel from '../../common/Carousel.vue'
import fallbackImage from '../../../assets/img-haylugar.jpeg'
import { getVehicleIcon } from '../../../utils/vehicleTypeIconTraslation'
import { getSpaceImages } from '../../../services/spaceService'
import { capitalizeFirst } from '../../../utils/capitalizeFirstCharAt'

const props = defineProps({
  espacio: Object
})

const hovered = ref(false)

const images = ref(
  props.espacio?.images?.length ? [props.espacio.images[0]] : [fallbackImage]
)

const getMinPrice = () => {
  if (!props.espacio?.vehicle_capacities) return '—'
  const prices = props.espacio.vehicle_capacities
    .filter(v => v.price_per_hour)
    .map(v => v.price_per_hour)

  return prices.length ? Math.min(...prices) : '—'
}

const handleMouseEnter = async () => {
  hovered.value = true
  if (!props.espacio.images?.length) return

  if (images.value.length === 1 && images.value[0] === fallbackImage) {
    const fetched = await getSpaceImages(props.espacio.id)
    images.value = fetched.length ? fetched : [fallbackImage]
  }
}

const handleMouseLeave = () => (hovered.value = false)

const disponibilidad = computed(() => {
  if (!props.espacio?.availability) return {}

  return typeof props.espacio.availability === 'string'
    ? JSON.parse(props.espacio.availability)
    : props.espacio.availability
})

const labelHorario = computed(() => {
  switch (props.espacio.reservation_period) {
    case 'hour': return 'Por Hora'
    case 'day': return 'Por Día'
    case 'week': return 'Por Semana'
    default: return 'Por Mes'
  }
})

const ciudad = computed(() => props.espacio.location.split(',')[1] ?? '')
const calle = computed(() => props.espacio.location.split(',')[0] ?? '')
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
