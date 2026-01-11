<template>
  <div class="block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer select-none"
    @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp">

    <div class="rounded-2xl shadow-md flex flex-col h-full transition-all duration-300 overflow-visible">

      <!-- IMAGEN + CONTROLES -->
      <div class="relative w-full h-40 sm:h-40 overflow-hidden">
        <!-- <Carousel mode="free" :images="images" :controls="hovered" class="w-full h-full object-cover rounded-t-xl" style="touch-action: pan-y" -->

        <img v-if="images[0]" :src="images[0]" alt="" class="w-full h-full object-cover rounded-t-xl">
        <img v-else :src="someImg" alt="" class="w-full h-full object-cover rounded-t-xl">

        <!-- PRICE BADGE -->
        <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-lg
         px-3 py-1 rounded-full border border-white/10
         flex items-baseline gap-1 shadow-md">
          <span class="text-[#00E5A0] font-bold text-sm">
            ${{ getMinPrice() }}
          </span>
          <span class="text-gray-300 text-[10px]">/h</span>
        </div>

      </div>

      <!-- CONTENIDO -->
      <div class="flex flex-col flex-1 p-4 rounded-2xl bg-gradient-to-b
         from-[#1B263B] to-[#0D1B2A]
         -mt-3 relative z-10 shadow-xl">

        <!-- RIBBON PERIODO -->
        <div class="absolute bottom-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div class="absolute bottom-6 -left-2 w-[140px] bg-[#00B4D8]
           text-white text-xs font-bold uppercase text-center
           -rotate-45 py-1 shadow-lg">
            {{ labelHorario }}
          </div>
        </div>

        <!-- TITULO -->
        <h3 class="text-white font-semibold text-sm md:text-sm leading-tight line-clamp-1">
          {{ capitalizeFirst(espacio.name) }}
        </h3>

        <!-- HORARIO -->
        <div class="flex items-center gap-2 text-xs text-gray-300 mt-2">
          <font-awesome-icon icon="clock" class="text-[#00B4D8]" />

          <template v-if="espacio.reservation_period !== 'hour'">
            <span class="font-medium">Disponible todos los días</span>
          </template>

          <template v-else>
            <span class="font-medium">
              {{ disponibilidad.start }} – {{ disponibilidad.end }} hs
            </span>
          </template>
        </div>

        <!-- UBICACIÓN -->
        <p class="text-gray-300 text-md md:text-xs mt-1 line-clamp-1">
          {{ ciudad }}
        </p>
        <p class="text-gray-400 text-sm md:text-[11px] -mt-1 line-clamp-1">
          {{ calle }}
        </p>

        <!-- DISTANCIA -->
        <p v-if="espacio.distancia" class="text-xs md:text-[11px] text-gray-500 mt-2 flex items-center gap-1">
          📍 A {{ espacio.distancia.toFixed(1) }} km de distancia
        </p>

        <!-- RATING -->
        <div class="flex mt-2 md:mt-0">
          <div v-if="espacio.space_reviews.length > 0" class="mr-2 text-gray-200 font-medium">
            <font-awesome-icon v-for="i in 5" :key="i" :icon="['fas', 'star']"
              :class="i <= Math.round(espacio.average_rating ?? 5) ? 'text-yellow-400' : 'text-gray-400'"
              class="text-sm" />
          </div>
          <div v-else>
            <font-awesome-icon v-for="i in 5" :key="i" :icon="['fas', 'star']" class="text-sm text-yellow-400" />
          </div>
        </div>

        <!-- ICONOS VEHÍCULOS -->
        <!-- <div class="flex flex-row justify-start gap-2 mt-3 flex-wrap">
          <div v-for="v in espacio.vehicle_capacities" :key="v.type" class="flex items-center gap-1 bg-white/5 border border-white/10 
                   px-2 py-1 rounded-lg text-gray-300">
            <font-awesome-icon :icon="['fas', `${getVehicleIcon(v.type)}`]" class="text-md md:text-xs " />
            <span v-if="v.price_per_hour" class="text-lg md:text-[10px]">
              ${{ v.price_per_hour }}/h
            </span>
          </div>
        </div> -->

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import fallbackImage from '../../../assets/img-haylugar.jpeg'
import { getVehicleIcon } from '../../../utils/vehicleTypeIconTraslation'
import { getSpaceImages } from '../../../services/spaceService'
import { capitalizeFirst } from '../../../utils/capitalizeFirstCharAt'
import someImg from "../../../assets/img-haylugar.jpeg";

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

import { useRouter } from 'vue-router'

const router = useRouter()

let startX = 0
let dragged = false

const onPointerDown = (e) => {
  startX = e.clientX
  dragged = false
}

const onPointerMove = (e) => {
  if (Math.abs(e.clientX - startX) > 10) {
    dragged = true
  }
}

const onPointerUp = () => {
  if (!dragged) {
    router.push(`/espacio/${props.espacio.slug}`)
  }
}

const disponibilidad = computed(() => {
  const opening = props.espacio.opening_hours
  if (!opening || opening.length === 0) {
    return { start: '00:00', end: '23:59' }
  }

  const today = new Date().getDay() // 0 (Domingo) - 6 (Sábado)
  const todayHours = opening.find(d => d.day_of_week === today)

  if (!todayHours) {
    return { start: '00:00', end: '23:59' }
  }

  return {
    start: todayHours.opening_time,
    end: todayHours.closing_time
  }
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
