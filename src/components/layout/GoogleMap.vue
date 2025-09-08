<template>
  <GMapMap
    ref="mapRef"
    class="w-full h-[500px] rounded-lg shadow-md"
    :center="center"
    :zoom="zoomComputed"
    :options="optionsComputed"
    map-type-id="roadmap"
    @load="onLoadEvent"           <!-- vue3-google-map suele emitir el map -->
    @tilesloaded="onTilesLoaded"  <!-- @fawmi/vue-google-maps emite cuando está listo -->
  >
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

/**
 * Props
 */
const props = defineProps<{
  center: google.maps.LatLngLiteral
  zoom?: number
  options?: google.maps.MapOptions
  debug?: boolean
}>()

const debug = props.debug ?? false
const zoomComputed = computed(() => props.zoom ?? 15)
const optionsComputed = computed(() => props.options ?? {})

/**
 * Refs / estado
 */
const mapRef = ref<any>(null)
const mapInstance = ref<AnyMap | null>(null)
const debugStatus = ref<string>('')

function setDebug(msg: string) {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log('[CustomGoogleMap]', msg)
    debugStatus.value = msg
  }
}

/**
 * Helpers
 */
function hasGoogleMaps(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google && !!(window as any).google.maps
}

function looksLikeMap(m: any): m is AnyMap {
  // Duck typing: no dependemos de window.google para hacer instanceof
  return m && typeof m.setCenter === 'function' && typeof m.addListener === 'function'
}

/**
 * Intenta extraer la instancia real del mapa desde el wrapper,
 * sin romper si window.google aún no está presente.
 */
function tryResolveMapInstance(): AnyMap | null {
  const refVal = mapRef.value

  // 1) vue3-google-map variantes
  if (refVal?.map && looksLikeMap(refVal.map)) return refVal.map
  if (typeof refVal?.getMap === 'function') {
    const m = refVal.getMap()
    if (looksLikeMap(m)) return m
  }

  // 2) @fawmi/vue-google-maps → $mapObject
  if (refVal?.$mapObject && looksLikeMap(refVal.$mapObject)) return refVal.$mapObject

  // 3) Otras variantes
  if (refVal?.$map && looksLikeMap(refVal.$map)) return refVal.$map
  if (refVal?._map && looksLikeMap(refVal._map)) return refVal._map

  // 4) Algunos wrappers tienen .mapRef?.$mapObject
  if (refVal?.mapRef?.$mapObject && looksLikeMap(refVal.mapRef.$mapObject)) return refVal.mapRef.$mapObject

  return null
}

function setMap(map: AnyMap | null) {
  if (map && map !== mapInstance.value) {
    mapInstance.value = map
    // Provide para overlays (CurbBandsLayer/CurbBandOverlay)
    provide('googleMap', mapInstance.value as any)
    setDebug('✅ Map instance set & provided.')
  }
}

/**
 * Handlers de eventos
 */
function onLoadEvent(mapArg: any) {
  // Algunos wrappers pasan el map en este evento. Aceptamos si “parece” un mapa.
  if (looksLikeMap(mapArg)) {
    setDebug('onLoad → got map from event (duck-typed).')
    setMap(mapArg)
  } else {
    setDebug('onLoad fired, trying fallback resolution…')
    setMap(tryResolveMapInstance())
  }
}

function onTilesLoaded() {
  // @fawmi/vue-google-maps: llamado cuando el mapa dibuja tiles por primera vez
  setDebug('tilesloaded → resolving map instance…')
  const m = tryResolveMapInstance()
  if (m) setMap(m)
}

/**
 * Montaje: intenta resolver el mapa por si el evento no dispara.
 * Si aún no existe window.google, no forzamos nada: esperamos a los eventos.
 */
onMounted(async () => {
  setDebug('mounted → attempting to resolve map…')
  await nextTick()
  const m = tryResolveMapInstance()
  if (m) {
    setMap(m)
  } else {
    setDebug('⚠️ No map instance yet. Waiting for @load / @tilesloaded…')
  }
})

/**
 * Recenter cuando cambie center
 */
watch(() => props.center, (c) => {
  if (mapInstance.value && c && typeof mapInstance.value.setCenter === 'function') {
    mapInstance.value.setCenter(c)
  }
}, { deep: true })
</script>
