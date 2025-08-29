<script setup lang="ts">
import { computed, defineEmits, defineProps, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CurbBandOverlay from './CurbBandOverlay.vue'

type Status = 'free' | 'limited' | 'full'
type LatLng = { lat: number; lng: number }
type BlockVM = {
  id: number | string
  label: string
  status: Status
  snappedPath: LatLng[]
  length: number
  hourly_rate?: number | null
  // Derivados locales (opcional):
  capacity?: number
  occupied?: number
}

const props = defineProps<{
  blocks: BlockVM[]
  map?: any | null
  bandWidthPxBase?: number
  tickMinSpacingPx?: number
  zIndexBase?: number
}>()

const emit = defineEmits<{
  (e: 'hover', blk: BlockVM | null): void
  (e: 'tap', blk: BlockVM): void
}>()

// Puede venir por prop (instancia o ref) o por provide('googleMap', mapRef)
const injectedMap = inject<any>('googleMap', null)

// Instancia real (o null si aún no está)
const mapInst = computed<any | null>(() => {
  if (props.map) {
    if (typeof props.map === 'object' && 'value' in props.map) return (props.map as any).value
    return props.map
  }
  if (injectedMap) {
    if (typeof injectedMap === 'object' && 'value' in injectedMap) return (injectedMap as any).value
    return injectedMap
  }
  return null
})

const bandWidthPxBase = computed(() => props.bandWidthPxBase ?? 12)
const tickMinSpacingPx = computed(() => props.tickMinSpacingPx ?? 18)
const zIndexBase = computed(() => props.zIndexBase ?? 200)

const zoom = ref<number>(16)
let zoomListener: google.maps.MapsEventListener | null = null

const computeBandWidthPx = (z: number) => {
  const w = bandWidthPxBase.value * (0.92 + Math.max(-2, Math.min(4, z - 16)) * 0.06)
  return Math.max(8, Math.min(16, Math.round(w)))
}
const bandWidthPx = ref<number>(computeBandWidthPx(zoom.value))

function attachZoomListener(m: any) {
  detachZoomListener()
  if (!m?.addListener) return
  zoom.value = m.getZoom?.() ?? zoom.value
  bandWidthPx.value = computeBandWidthPx(zoom.value)
  zoomListener = m.addListener('zoom_changed', () => {
    const z = m.getZoom?.() ?? 16
    zoom.value = z
    bandWidthPx.value = computeBandWidthPx(z)
  })
}

function detachZoomListener() {
  if (zoomListener) {
    zoomListener.remove()
    zoomListener = null
  }
}

onMounted(() => {
  const m = mapInst.value
  if (m) attachZoomListener(m)
})

onBeforeUnmount(() => {
  detachZoomListener()
})

// Si el map aparece luego del mount (común en Google Maps)
watch(mapInst, (m) => {
  if (m) attachZoomListener(m)
})

// z-index por estado (libre arriba para visibilidad)
const zIndexFor = (s: Status) =>
  s === 'free' ? zIndexBase.value + 30 : s === 'limited' ? zIndexBase.value + 25 : zIndexBase.value + 20

function onHover(b: BlockVM | null) { emit('hover', b) }
function onTap(b: BlockVM) { emit('tap', b) }
</script>

<template>
  <!-- No genera DOM visible; todo se pinta en OverlayView -->
  <div v-if="mapInst" class="pointer-events-none">
    <CurbBandOverlay
      v-for="blk in blocks"
      :key="blk.id"
      :map="mapInst"
      :block="blk"
      :band-width-px="bandWidthPx"
      :tick-min-spacing-px="tickMinSpacingPx"
      :z-index="zIndexFor(blk.status)"
      @hover="onHover"
      @tap="onTap"
    />
  </div>
</template>
