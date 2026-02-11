<template>
  <!-- No renderiza nada visible, solo monta capas sobre el mapa -->
  <div style="display:none;"></div>
</template>

<script setup lang="ts">
import {
  inject,
  watch,
  onBeforeUnmount,
  shallowRef,
  toRef,
  type Ref,
} from "vue";

import { useTrafficLayer } from "../../composables/useTrafficLayer";
import { useGoogleMapsReady } from "../../logic/useGoogleMapsReady";
import { usePeakSchedule } from "../../logic/usePeakSchedule";

import { VehicleSimLayer } from "../../features/traffic/VehicleSimLayer";
import { HotZonesLayer, type HotZoneRuntime } from "../../features/traffic/HotZonesLayer";
import { HOT_ZONES_BY_KEY, type HotZoneBase } from "../../features/traffic/hotZonesConfig";

import type { ProvinceId } from "../../data/arProvinces";

/* ===================== PROPS ===================== */

const props = defineProps<{
  provinceId: ProvinceId;
  viewId?: string | null;
  trafficEnabled: boolean;
  simEnabled: boolean;
  simLevel: "green" | "yellow" | "red";
  center: google.maps.LatLngLiteral;
}>();

/* ===================== MAP ===================== */

const mapRef = inject<Ref<google.maps.Map | null>>("googleMap");
const { isReady } = useGoogleMapsReady();

/* ===================== TRAFFIC REAL ===================== */

const trafficEnabledRef = toRef(props, "trafficEnabled");
useTrafficLayer(trafficEnabledRef);

/* ===================== HORARIO PICO ===================== */

const { peakStatus } = usePeakSchedule();

/* ===================== HOT ZONES ===================== */

const hotZonesLayer = shallowRef<HotZonesLayer | null>(null);
const mountedKey = shallowRef<string | null>(null);

/**
 * Resuelve la key:
 * - si existe provincia:viewId, usa esa (sub-zonas)
 * - si no, usa provincia (ciudades principales)
 */
function resolveHotZoneKey(
  province: ProvinceId,
  viewId?: string | null
): string | null {
  const k = viewId ? `${province}:${viewId}` : null;
  if (k && HOT_ZONES_BY_KEY[k]) return k;
  if (HOT_ZONES_BY_KEY[province]) return province;
  return null;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Engine simple y creíble para densidad dinámica.
 * - seed (0..1) define baseline por zona (realismo)
 * - peak sube presión
 * - trafficEnabled agrega presión visual (sin "mentir" que es exacto)
 *
 * Devuelve weight 0..1 + intensity.
 */
function computeZoneRuntime(
  zone: HotZoneBase,
  opts: { peak: boolean; trafficEnabled: boolean }
): { weight: number; intensity: "green" | "yellow" | "red" } {
  const { peak, trafficEnabled } = opts;

  // baseline desde config
  let w = zone.seed;

  // Peak aumenta presión (más en tiers altos)
  const peakBoost = peak ? lerp(0.06, 0.18, (zone.tier - 1) / 4) : 0;
  w += peakBoost;

  // Traffic enabled aumenta presión visual (moderado)
  const trafficBoost = trafficEnabled ? lerp(0.05, 0.14, zone.seed) : 0;
  w += trafficBoost;

  // Micro variación suave para vida (determinística por id)
  // Esto evita que todas las zonas "laten" igual en intensidad.
  const hash =
    Array.from(zone.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 100;
  const micro = (hash / 100 - 0.5) * 0.06; // [-0.03..+0.03]
  w += micro;

  w = clamp01(w);

  // Umbrales (podés afinarlos por producto)
  const intensity =
    w < 0.42 ? "green" :
    w < 0.72 ? "yellow" :
    "red";

  return { weight: w, intensity };
}

/**
 * Construye runtime zones para el layer.
 */
function buildRuntimeZones(
  baseZones: HotZoneBase[],
  opts: { peak: boolean; trafficEnabled: boolean }
): HotZoneRuntime[] {
  return baseZones.map((z) => {
    const { weight, intensity } = computeZoneRuntime(z, opts);
    return {
      id: z.id,
      title: z.title,
      position: z.position,
      tier: z.tier,
      weight,
      intensity,
    };
  });
}

watch(
  () => ({
    province: props.provinceId,
    viewId: props.viewId ?? null,
    trafficEnabled: props.trafficEnabled,
    peak: !!peakStatus.value,
    ready: isReady.value,
    map: mapRef?.value ?? null,
  }),
  ({ province, viewId, trafficEnabled, peak, ready, map }) => {
    if (!ready || !map) return;

    const key = resolveHotZoneKey(province, viewId);
    if (!key) {
      hotZonesLayer.value?.unmount();
      hotZonesLayer.value = null;
      mountedKey.value = null;
      return;
    }

    const baseZones = HOT_ZONES_BY_KEY[key];
    if (!baseZones?.length) return;

    const runtimeZones = buildRuntimeZones(baseZones, { peak, trafficEnabled });

    // Remount inteligente:
    // - si cambia key, destruimos y recreamos
    // - si no cambia, por ahora remount (hasta que agreguemos layer.update())
    const mustRemount = mountedKey.value !== key || !hotZonesLayer.value;

if (mustRemount) {
  hotZonesLayer.value?.unmount();
  hotZonesLayer.value = new HotZonesLayer(map);
  hotZonesLayer.value.mount(runtimeZones);
  mountedKey.value = key;
  return;
}


    // TODO (mejora pro): agregar hotZonesLayer.value.update(runtimeZones)
    // y acá solo updateás radios/colores sin recrear.
    hotZonesLayer.value.update(runtimeZones);

  },
  { immediate: true, deep: true }
);

/* ===================== VEHÍCULOS ===================== */

const sim = shallowRef<VehicleSimLayer | null>(null);

watch(
  () => ({
    enabled: props.simEnabled,
    level: props.simLevel,
    center: props.center,
    ready: isReady.value,
    map: mapRef?.value ?? null,
  }),
  ({ enabled, level, center, ready, map }) => {
    if (!enabled || !ready || !map) {
      sim.value?.stop();
      sim.value = null;
      return;
    }

    if (!sim.value) {
      sim.value = new VehicleSimLayer(mapRef!);
      sim.value.configure(level, center);
      sim.value.start();
      return;
    }

    sim.value.configure(level, center);
  },
  { immediate: true, deep: true }
);

/* ===================== CLEANUP ===================== */

onBeforeUnmount(() => {
  sim.value?.stop();
  hotZonesLayer.value?.unmount();
});
</script>
