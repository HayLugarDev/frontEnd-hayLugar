<script setup lang="ts">
import { computed, defineEmits, defineProps, inject, onBeforeUnmount, onMounted, ref } from 'vue'
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

// Obtenemos el mapa desde provide() si no llega por prop
const injectedMap = inject<any>('googleMap', null)
const map = computed(() => props.map ?? injectedMap)

const bandWidthPxBase = computed(() => props.bandWidthPxBase ?? 12)
const tickMinSpacingPx = computed(() => props.tickMinSpacingPx ?? 18)
const zIndexBase = computed(() => props.zIndexBase ?? 200)

const zoom = ref<number>(16)
let zoomListener: any | null = null

const computeBandWidthPx = (z: number) => {
  // Escala sutil por zoom para sensación física
  const w = bandWidthPxBase.value * (0.92 + Math.max(-2, Math.min(4, z - 16)) * 0.06)
  return Math.max(10, Math.min(16, Math.round(w))) // más “peso”
}
const bandWidthPx = ref<number>(computeBandWidthPx(zoom.value))

onMounted(() => {
  const m = map.value
  if (!m) return
  zoom.value = m.getZoom?.() ?? 16
  bandWidthPx.value = computeBandWidthPx(zoom.value)
  zoomListener = m.addListener?.('zoom_changed', () => {
    const z = m.getZoom?.() ?? 16
    zoom.value = z
    bandWidthPx.value = computeBandWidthPx(z)
  })
})

onBeforeUnmount(() => {
  if (zoomListener) { zoomListener.remove?.(); zoomListener = null }
})

const zIndexFor = (s: Status) =>
  s === 'free' ? zIndexBase.value + 30 : s === 'limited' ? zIndexBase.value + 25 : zIndexBase.value + 20

function onHover(b: BlockVM | null) { emit('hover', b) }
function onTap(b: BlockVM) { emit('tap', b) }
</script>

<template>
  <div v-if="map" class="pointer-events-none">
    <CurbBandOverlay
      v-for="blk in blocks"
      :key="blk.id"
      :map="map"
      :block="blk"
      :band-width-px="bandWidthPx"
      :tick-min-spacing-px="tickMinSpacingPx"
      :z-index="zIndexFor(blk.status)"
      @hover="onHover"
      @tap="onTap"
    />
  </div>
</template>
