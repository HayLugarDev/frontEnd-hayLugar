<template>
  <GMapMap
    ref="mapRef"
    class="w-full h-[500px] rounded-lg shadow-md"
    :center="center"
    :zoom="zoomComputed"
    :options="optionsComputed"
    map-type-id="roadmap"
    @load="onLoadEvent"
    @tilesloaded="onTilesLoaded"
  >
    <slot />
  </GMapMap>

  <!-- HUD de debug -->
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
import { onMounted, ref, watch, nextTick, computed, provide } from 'vue'

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
 * Refs
 */
const mapRef = ref<any>(null)
const mapInstance = ref<AnyMap | null>(null)
const debugStatus = ref<string>('')

/**
 * ✅ Provide aquí dentro de setup
 */
provide('googleMap', mapInstance)

function setDebug(msg: string) {
  if (debug) {
    console.log('[CustomGoogleMap]', msg)
    debugStatus.value = msg
  }
}

function looksLikeMap(m: any): m is AnyMap {
  return m && typeof m.setCenter === 'function' && typeof m.addListener === 'function'
}

function tryResolveMapInstance(): AnyMap | null {
  const refVal = mapRef.value
  if (refVal?.map && looksLikeMap(refVal.map)) return refVal.map
  if (typeof refVal?.getMap === 'function') {
    const m = refVal.getMap()
    if (looksLikeMap(m)) return m
  }
  if (refVal?.$mapObject && looksLikeMap(refVal.$mapObject)) return refVal.$mapObject
  if (refVal?.$map && looksLikeMap(refVal.$map)) return refVal.$map
  if (refVal?.mapRef?.$mapObject && looksLikeMap(refVal.mapRef.$mapObject)) return refVal.mapRef.$mapObject
  return null
}

function setMap(map: AnyMap | null) {
  if (map && map !== mapInstance.value) {
    mapInstance.value = map
    setDebug('✅ Map instance set.')
  }
}

function onLoadEvent(mapArg: any) {
  if (looksLikeMap(mapArg)) {
    setDebug('onLoad → got map from event.')
    setMap(mapArg)
  } else {
    setDebug('onLoad fired, trying fallback…')
    setMap(tryResolveMapInstance())
  }
}

function onTilesLoaded() {
  setDebug('tilesloaded → resolving map instance…')
  const m = tryResolveMapInstance()
  if (m) setMap(m)
}

onMounted(async () => {
  setDebug('mounted → attempting to resolve map…')
  await nextTick()
  const m = tryResolveMapInstance()
  if (m) setMap(m)
  else setDebug('⚠️ No map instance yet. Waiting for events…')
})

watch(() => props.center, (c) => {
  if (mapInstance.value && c && typeof mapInstance.value.setCenter === 'function') {
    mapInstance.value.setCenter(c)
  }
}, { deep: true })
</script>
