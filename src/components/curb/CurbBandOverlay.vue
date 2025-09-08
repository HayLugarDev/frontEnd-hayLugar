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
  const pts: { x:number;y:number }[] = []
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

function midOrientation(pxPts: {x:number;y:number}[]) {
  const segs: {dx:number; dy:number; len:number}[] = []
  let total = 0
  for (let i=1; i<pxPts.length; i++) {
    const dx = pxPts[i].x - pxPts[i-1].x
    const dy = pxPts[i].y - pxPts[i-1].y
    const len = Math.hypot(dx, dy)
    if (len > 0) { segs.push({dx, dy, len}); total += len }
  }
  if (!segs.length) return { angle: 0, midPoint: pxPts[0] ?? {x:0,y:0}, dir: { ux: 1, uy: 0 } }
  const target = total / 2
  let acc = 0, idx = 0
  for (; idx < segs.length; idx++) { if (acc + segs[idx].len >= target) break; acc += segs[idx].len }
  const s = segs[Math.min(idx, segs.length-1)]
  const start = pxPts[idx]
  const t = (target - acc) / (s.len || 1)
  const midPoint = { x: start.x + s.dx * t, y: start.y + s.dy * t }
  const ux = s.dx / (s.len || 1), uy = s.dy / (s.len || 1)
  const angle = Math.atan2(uy, ux)
  return { angle, midPoint, dir: { ux, uy } }
}

function colorFor(status: Status) {
  if (status === 'free') return getCss('--band-free', '#29C78A')
  if (status === 'limited') return getCss('--band-limited', '#FFC01E')
  return getCss('--band-full', '#E23A4E')
}

function getCss(varName: string, fallback: string | number) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName)?.trim()
  return String(v || fallback)
}

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

const CAR_FILL = getCss('--car-fill', '#2B2F33')
const CAR_FILL_OPACITY = parseFloat(getCss('--op-car-fill', .96 as any))
const CAR_STROKE = getCss('--car-stroke', '#000000')
const CAR_STROKE_OPACITY = parseFloat(getCss('--op-car-stroke', .30 as any))
const CAR_SPECULAR = getCss('--car-specular', '#FFFFFF')
const CAR_SPECULAR_OPACITY = parseFloat(getCss('--op-specular', .38 as any))

