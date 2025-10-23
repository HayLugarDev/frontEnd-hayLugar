<template>
  <GMapMap
    ref="mapRef"
    class="w-full h-[500px] rounded-lg shadow-md"
    :center="mapCenter"
    :zoom="zoomComputed"
    :options="optionsComputed"
    map-type-id="roadmap"
    @load="onLoadEvent"
    @tilesloaded="onTilesLoaded"
  >
    <!-- Marcador del usuario -->
    <GMapMarker
      v-if="userMarker"
      :position="userMarker"
    />
    <slot />
  </GMapMap>

  <!-- HUD de debug opcional -->
  <div
    v-if="debug && debugStatus"
    class="fixed bottom-4 left-4 z-[9999] px-3 py-2 rounded-md text-xs font-semibold"
    :style="{
      background: 'rgba(0,0,0,.75)',
      color: 'white',
      border: '1px solid rgba(255,255,255,.2)',
      boxShadow: '0 6px 24px rgba(0,0,0,.24)'
    }"
  >
    {{ debugStatus }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, watch, nextTick, computed } from 'vue'

type AnyMap = {
  setCenter?: (c: google.maps.LatLngLiteral) => void
  getCenter?: () => any
  addListener?: (evt: string, cb: (...args: any[]) => void) => any
  getZoom?: () => number
}

const props = defineProps<{
  center: google.maps.LatLngLiteral
  zoom?: number
  options?: google.maps.MapOptions
  debug?: boolean
  locateUser?: boolean   // 👈 nueva prop
}>()

const debug = props.debug ?? false
const zoomComputed = computed(() => props.zoom ?? 15)

const optionsComputed = computed<google.maps.MapOptions>(() => ({
  gestureHandling: 'greedy',
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
  ...props.options, 
}))


const mapRef = ref<any>(null)
const mapInstance = ref<AnyMap | null>(null)
const debugStatus = ref<string>('')

const mapCenter = ref<google.maps.LatLngLiteral>(props.center)
const userMarker = ref<google.maps.LatLngLiteral | null>(null)

/** Debug helper */
function setDebug(msg: string) {
  if (debug) {
    console.log('[CustomGoogleMap]', msg)
    debugStatus.value = msg
  }
}

/** Detecta si Google Maps está cargado */
function hasGoogleMaps(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google && !!(window as any).google.maps
}

/** Tipado "duck" para detectar mapa */
function looksLikeMap(m: any): m is AnyMap {
  return m && typeof m.setCenter === 'function' && typeof m.addListener === 'function'
}

/** Obtiene instancia del mapa según el wrapper */
function tryResolveMapInstance(): AnyMap | null {
  const refVal = mapRef.value
  if (refVal?.map && looksLikeMap(refVal.map)) return refVal.map
  if (typeof refVal?.getMap === 'function') {
    const m = refVal.getMap()
    if (looksLikeMap(m)) return m
  }
  if (refVal?.$mapObject && looksLikeMap(refVal.$mapObject)) return refVal.$mapObject
  if (refVal?.$map && looksLikeMap(refVal.$map)) return refVal.$map
  if (refVal?._map && looksLikeMap(refVal._map)) return refVal._map
  if (refVal?.mapRef?.$mapObject && looksLikeMap(refVal.mapRef.$mapObject)) return refVal.mapRef.$mapObject
  return null
}

/** Asigna la instancia */
function setMap(map: AnyMap | null) {
  if (map && map !== mapInstance.value) {
    mapInstance.value = map
    provide('googleMap', mapInstance.value as any)
    setDebug('✅ Map instance set & provided.')
  }
}

/** Handlers */
function onLoadEvent(mapArg: any) {
  if (looksLikeMap(mapArg)) {
    setMap(mapArg)
  } else {
    setMap(tryResolveMapInstance())
  }
}

function onTilesLoaded() {
  const m = tryResolveMapInstance()
  if (m) setMap(m)
}

/** ✅ Obtiene ubicación actual del usuario */
function locateUser() {
  if (!navigator.geolocation) {
    setDebug('⚠️ Geolocation no soportada.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      const coords = { lat: latitude, lng: longitude }

      userMarker.value = coords
      mapCenter.value = coords

      if (mapInstance.value?.setCenter) {
        mapInstance.value.setCenter(coords)
      }

      setDebug(`📍 Usuario localizado en (${latitude}, ${longitude})`)
    },
    (err) => {
      setDebug(`⚠️ Error obteniendo ubicación: ${err.message}`)
    },
    { enableHighAccuracy: true }
  )
}

/** Montaje */
onMounted(async () => {
  setDebug('mounted → intentando resolver mapa...')
  await nextTick()
  const m = tryResolveMapInstance()
  if (m) setMap(m)
  else setDebug('⚠️ No map instance yet. Waiting for @load / @tilesloaded…')

  // ✅ Solo localizar usuario si está permitido
  if (props.locateUser) {
    locateUser()
  }
})


/** Recenter dinámico si cambia center */
watch(
  () => props.center,
  (c) => {
    if (c && mapInstance.value?.setCenter) {
      mapInstance.value.setCenter(c)
      mapCenter.value = c
    }
  },
  { deep: true }
)
</script>
