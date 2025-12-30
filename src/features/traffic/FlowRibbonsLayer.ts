// src/features/traffic/FlowRibbonsLayer.ts
export type FlowPath = {
  id: string
  path: google.maps.LatLngLiteral[]
  level: 'green' | 'yellow' | 'red'
}

export class FlowRibbonsLayer {
  private map: google.maps.Map
  private lines: google.maps.Polyline[] = []
  private rafId: number | null = null
  private offset = 0
  private active = false

  constructor(map: google.maps.Map) {
    this.map = map
  }

  mount(paths: FlowPath[]) {
    this.unmount()
    this.active = true

    paths.forEach(p => {
      const line = new google.maps.Polyline({
        map: this.map,
        path: p.path,
        strokeOpacity: 0.0,
        clickable: false,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 2.6,
              strokeColor: this.color(p.level),
              strokeOpacity: 0.9,
            },
            offset: '0px',
            repeat: '30px',
          },
        ],
        zIndex: 4,
      })
      this.lines.push(line)
    })

    this.animate()
  }

  unmount() {
    this.active = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.lines.forEach(l => l.setMap(null))
    this.lines = []
    this.offset = 0
  }

  private animate = () => {
    if (!this.active) return
    this.offset = (this.offset + 1.5) % 30
    this.lines.forEach(l => {
      const icons = l.get('icons')
      if (icons?.[0]) {
        icons[0].offset = `${this.offset}px`
        l.set('icons', icons)
      }
    })
    this.rafId = requestAnimationFrame(this.animate)
  }

  private color(level: 'green' | 'yellow' | 'red') {
    if (level === 'green') return '#00E676'
    if (level === 'yellow') return '#FFD600'
    return '#FF1744'
  }
}
