import { Ref, watch } from 'vue'
import { useGoogleMapsReady } from '../../logic/useGoogleMapsReady'

export type SimLevel = 'green' | 'yellow' | 'red'

export class VehicleSimLayer {
  private mapRef: Ref<google.maps.Map | null>
  private vehicles: google.maps.Marker[] = []
  private running = false

  private level: SimLevel = 'green'
  private center: google.maps.LatLngLiteral | null = null

  private isReady = useGoogleMapsReady().isReady
  private stopWatch: (() => void) | null = null

  constructor(mapRef: Ref<google.maps.Map | null>) {
    this.mapRef = mapRef
  }

  /* ===================== CONFIG ===================== */

  configure(level: SimLevel, center: google.maps.LatLngLiteral) {
    const levelChanged = this.level !== level

    this.level = level
    this.center = center

    // 🔁 Si cambia el nivel, recreamos vehículos
    if (this.running && levelChanged) {
      this.stop()
      this.start()
    }
  }

  /* ===================== LIFECYCLE ===================== */

  start() {
    if (this.stopWatch) return

    this.stopWatch = watch(
      [this.isReady, () => this.mapRef.value],
      ([ready, map]) => {
        if (!ready || !map || this.running || !this.center) return

        this.running = true
        this.spawnVehicles(map)
      },
      { immediate: true }
    )
  }

  stop() {
    this.running = false
    this.stopWatch?.()
    this.stopWatch = null

    this.vehicles.forEach(v => v.setMap(null))
    this.vehicles = []
  }

  /* ===================== SPAWN ===================== */

  private spawnVehicles(map: google.maps.Map) {
    if (!(window as any).google?.maps?.Marker || !this.center) return

    const count =
      this.level === 'green' ? 12 :
      this.level === 'yellow' ? 28 :
      45

    for (let i = 0; i < count; i++) {
      const rotation = Math.random() * 360

      const marker = new google.maps.Marker({
        position: this.randomPoint(this.center),
        map,
        zIndex: 9999, // 🔥 siempre encima del tráfico
        opacity: 0.85,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 4.5,              // 🔥 MÁS GRANDE
          strokeColor: this.levelColor(),
          strokeWeight: 2.5,       // 🔥 MÁS CONTRASTE
          fillColor: this.levelColor(),
          fillOpacity: 1,
          rotation,
        },
      })

      this.vehicles.push(marker)
      this.animate(marker)
    }
  }

  /* ===================== ANIMATION ===================== */

  private animate(marker: google.maps.Marker) {
    if (!this.running) return

    setTimeout(() => {
      if (!this.running) return

      const pos = marker.getPosition()
      if (!pos) return

      const dx = (Math.random() - 0.5) * 0.0008
      const dy = (Math.random() - 0.5) * 0.0008

      marker.setPosition({
        lat: pos.lat() + dx,
        lng: pos.lng() + dy,
      })

      // 🔄 Rotación dinámica (sensación de flujo)
      const icon = marker.getIcon() as google.maps.Symbol
      if (icon) {
        icon.rotation = Math.atan2(dy, dx) * (180 / Math.PI)
        marker.setIcon(icon)
      }

      this.animate(marker)
    }, 700)
  }

  /* ===================== UTILS ===================== */

  private randomPoint(center: google.maps.LatLngLiteral) {
    return {
      lat: center.lat + (Math.random() - 0.5) * 0.015,
      lng: center.lng + (Math.random() - 0.5) * 0.015,
    }
  }

  private levelColor() {
    switch (this.level) {
      case 'green': return '#00E676'
      case 'yellow': return '#FFD600'
      case 'red': return '#FF1744'
    }
  }
}
