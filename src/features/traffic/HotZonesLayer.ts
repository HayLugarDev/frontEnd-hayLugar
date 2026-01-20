// HotZonesLayer.ts

export type HotZoneRuntime = {
  id: string
  title: string
  position: google.maps.LatLngLiteral
  tier: 1 | 2 | 3 | 4 | 5
  intensity: 'green' | 'yellow' | 'red'
  weight: number // 0..1
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
  private labels: (google.maps.Marker | null)[] = []
  private pulses: ZonePulse[] = []

  private rafId: number | null = null
  private active = false
  private t = 0

  constructor(map: google.maps.Map) {
    this.map = map
  }

  /* ===================== MOUNT ===================== */

  mount(zones: HotZoneRuntime[]) {
    this.unmount()
    this.active = true

    zones.forEach((z, idx) => {
      const baseRadius = this.radiusFromWeight(z.weight, z.tier)

      this.pulses[idx] = {
        baseRadius,
        speed: 0.8 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      }

      const color = this.color(z.intensity)

      const outer = new google.maps.Circle({
        map: this.map,
        center: z.position,
        radius: baseRadius,
        strokeOpacity: 0,
        fillColor: color,
        fillOpacity: 0.10,
        clickable: false,
        zIndex: 900 + z.tier,
      })

      const inner = new google.maps.Circle({
        map: this.map,
        center: z.position,
        radius: baseRadius * 0.6,
        strokeOpacity: 0,
        fillColor: color,
        fillOpacity: 0.22,
        clickable: false,
        zIndex: 950 + z.tier,
      })

      const label =
        z.tier >= 3
          ? new google.maps.Marker({
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
              zIndex: 1000 + z.tier,
            })
          : null

      this.circlesOuter.push(outer)
      this.circlesInner.push(inner)
      this.labels.push(label)
    })

    this.attachZoomListener()
    this.animate()
  }

  /* ===================== UPDATE (NUEVO) ===================== */

  update(zones: HotZoneRuntime[]) {
    zones.forEach((z, i) => {
      const outer = this.circlesOuter[i]
      const inner = this.circlesInner[i]
      const label = this.labels[i]
      const pulse = this.pulses[i]

      if (!outer || !inner || !pulse) return

      const newBaseRadius = this.radiusFromWeight(z.weight, z.tier)
      const color = this.color(z.intensity)

      pulse.baseRadius = newBaseRadius

      outer.setOptions({
        fillColor: color,
        zIndex: 900 + z.tier,
      })

      inner.setOptions({
        fillColor: color,
        zIndex: 950 + z.tier,
      })

      if (label) {
       label.setOptions({
    zIndex: 1000 + z.tier,
    label: {
      text: z.title.toUpperCase(),
      color: '#FFFFFF',
      fontSize: '11px',
      fontWeight: '700',
      className: 'hotzone-label',
    },
        })
      }
    })
  }

  /* ===================== UNMOUNT ===================== */

  unmount() {
    this.active = false
    if (this.rafId) cancelAnimationFrame(this.rafId)

    this.zoomListener?.remove()
    this.zoomListener = null

    this.circlesOuter.forEach(c => c.setMap(null))
    this.circlesInner.forEach(c => c.setMap(null))
    this.labels.forEach(l => l?.setMap(null))

    this.circlesOuter = []
    this.circlesInner = []
    this.labels = []
    this.pulses = []
    this.rafId = null
    this.t = 0
  }

  /* ===================== INTERNALS ===================== */

  private attachZoomListener() {
    this.zoomListener = this.map.addListener('zoom_changed', () => {
      this.zoom = this.map.getZoom() ?? 12
    })
  }

  private zoomScale() {
    return Math.max(0.6, Math.min(1.35, 12 / this.zoom))
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

  private radiusFromWeight(weight: number, tier: number) {
    const tierBase = {
      1: 120,
      2: 160,
      3: 220,
      4: 300,
      5: 360,
    }[tier]

    return tierBase + weight * 180
  }

  private color(intensity: 'green' | 'yellow' | 'red') {
    if (intensity === 'green') return '#00E676'
    if (intensity === 'yellow') return '#FFD600'
    return '#FF1744'
  }
}
