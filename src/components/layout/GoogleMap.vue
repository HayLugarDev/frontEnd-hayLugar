<template>
  <GMapMap
    ref="gmap"
    :center="center"
    :options="options"
    :zoom="zoom"
    map-type-id="roadmap"
    class="w-full h-[500px] rounded-lg shadow-md"
    @tilesloaded="onTilesLoaded"
  >
    <slot />
  </GMapMap>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, provide, shallowRef, ref } from 'vue'

const props = defineProps<{
  center: Record<string, number>,
  zoom?: number,
  options?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'ready', map: any): void
}>()

// Ref al componente <GMapMap> (de @fawmi/vue-google-maps u otro wrapper)
const gmap = ref<any>(null)

// Ref reactivo a la instancia real de google.maps.Map
const mapRef = shallowRef<any>(null)

// Provide reactivo para hijos (CurbBandsLayer lo consume)
provide('googleMap', mapRef)

const zoom = props.zoom ?? 15
const options = props.options ?? {}

function onTilesLoaded() {
  // Para @fawmi/vue-google-maps, la instancia está en $mapObject
  const mapInstance = gmap.value?.$mapObject ?? null
  if (mapInstance && mapRef.value !== mapInstance) {
    mapRef.value = mapInstance
    emit('ready', mapInstance) // Por si preferís pasar map por prop al layer
  }
}
</script>
