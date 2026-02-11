<template>
  <div ref="mapRef" class="w-full h-[400px] md:h-[520px] rounded-2xl overflow-hidden border border-white/10"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type LatLngLiteral = google.maps.LatLngLiteral
type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral

const props = defineProps<{
  center: LatLngLiteral
  zones?: Array<{
    id?: number
    name?: string
    center_lat?: number
    center_lng?: number
  }>
  accessPoints?: Array<{
    id?: number
    name?: string
    type?: string
    lat?: number
    lng?: number
  }>
  bounds?: LatLngBoundsLiteral | null
}>()

const mapRef = ref<HTMLDivElement | null>(null)
let map: google.maps.Map

onMounted(() => {
  if (!window.google || !mapRef.value) return

  map = new google.maps.Map(mapRef.value, {
    center: props.center,
    zoom: 17,
    mapId: 'HAYLUGAR_EVENT_MAP',
    disableDefaultUI: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#0D1B2A' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#B0BEC5' }] },
      { featureType: 'water', stylers: [{ color: '#00B4D8' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    ],
  })

  if (props.bounds) map.fitBounds(props.bounds)

  // 🟢 Zonas (círculos verdes con label)
  props.zones?.forEach((z) => {
    if (z.center_lat && z.center_lng) {
      const marker = new google.maps.Marker({
        position: { lat: z.center_lat, lng: z.center_lng },
        map,
        title: z.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: 'newgreen',
          fillOpacity: 0.9,
          strokeWeight: 0,
        },
        label: {
          text: z.name || '',
          color: '#B0BEC5',
          fontSize: '10px',
          fontWeight: 'bold',
        },
      })
    }
  })

  // 🔵 Accesos (flechas azules con label)
  props.accessPoints?.forEach((a) => {
    if (a.lat && a.lng) {
      new google.maps.Marker({
        position: { lat: a.lat, lng: a.lng },
        map,
        title: a.name || a.type,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#00B4D8',
          fillOpacity: 0.8,
          strokeWeight: 0,
        },
        label: {
          text: a.name || a.type || '',
          color: '#B0BEC5',
          fontSize: '10px',
        },
      })
    }
  })
})
</script>
