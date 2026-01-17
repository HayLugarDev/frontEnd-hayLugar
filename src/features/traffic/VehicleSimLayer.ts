import { Ref, watch } from "vue"
import { useGoogleMapsReady } from "../../logic/useGoogleMapsReady"

export type SimLevel = "green" | "yellow" | "red"

type Vehicle = {
  marker: google.maps.Marker
  vx: number
  vy: number
}

export class VehicleSimLayer {
  private mapRef: Ref<google.maps.Map | null>
  private vehicles: Vehicle[] = []
  private running = false

  /* ===================== STATE ===================== */

  private level: SimLevel = "green"                 // UX / narrativa
  private center: google.maps.LatLngLiteral | null = null
  private weight = 0                                 // densidad real 0..1

  private rafId: number | null = null
  private stopWatch: (() => void) | null = null

  private isReady = useGoogleMapsReady().isReady

  constructor(mapRef: Ref<google.maps.Map | null>) {
    this.mapRef = mapRef
  }

  /* ===================== CONFIG ===================== */

  /**
   * Punto único de control.
   * TODAS las opciones se derivan de estos parámetros.
   */
  configure(
    level: SimLevel,
    center: google.maps.LatLngLiteral,
    weight: number = 0
  ) {
    const w = Math.max(0, Math.min(1, weight))

    const needsRestart =
      this.level !== level ||
      this.weight !== w ||
      !this.center ||
      Math.abs(this.center.lat - center.lat) > 1e-6 ||
      Math.abs(this.center.lng - center.lng) > 1e-6

    this.level = level
    this.center = center
    this.weight = w

    if (this.running && needsRestart) {
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
        this.animate()
      },
      { immediate: true }
    )
  }

  stop() {
    this.running = false

    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null

    this.stopWatch?.()
    this.stopWatch = null

    this.vehicles.forEach(v => v.marker.setMap(null))
    this.vehicles = []
  }

  /* ===================== SPAWN ===================== */

  private spawnVehicles(map: google.maps.Map) {
    if (!this.center) return

    // Cantidad derivada SOLO de densidad
    const min = 6
    const max = 60
    const count = Math.round(min + (max - min) * this.weight)

    for (let i = 0; i < count; i++) {
      const angle = this.spawnAngle()
      const speed = this.baseSpeed()

      const marker = new google.maps.Marker({
        position: this.randomPoint(this.center),
        map,
        zIndex: 9999,
        opacity: 0.9,
        clickable: false,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 4.5,
          strokeColor: this.levelColor(),
          strokeWeight: 2.5,
          fillColor: this.levelColor(),
          fillOpacity: 1,
          rotation: (angle * 180) / Math.PI,
        },
      })

      this.vehicles.push({
        marker,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      })
    }
  }

  /* ===================== ANIMATION ===================== */

  private animate = () => {
    if (!this.running || !this.center) return

    const radius = this.radiusLimit()
    const friction = this.friction()

    this.vehicles.forEach(v => {
      const pos = v.marker.getPosition()
      if (!pos) return

      // Fricción → embotellamiento
      v.vx *= friction
      v.vy *= friction

      let lat = pos.lat() + v.vy
      let lng = pos.lng() + v.vx

      // Mantener dentro del área activa
      const dist =
        Math.abs(lat - this.center!.lat) +
        Math.abs(lng - this.center!.lng)

      if (dist > radius) {
        const angle = this.spawnAngle()
        const speed = this.baseSpeed()
        v.vx = Math.cos(angle) * speed
        v.vy = Math.sin(angle) * speed
        lat = pos.lat()
        lng = pos.lng()
      }

      v.marker.setPosition({ lat, lng })

      const icon = v.marker.getIcon() as google.maps.Symbol
      if (icon) {
        icon.rotation = Math.atan2(v.vy, v.vx) * (180 / Math.PI)
        v.marker.setIcon(icon)
      }
    })

    this.rafId = requestAnimationFrame(this.animate)
  }

  /* ===================== BEHAVIOR ===================== */

  /** Corredores urbanos (avenidas simuladas) */
  private spawnAngle() {
    // A mayor densidad, más direccionalidad
    if (this.weight < 0.35) {
      return Math.random() * Math.PI * 2
    }

    // Ejes principales
    const base =
      Math.random() > 0.5 ? 0 : Math.PI / 2

    // Variación leve para naturalidad
    return base + (Math.random() - 0.5) * 0.4
  }

  /** Velocidad base */
  private baseSpeed() {
    // Más densidad → más lento
    return Math.max(
      0.00005,
      0.0003 - this.weight * 0.00018
    )
  }

  /** Fricción tipo embotellamiento */
  private friction() {
    return 0.996 - this.weight * 0.02
  }

  /** Área activa */
  private radiusLimit() {
    return 0.007 + this.weight * 0.035
  }

  private randomPoint(center: google.maps.LatLngLiteral) {
    const r = this.radiusLimit()
    return {
      lat: center.lat + (Math.random() - 0.5) * r,
      lng: center.lng + (Math.random() - 0.5) * r,
    }
  }

  private levelColor() {
    switch (this.level) {
      case "green": return "#00E676"
      case "yellow": return "#FFD600"
      case "red": return "#FF1744"
    }
  }
}
