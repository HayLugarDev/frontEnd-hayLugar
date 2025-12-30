import { inject, shallowRef, watch, type Ref } from 'vue'
import { useGoogleMapsReady } from '../logic/useGoogleMapsReady'

export function useTrafficLayer(enabled: Ref<boolean>) {
  // 🔑 El mapa se inyecta como REF (no como valor)
  const mapRef = inject<Ref<google.maps.Map | null>>('googleMap')

  // Estado de carga de Google Maps
  const { isReady } = useGoogleMapsReady()

  // Capa de tráfico
  const trafficLayer = shallowRef<google.maps.TrafficLayer | null>(null)

  watch(
    [enabled, isReady, () => mapRef?.value],
    ([isEnabled, ready, map]) => {
      // 🔒 Guardas duras
      if (!isEnabled) {
        trafficLayer.value?.setMap(null)
        return
      }

   if (!ready) return


      if (!map) {
        console.warn('[TrafficLayer] Map instance not ready yet')
        return
      }

      if (!(window as any).google?.maps?.TrafficLayer) {
        console.error(
          '[TrafficLayer] TrafficLayer NOT available. Check libraries=traffic'
        )
        return
      }

      if (!trafficLayer.value) {
        trafficLayer.value = new google.maps.TrafficLayer()
        console.log('[TrafficLayer] TrafficLayer created')
      }

      trafficLayer.value.setMap(map)
    },
    { immediate: true }
  )

  return {
    disable() {
      trafficLayer.value?.setMap(null)
    },
  }
}
