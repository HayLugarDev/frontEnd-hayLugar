<template>
  <GMapMap
    ref="mapRef"
    class="w-full h-full"
    :center="center"
    :zoom="zoomComputed"
    :options="optionsComputed"
    map-type-id="roadmap"
    @load="onLoad"
    @tilesloaded="onTilesLoaded"
  >
    <slot />
  </GMapMap>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'

const props = defineProps<{
  center: google.maps.LatLngLiteral
  zoom?: number
  options?: google.maps.MapOptions
}>()

const zoomComputed = computed(() => props.zoom ?? 12)

const optionsComputed = computed<google.maps.MapOptions>(() => ({
  gestureHandling: 'greedy',
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  ...props.options,
}))

const mapRef = ref<any>(null)

// 🔑 MAPA NATIVO REAL
const mapNative = ref<google.maps.Map | null>(null)
provide('googleMap', mapNative)

/* ===================== MAP RESOLUTION ===================== */

function tryResolveMap(): google.maps.Map | null {
  const r = mapRef.value
  if (!r) return null

  // vue3-google-maps expone el mapa nativo en alguno de estos
  return (
    (r.map as google.maps.Map) ||
    (typeof r.getMap === 'function' ? (r.getMap() as google.maps.Map) : null) ||
    (r.$mapObject as google.maps.Map) ||
    (r.$map as google.maps.Map) ||
    (r._map as google.maps.Map) ||
    null
  )
}

function setMap(m: google.maps.Map | null) {
  if (m && mapNative.value !== m) {
    mapNative.value = m
  }
}

function onLoad(mapArg: unknown) {
  // mapArg puede venir tipado raro → casteamos
  setMap(mapArg as google.maps.Map)
  if (!mapNative.value) setMap(tryResolveMap())
}

function onTilesLoaded() {
  if (!mapNative.value) setMap(tryResolveMap())
}
</script>