function buildSVG(pxPts: {x:number;y:number}[]) {
  const blk = current.block
  const bandH = current.bandW
  const color = colorFor(blk.status)

  const width = Math.max(2, Math.round(sumLength(pxPts)))
  const { angle, midPoint, dir } = midOrientation(pxPts)
  const origin = { x: midPoint.x - dir.ux * (width / 2), y: midPoint.y - dir.uy * (width / 2) }

  const nx = -Math.sin(angle)
  const ny =  Math.cos(angle)
  const gutter = 2
  const off = (bandH / 2) + gutter
  const ox = nx * off, oy = ny * off

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

  const defs = document.createElementNS(ns, 'defs') as SVGDefsElement

  // Gradiente vertical sutil
  const grad = document.createElementNS(ns, 'linearGradient')
  grad.setAttribute('id', `bandGrad-${blk.id}`)
  grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0')
  grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1')
  const gStop1 = document.createElementNS(ns, 'stop')
  gStop1.setAttribute('offset', '0%'); gStop1.setAttribute('stop-color', '#ffffff'); gStop1.setAttribute('stop-opacity', '0.06')
  const gStop2 = document.createElementNS(ns, 'stop')
  gStop2.setAttribute('offset', '100%'); gStop2.setAttribute('stop-color', '#000000'); gStop2.setAttribute('stop-opacity', '0.08')
  grad.appendChild(gStop1); grad.appendChild(gStop2)
  defs.appendChild(grad)

  // Inner shadow
  const inner = document.createElementNS(ns, 'filter')
  inner.setAttribute('id', `innerShadow-${blk.id}`)
  inner.setAttribute('x', '-20%'); inner.setAttribute('y', '-20%')
  inner.setAttribute('width', '140%'); inner.setAttribute('height', '140%')
  inner.innerHTML = `
    <feOffset dx="0" dy="1" result="off"/>
    <feGaussianBlur in="off" stdDeviation="1.2" result="blur"/>
    <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" result="inner"/>
    <feColorMatrix in="inner" type="matrix" values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 .85 0" />
  `
  defs.appendChild(inner)

  // Outer glow
  const glow = document.createElementNS(ns, 'filter')
  glow.setAttribute('id', `bandGlow-${blk.id}`)
  glow.setAttribute('x', '-40%'); glow.setAttribute('y', '-80%')
  glow.setAttribute('width', '180%'); glow.setAttribute('height', '280%')
  const feG = document.createElementNS(ns, 'feGaussianBlur')
  feG.setAttribute('stdDeviation', blk.status === 'full' ? '3.5' : blk.status === 'limited' ? '3' : '2.5')
  feG.setAttribute('result', 'coloredBlur')
  glow.appendChild(feG)
  defs.appendChild(glow)

  // Sombra de autos
  const carShadow = document.createElementNS(ns, 'filter') as SVGFilterElement
  carShadow.setAttribute('id', `carShadow-${blk.id}`)
  carShadow.setAttribute('x', '-20%'); carShadow.setAttribute('y', '-20%')
  carShadow.setAttribute('width', '140%'); carShadow.setAttribute('height', '140%')
  const feDrop = document.createElementNS(ns, 'feDropShadow') as SVGFEDropShadowElement
  feDrop.setAttribute('dx', '0'); feDrop.setAttribute('dy', '0.6')
  feDrop.setAttribute('stdDeviation', '0.7')
  feDrop.setAttribute('flood-color', '#000000')
  feDrop.setAttribute('flood-opacity', '0.35')
  carShadow.appendChild(feDrop)
  defs.appendChild(carShadow)

  svg.appendChild(defs)

  // Banda base con inner + grad + glow
  const base = document.createElementNS(ns, 'rect')
  base.setAttribute('x', '0'); base.setAttribute('y', '0')
  base.setAttribute('width', String(width)); base.setAttribute('height', String(bandH))
  base.setAttribute('rx', '6')
  base.setAttribute('fill', color)
  base.setAttribute('fill-opacity', getCss('--op-band-fill', 0.94))
  base.setAttribute('filter', `url(#innerShadow-${blk.id})`)

  const gradLayer = document.createElementNS(ns, 'rect')
  gradLayer.setAttribute('x', '0'); gradLayer.setAttribute('y', '0')
  gradLayer.setAttribute('width', String(width)); gradLayer.setAttribute('height', String(bandH))
  gradLayer.setAttribute('rx', '6')
  gradLayer.setAttribute('fill', `url(#bandGrad-${blk.id})`)

  const glowWrap = document.createElementNS(ns, 'g')
  glowWrap.setAttribute('filter', `url(#bandGlow-${blk.id})`)
  glowWrap.setAttribute('opacity',
    blk.status === 'full'
      ? getCss('--glow-full', 0.28)
      : blk.status === 'limited'
      ? getCss('--glow-limited', 0.24)
      : getCss('--glow-free', 0.18)
  )
  glowWrap.appendChild(base)
  glowWrap.appendChild(gradLayer)
  svg.appendChild(glowWrap)

  // Rim line lado vereda
  const rim = document.createElementNS(ns, 'rect')
  rim.setAttribute('x', '0'); rim.setAttribute('y', '0')
  rim.setAttribute('width', String(width)); rim.setAttribute('height', '1')
  rim.setAttribute('fill', '#fff'); rim.setAttribute('opacity', '0.55')
  svg.appendChild(rim)

  // Patrones por estado (daltónico-friendly)
  if (blk.status === 'free' || blk.status === 'limited') {
    const pattId = blk.status === 'free' ? `dots-${blk.id}` : `diag-${blk.id}`
    const patRect = document.createElementNS(ns, 'rect')
    patRect.setAttribute('x', '0'); patRect.setAttribute('y', '0')
    patRect.setAttribute('width', String(width)); patRect.setAttribute('height', String(bandH))
    patRect.setAttribute('rx', '6')
    if (blk.status === 'free') {
      const patDots = document.createElementNS(ns, 'pattern')
      patDots.setAttribute('id', `dots-${blk.id}`)
      patDots.setAttribute('patternUnits', 'userSpaceOnUse')
      patDots.setAttribute('width', '6'); patDots.setAttribute('height', '6')
      const dot = document.createElementNS(ns, 'circle')
      dot.setAttribute('cx', '1'); dot.setAttribute('cy', '1'); dot.setAttribute('r', '1')
      dot.setAttribute('fill', '#ffffff'); dot.setAttribute('opacity', '0.5')
      patDots.appendChild(dot); defs.appendChild(patDots)
    } else {
      const patDiag = document.createElementNS(ns, 'pattern')
      patDiag.setAttribute('id', `diag-${blk.id}`)
      patDiag.setAttribute('patternUnits', 'userSpaceOnUse')
      patDiag.setAttribute('width', '8'); patDiag.setAttribute('height', '8')
      patDiag.setAttribute('patternTransform', 'rotate(45)')
      const rectDiag = document.createElementNS(ns, 'rect')
      rectDiag.setAttribute('x', '0'); rectDiag.setAttribute('y', '0')
      rectDiag.setAttribute('width', '4'); rectDiag.setAttribute('height', '8')
      rectDiag.setAttribute('fill', '#ffffff'); rectDiag.setAttribute('opacity', '0.25')
      patDiag.appendChild(rectDiag); defs.appendChild(patDiag)
    }
    patRect.setAttribute('fill', `url(#${pattId})`)
    svg.appendChild(patRect)
  }

  // --- AUTOS ULTRA VISIBLES ---
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

      const jx = (rng() - 0.5) * 3
      const jy = (rng() - 0.5) * 2

      const cx = slotCenterX + jx
      const cy = bandH / 2 + jy
      const x = cx - pillW / 2
      const y = cy - pillH / 2

      const car = document.createElementNS(ns, 'rect')
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
      car.setAttribute('style', `opacity:0; transform:scale(0.92); transition: opacity var(--anim-mid) var(--anim-ease), transform var(--anim-mid) var(--anim-ease); transform-origin:center;`)
      svg.appendChild(car)

      const nose = document.createElementNS(ns, 'path')
      const nx0 = x + pillW * 0.48
      const nx1 = x + pillW * 0.56
      const ny0 = cy - pillH * 0.22
      const ny1 = cy + pillH * 0.22
      nose.setAttribute('d', `M ${nx0} ${ny0} L ${nx1} ${cy} L ${nx0} ${ny1} z`)
      nose.setAttribute('fill', CAR_SPECULAR)
      nose.setAttribute('fill-opacity', String(CAR_SPECULAR_OPACITY))
      nose.setAttribute('style', `opacity:0; transform:scale(0.92); transition: opacity var(--anim-mid) var(--anim-ease), transform var(--anim-mid) var(--anim-ease); transform-origin:center;`)
      svg.appendChild(nose)

      const ws = document.createElementNS(ns, 'rect')
      ws.setAttribute('x', String(x - pillW * 0.04 + pillW * 0.52))
      ws.setAttribute('y', String(y + pillH * 0.22))
      ws.setAttribute('width', String(pillW * 0.16))
      ws.setAttribute('height', String(pillH * 0.22))
      ws.setAttribute('rx', String(Math.max(2, pillH * 0.1)))
      ws.setAttribute('fill', CAR_SPECULAR)
      ws.setAttribute('fill-opacity', String(CAR_SPECULAR_OPACITY))
      ws.setAttribute('style', `opacity:0; transform:scale(0.92); transition: opacity var(--anim-mid) var(--anim-ease), transform var(--anim-mid) var(--anim-ease); transform-origin:center;`)
      svg.appendChild(ws)

      requestAnimationFrame(() => {
        car.style.opacity = '1'; car.style.transform = 'scale(1)'
        nose.style.opacity = '1'; nose.style.transform = 'scale(1)'
        ws.style.opacity = '1'; ws.style.transform = 'scale(1)'
      })

      const breatheDelay = 4000 + Math.floor(rng()*3000)
      setTimeout(() => {
        car.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
          { duration: 220, easing: 'ease-in-out' }
        )
      }, breatheDelay)
    }
  }

  // Pulse leve en full
  if (blk.status === 'full') {
    setTimeout(() => {
      glowWrap.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
        { duration: 420, easing: 'ease-in-out' }
      )
    }, 200 + Math.floor(Math.random()*400))
  }

  // Hotspot de interacción
  const hotspot = document.createElementNS(ns, 'rect')
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
