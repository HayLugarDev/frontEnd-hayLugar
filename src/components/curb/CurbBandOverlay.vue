<script setup lang="ts">
import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
  map: any
  block: BlockVM
  bandWidthPx: number
  tickMinSpacingPx: number
  zIndex: number
}>()

const emit = defineEmits<{
  (e: 'hover', blk: BlockVM | null): void
  (e: 'tap', blk: BlockVM): void
}>()

let overlay: any | null = null
const container = ref<HTMLDivElement | null>(null)

// Refs reactivos de dibujo
const current = {
  block: props.block,
  bandW: props.bandWidthPx,
  tickSpacing: props.tickMinSpacingPx,
  zIndex: props.zIndex,
}

watch(() => props.block, v => { current.block = v; scheduleDraw() }, { deep: true })
watch(() => props.bandWidthPx, v => { current.bandW = v; scheduleDraw() })
watch(() => props.tickMinSpacingPx, v => { current.tickSpacing = v; scheduleDraw() })
watch(() => props.zIndex, v => { current.zIndex = v; if (container.value) container.value.style.zIndex = String(v) })

let drawQueued = false
function scheduleDraw() {
  if (!overlay) return
  if (drawQueued) return
  drawQueued = true
  requestAnimationFrame(() => { drawQueued = false; overlay?.draw?.() })
}

function pathToPixels(path: LatLng[], projection: any) {
  const pts: {x:number;y:number}[] = []
  for (const p of path) {
    const latLng = new (window as any).google.maps.LatLng(p.lat, p.lng)
    const px = projection.fromLatLngToDivPixel(latLng)
    pts.push({ x: px.x, y: px.y })
  }
  return pts
}

function sumLength(pxPts: {x:number;y:number}[]) {
  let total = 0
  for (let i=1; i<pxPts.length; i++) {
    const dx = pxPts[i].x - pxPts[i-1].x
    const dy = pxPts[i].y - pxPts[i-1].y
    total += Math.hypot(dx, dy)
  }
  return total
}

// Orientación local en el punto medio del trazado
function midOrientation(pxPts: {x:number;y:number}[]) {
  const segs: {dx:number; dy:number; len:number}[] = []
  let total = 0
  for (let i=1; i<pxPts.length; i++) {
    const dx = pxPts[i].x - pxPts[i-1].x
    const dy = pxPts[i].y - pxPts[i-1].y
    const len = Math.hypot(dx, dy)
    if (len > 0) { segs.push({dx, dy, len}); total += len }
  }
  if (!segs.length) {
    return { angle: 0, midPoint: pxPts[0] ?? {x:0,y:0}, dir: { ux: 1, uy: 0 } }
  }
  const target = total / 2
  let acc = 0, idx = 0
  for (; idx < segs.length; idx++) {
    if (acc + segs[idx].len >= target) break
    acc += segs[idx].len
  }
  const s = segs[Math.min(idx, segs.length-1)]
  const start = pxPts[idx]
  const t = (target - acc) / (s.len || 1)
  const midPoint = { x: start.x + s.dx * t, y: start.y + s.dy * t }
  const ux = s.dx / (s.len || 1), uy = s.dy / (s.len || 1)
  const angle = Math.atan2(uy, ux)
  return { angle, midPoint, dir: { ux, uy } }
}

function colorFor(status: Status) {
  if (status === 'free') return '#2EBD85'
  if (status === 'limited') return '#FFC01E'
  return '#F44336'
}

// --- RNG determinista (xorshift) a partir del id del bloque ---
function hashToSeed(id: number | string): number {
  const s = String(id)
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) || 1
}
function makeRng(seed: number) {
  let x = seed >>> 0
  return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x >>>= 0; x ^= x << 5; x >>>= 0; return (x >>> 0) / 0xffffffff }
}

/** Paleta y estilos de los “autos” para máxima visibilidad */
const CAR_FILL = '#2B2F33'      // grafito (alto contraste sobre verde/amarillo/rojo)
const CAR_FILL_OPACITY = 0.92   // casi sólido
const CAR_STROKE = '#000000'    // delineado sutil
const CAR_STROKE_OPACITY = 0.28
const CAR_WINDSHIELD_OPACITY = 0.35
const CAR_NOSE_OPACITY = 0.35

