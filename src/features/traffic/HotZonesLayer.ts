export type HotZone = {
  id: string
  title: string
  position: google.maps.LatLngLiteral
  level: 'green' | 'yellow' | 'red'
  weight?: number
}

type ZonePulse = {
  baseRadius: number
  speed: number
  phase: number
}

export class HotZonesLayer {
  private map: google.maps.Map
  private zoom = 12
  private zoomListener: google.maps.MapsEventListener | null = null

  private circlesOuter: google.maps.Circle[] = []
  private circlesInner: google.maps.Circle[] = []
  private labels: google.maps.Marker[] = []
  private pulses: ZonePulse[] = []

  private rafId: number | null = null
  private active = false
  private t = 0

  constructor(map: google.maps.Map) {
    this.map = map
  }

  mount(zones: HotZone[]) {
    this.unmount()
    this.active = true

    zones.forEach((z, idx) => {
      const weight = z.weight ?? 2
      const baseRadius = 200 + weight * 70

      this.pulses[idx] = {
        baseRadius,
        speed: 0.8 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      }

      const outer = new google.maps.Circle({
        map: this.map,
        center: z.position,
        radius: baseRadius,
        strokeOpacity: 0,
        fillColor: this.color(z.level),
        fillOpacity: 0.10,
        clickable: false,
        zIndex: 999,
      })

      const inner = new google.maps.Circle({
        map: this.map,
        center: z.position,
        radius: baseRadius * 0.6,
        strokeOpacity: 0,
        fillColor: this.color(z.level),
        fillOpacity: 0.22,
        clickable: false,
        zIndex: 1000,
      })

      const label = new google.maps.Marker({
        map: this.map,
        position: z.position,
        clickable: false,
        label: {
          text: z.title.toUpperCase(),
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '700',
          className: 'hotzone-label',
        },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
        zIndex: 1001,
      })

      this.circlesOuter.push(outer)
      this.circlesInner.push(inner)
      this.labels.push(label)
    })

    this.attachZoomListener()
    this.animate()
  }

  unmount() {
    this.active = false
    if (this.rafId) cancelAnimationFrame(this.rafId)

    this.zoomListener?.remove()
    this.zoomListener = null

    this.circlesOuter.forEach(c => c.setMap(null))
    this.circlesInner.forEach(c => c.setMap(null))
    this.labels.forEach(l => l.setMap(null))

    this.circlesOuter = []
    this.circlesInner = []
    this.labels = []
    this.pulses = []
    this.rafId = null
    this.t = 0
  }

  private attachZoomListener() {
    this.zoomListener = this.map.addListener("zoom_changed", () => {
      this.zoom = this.map.getZoom() ?? 12
    })
  }

  private zoomScale() {
    return Math.max(0.6, Math.min(1.4, 12 / this.zoom))
  }

  private animate = () => {
    if (!this.active) return
    this.t += 0.016
    const scale = this.zoomScale()

    this.circlesOuter.forEach((c, i) => {
      const p = this.pulses[i]
      if (!p) return
      const pulse = (Math.sin(this.t * p.speed + p.phase) + 1) / 2
      c.setRadius(p.baseRadius * scale * (1.05 + pulse * 0.25))
      c.setOptions({ fillOpacity: 0.08 + pulse * 0.12 })
    })

    this.circlesInner.forEach((c, i) => {
      const p = this.pulses[i]
      if (!p) return
      const pulse = (Math.sin(this.t * (p.speed + 0.4) + p.phase) + 1) / 2
      c.setRadius(p.baseRadius * scale * (0.55 + pulse * 0.15))
      c.setOptions({ fillOpacity: 0.18 + pulse * 0.18 })
    })

    this.rafId = requestAnimationFrame(this.animate)
  }

  private color(level: 'green' | 'yellow' | 'red') {
    if (level === 'green') return '#00E676'
    if (level === 'yellow') return '#FFD600'
    return '#FF1744'
  }
}
