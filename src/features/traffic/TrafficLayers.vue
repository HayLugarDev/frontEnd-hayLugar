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
import { calcZoneIntensity } from "../../logic/calcZoneIntensity";

import { VehicleSimLayer } from "../../features/traffic/VehicleSimLayer";
import { HotZonesLayer, type HotZone } from "../../features/traffic/HotZonesLayer";
import { HOT_ZONES_BY_KEY } from "../../features/traffic/hotZonesConfig";

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

function resolveHotZoneKey(
  province: ProvinceId,
  viewId?: string | null
): string | null {
  if (viewId && HOT_ZONES_BY_KEY[`${province}:${viewId}`]) {
    return `${province}:${viewId}`;
  }
  if (HOT_ZONES_BY_KEY[province]) {
    return province;
  }
  return null;
}

watch(
  [() => props.provinceId, () => props.viewId, isReady, peakStatus, () => mapRef?.value],
  ([province, viewId, ready, peak, map]) => {
    if (!ready || !map) return;

    hotZonesLayer.value?.unmount();
    hotZonesLayer.value = null;

    const key = resolveHotZoneKey(province, viewId);
    if (!key) return;

    const baseZones = HOT_ZONES_BY_KEY[key];
    if (!baseZones?.length) return;

    const zones: HotZone[] = baseZones.map(zone => {
      const intensity = calcZoneIntensity(
        props.trafficEnabled ? "yellow" : "green",
        peak
      );

      return {
        ...zone,
        level: intensity.level,
        weight: intensity.weight,
      };
    });

    hotZonesLayer.value = new HotZonesLayer(map);
    hotZonesLayer.value.mount(zones);
  },
  { immediate: true }
);

/* ===================== VEHÍCULOS ===================== */

const sim = shallowRef<VehicleSimLayer | null>(null);

watch(
  () => ({
    enabled: props.simEnabled,
    level: props.simLevel,
    center: props.center,
    ready: isReady.value,
    map: mapRef?.value,
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