// Dibujo SVG del cordón (banda + autos minimalistas)
function buildSVG(pxPts: {x:number;y:number}[]) {
  const blk = current.block
  const bandH = current.bandW
  const color = colorFor(blk.status)

  // Longitud total y orientación local en el punto medio
  const width = Math.max(2, Math.round(sumLength(pxPts)))
  const { angle, midPoint, dir } = midOrientation(pxPts)

  // Rect centrado en el trazado: origin = midPoint - (width/2)*dir
  const origin = { x: midPoint.x - dir.ux * (width / 2), y: midPoint.y - dir.uy * (width / 2) }

  // Offset hacia la vereda (normal)
  const nx = -Math.sin(angle)
  const ny =  Math.cos(angle)
  const gutter = 2
  const off = (bandH / 2) + gutter
  const ox = nx * off
  const oy = ny * off

  // Contenedor + SVG
  const wrap = document.createElement('div')
  wrap.style.position = 'absolute'
  wrap.style.left = '0'
  wrap.style.top = '0'
  wrap.style.width = '0'
  wrap.style.height = '0'
  wrap.style.zIndex = String(current.zIndex)
  wrap.style.pointerEvents = 'auto'

  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg') as SVGSVGElement
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(bandH))
  svg.style.transformOrigin = '0 0'
  svg.style.transform = `translate(${origin.x + ox}px, ${origin.y + oy}px) rotate(${angle}rad) translate(0px, ${-bandH/2}px)`

  // Defs (patrones + sombra de auto)
  const defs = document.createElementNS(ns, 'defs') as SVGDefsElement

  // Patrón de puntos
  const patDots = document.createElementNS(ns, 'pattern') as SVGPatternElement
  patDots.setAttribute('id', `dots-${blk.id}`)
  patDots.setAttribute('patternUnits', 'userSpaceOnUse')
  patDots.setAttribute('width', '6')
  patDots.setAttribute('height', '6')
  const dot = document.createElementNS(ns, 'circle') as SVGCircleElement
  dot.setAttribute('cx', '1'); dot.setAttribute('cy', '1'); dot.setAttribute('r', '1')
  dot.setAttribute('fill', '#ffffff'); dot.setAttribute('opacity', '0.5')
  patDots.appendChild(dot)

  // Patrón diagonal
  const patDiag = document.createElementNS(ns, 'pattern') as SVGPatternElement
  patDiag.setAttribute('id', `diag-${blk.id}`)
  patDiag.setAttribute('patternUnits', 'userSpaceOnUse')
  patDiag.setAttribute('width', '8')
  patDiag.setAttribute('height', '8')
  patDiag.setAttribute('patternTransform', 'rotate(45)')
  const rectDiag = document.createElementNS(ns, 'rect') as SVGRectElement
  rectDiag.setAttribute('x', '0'); rectDiag.setAttribute('y', '0')
  rectDiag.setAttribute('width', '4'); rectDiag.setAttribute('height', '8')
  rectDiag.setAttribute('fill', '#ffffff'); rectDiag.setAttribute('opacity', '0.25')
  patDiag.appendChild(rectDiag)

  // Sombra de autos (feDropShadow)
  const flt = document.createElementNS(ns, 'filter') as SVGFilterElement
  flt.setAttribute('id', `carShadow-${blk.id}`)
  flt.setAttribute('x', '-20%'); flt.setAttribute('y', '-20%')
  flt.setAttribute('width', '140%'); flt.setAttribute('height', '140%')
  const feDrop = document.createElementNS(ns, 'feDropShadow') as SVGFEDropShadowElement
  feDrop.setAttribute('dx', '0'); feDrop.setAttribute('dy', '0.6')
  feDrop.setAttribute('stdDeviation', '0.7')
  feDrop.setAttribute('flood-color', '#000000')
  feDrop.setAttribute('flood-opacity', '0.35')
  flt.appendChild(feDrop)

  defs.appendChild(patDots)
  defs.appendChild(patDiag)
  defs.appendChild(flt)
  svg.appendChild(defs)

  // Banda base
  const base = document.createElementNS(ns, 'rect') as SVGRectElement
  base.setAttribute('x', '0')
  base.setAttribute('y', '0')
  base.setAttribute('width', String(width))
  base.setAttribute('height', String(bandH))
  base.setAttribute('rx', '6')
  base.setAttribute('fill', color)
  base.setAttribute('fill-opacity', '0.92')
  svg.appendChild(base)

  // Patrón por estado (free/limited)
  if (blk.status === 'free' || blk.status === 'limited') {
    const pat = document.createElementNS(ns, 'rect') as SVGRectElement
    pat.setAttribute('x', '0')
    pat.setAttribute('y', '0')
    pat.setAttribute('width', String(width))
    pat.setAttribute('height', String(bandH))
    pat.setAttribute('rx', '6')
    pat.setAttribute('fill', blk.status === 'free' ? `url(#dots-${blk.id})` : `url(#diag-${blk.id})`)
    pat.setAttribute('opacity', '1')
    svg.appendChild(pat)
  }

  // Borde superficial
  const border = document.createElementNS(ns, 'rect') as SVGRectElement
  border.setAttribute('x', '0')
  border.setAttribute('y', '0')
  border.setAttribute('width', String(width))
  border.setAttribute('height', String(bandH))
  border.setAttribute('rx', '6')
  border.setAttribute('fill', 'none')
  border.setAttribute('stroke', '#000000')
  border.setAttribute('stroke-opacity', '0.18')
  svg.appendChild(border)

  // --- AUTOS MINIMALISTAS visibles ---
  const capRaw = Number.isFinite(blk.capacity as any) ? Number(blk.capacity) : Math.max(3, Math.round((blk.length || 60) / 5))
  const cap = Math.max(0, Math.round(capRaw))
  const occRaw = Number.isFinite(blk.occupied as any) ? Number(blk.occupied) :
    (blk.status === 'full' ? cap : blk.status === 'limited' ? Math.round(cap * 0.6) : Math.round(cap * 0.2))
  const occ = Math.max(0, Math.min(cap, Math.round(occRaw)))

  if (cap > 0 && occ > 0) {
    const gap = 2
    const slotStep = width / cap
    const slotW = Math.max(6, slotStep - gap)
    const pillW = Math.min(slotW * 0.86, bandH * 1.55)
    const pillH = Math.max(6, Math.min(bandH * 0.66, 14))
    const ry = Math.round(pillH / 2)

    const rng = makeRng(hashToSeed(blk.id))
    const indices = Array.from({ length: cap }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      const tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp
    }
    const occupiedIdx = new Set(indices.slice(0, occ))

    const offsetStart = (width - slotStep * cap) / 2
    for (let i = 0; i < cap; i++) {
      if (!occupiedIdx.has(i)) continue
      const slotCenterX = offsetStart + i * slotStep + slotStep / 2

      // jitter sutil
      const jx = (rng() - 0.5) * 3
      const jy = (rng() - 0.5) * 2

      const cx = slotCenterX + jx
      const cy = bandH / 2 + jy
      const x = cx - pillW / 2
      const y = cy - pillH / 2

      // “Car body”
      const car = document.createElementNS(ns, 'rect') as SVGRectElement
      car.setAttribute('x', String(x))
      car.setAttribute('y', String(y))
      car.setAttribute('width', String(pillW))
      car.setAttribute('height', String(pillH))
      car.setAttribute('rx', String(ry))
      car.setAttribute('fill', CAR_FILL)
      car.setAttribute('fill-opacity', String(CAR_FILL_OPACITY))
      car.setAttribute('stroke', CAR_STROKE)
      car.setAttribute('stroke-opacity', String(CAR_STROKE_OPACITY))
      car.setAttribute('filter', `url(#carShadow-${blk.id})`)
      car.setAttribute('style', 'opacity:0; transform:scale(0.92); transition: opacity 180ms ease, transform 180ms ease; transform-origin: center;')
      svg.appendChild(car)

      // Nariz más visible (triángulo claro)
      const nose = document.createElementNS(ns, 'path') as SVGPathElement
      const nx0 = x + pillW * 0.48
      const nx1 = x + pillW * 0.56
      const ny0 = cy - pillH * 0.22
      const ny1 = cy + pillH * 0.22
      nose.setAttribute('d', `M ${nx0} ${ny0} L ${nx1} ${cy} L ${nx0} ${ny1} z`)
      nose.setAttribute('fill', '#FFFFFF')
      nose.setAttribute('fill-opacity', String(CAR_NOSE_OPACITY))
      nose.setAttribute('style', 'opacity:0; transform:scale(0.92); transition: opacity 180ms ease, transform 180ms ease; transform-origin: center;')
      svg.appendChild(nose)

      // Parabrisas (rect pequeño)
      const ws = document.createElementNS(ns, 'rect') as SVGRectElement
      ws.setAttribute('x', String(x - pillW * 0.04 + pillW * 0.52))
      ws.setAttribute('y', String(y + pillH * 0.22))
      ws.setAttribute('width', String(pillW * 0.16))
      ws.setAttribute('height', String(pillH * 0.22))
      ws.setAttribute('rx', String(Math.max(2, pillH * 0.1)))
      ws.setAttribute('fill', '#FFFFFF')
      ws.setAttribute('fill-opacity', String(CAR_WINDSHIELD_OPACITY))
      ws.setAttribute('style', 'opacity:0; transform:scale(0.92); transition: opacity 180ms ease, transform 180ms ease; transform-origin: center;')
      svg.appendChild(ws)

      // Activar animación
      requestAnimationFrame(() => {
        car.style.opacity = '1'; car.style.transform = 'scale(1)'
        nose.style.opacity = '1'; nose.style.transform = 'scale(1)'
        ws.style.opacity = '1'; ws.style.transform = 'scale(1)'
      })
    }
  }

  // Hotspot (hitbox)
  const hotspot = document.createElementNS(ns, 'rect') as SVGRectElement
  hotspot.setAttribute('x', '0')
  hotspot.setAttribute('y', String(-10))
  hotspot.setAttribute('width', String(width))
  hotspot.setAttribute('height', String(bandH + 20))
  hotspot.setAttribute('fill', 'transparent')
  hotspot.setAttribute('style', 'cursor: pointer')
  hotspot.addEventListener('mouseenter', () => emit('hover', current.block))
  hotspot.addEventListener('mouseleave', () => emit('hover', null))
  hotspot.addEventListener('click', () => emit('tap', current.block))
  svg.appendChild(hotspot)

  wrap.appendChild(svg)
  return wrap
}

function createOverlayIfPossible() {
  const g = (window as any).google
  if (!g?.maps?.OverlayView || !props.map || overlay) return

  class BandOverlay extends g.maps.OverlayView {
    div: HTMLDivElement | null = null
    onAdd() {
      this.div = document.createElement('div')
      this.div.style.position = 'absolute'
      this.getPanes().overlayMouseTarget.appendChild(this.div)
      container.value = this.div
      container.value.style.zIndex = String(current.zIndex)
    }
    draw() {
      if (!this.div) return
      const blk = current.block
      if (!blk?.snappedPath || blk.snappedPath.length < 2) return
      const proj = this.getProjection()
      if (!proj) return
      this.div.innerHTML = ''
      const pxPts = pathToPixels(blk.snappedPath, proj)
      const node = buildSVG(pxPts)
      this.div.appendChild(node)
    }
    onRemove() {
      if (this.div?.parentNode) this.div.parentNode.removeChild(this.div)
      this.div = null
    }
  }

  overlay = new BandOverlay()
  overlay.setMap(props.map)
}

onMounted(() => { createOverlayIfPossible() })
watch(() => props.map, () => { createOverlayIfPossible() })
onBeforeUnmount(() => { try { overlay?.setMap(null) } catch {} overlay = null })
</script>

<template>
  <!-- Nada en el árbol Vue; todo se dibuja en OverlayView -->
  <div style="display:none" />
</template>
