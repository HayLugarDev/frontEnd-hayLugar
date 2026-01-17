<template>
  <div class="relative w-full h-[65vh] sm:h-[72vh] mt-6 sm:mt-10">

    <!-- ================= MAPA BASE ================= -->
    <TrafficGoogleMap
      class="relative z-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      :center="center"
      :zoom="zoom"
      :options="mapOptions"
    >
      <TrafficLayers
        :provinceId="provinceId"
        :viewId="viewId"
        :trafficEnabled="trafficEnabled"
        :simEnabled="simEnabled"
        :simLevel="simLevel"
        :center="center"
      />
    </TrafficGoogleMap>

    <!-- ================= OVERLAY IZQUIERDO ================= -->
    <!-- Desktop / Tablet -->
    <div class="hidden sm:block absolute top-6 left-4 z-20">
      <div
        class="w-[320px] bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
               backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
      >
        <ProvinceSelector
          v-model="provinceId"
          v-model:viewId="viewId"
          :provinces="provinces"
          @locate="flyToSelection"
        />
      </div>
    </div>

    <!-- Mobile selector (top) -->
    <div class="sm:hidden absolute top-3 left-3 right-3 z-20">
      <div
        class="bg-[#020617]/90 backdrop-blur border border-white/10
               rounded-xl p-3 shadow-xl"
      >
        <ProvinceSelector
          v-model="provinceId"
          v-model:viewId="viewId"
          :provinces="provinces"
          compact
          @locate="flyToSelection"
        />
      </div>
    </div>

    <!-- ================= PANEL DERECHO ================= -->
    <!-- Desktop -->
    <div class="hidden sm:block absolute top-4 right-4 z-20">
      <div
        class="w-[380px] bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]
               backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
      >
        <TrafficImpactPanel
          :title="panelTitle"
          subtitle="Vista nacional · datos en tiempo real"
          :focusCityLabel="activeZoneLabel"
          :isPeak="isPeak"
          :trafficEnabled="trafficEnabled"
          :narrative="narrative"
          :level="simLevel"
          @publish="$emit('publish')"
          @toggleTraffic="toggleTraffic"
        />

        <div class="mt-3">
          <TrafficDisclaimer />
        </div>
      </div>
    </div>

    <!-- Mobile bottom sheet -->
    <div class="sm:hidden absolute bottom-3 left-3 right-3 z-20">
      <div
        class="bg-[#020617]/95 backdrop-blur-xl border border-white/10
               rounded-2xl p-4 shadow-2xl"
      >
        <TrafficImpactPanel
          :title="panelTitle"
          subtitle="Vista nacional"
          :focusCityLabel="activeZoneLabel"
          :isPeak="isPeak"
          :trafficEnabled="trafficEnabled"
          :narrative="narrative"
          :level="simLevel"
          compact
          @publish="$emit('publish')"
          @toggleTraffic="toggleTraffic"
        />

        <div class="mt-2">
          <TrafficDisclaimer />
        </div>
      </div>
    </div>

    <!-- ================= OVERLAY INFERIOR ================= -->
    <div
      class="absolute bottom-3 left-3 right-3 z-10 flex justify-center pointer-events-none"
    >
      <div
        class="px-3 py-2 rounded-xl
               bg-[#020617]/80 backdrop-blur
               border border-white/10 text-xs text-center"
      >
        {{ peakText }}
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import TrafficGoogleMap from "../../components/layout/TrafficGoogleMap.vue";
import TrafficLayers from "./TrafficLayers.vue";

import ProvinceSelector from "../../features/traffic/ProvinceSelector.vue";
import TrafficImpactPanel from "../../features/traffic/TrafficImpactPanel.vue";
import TrafficDisclaimer from "../../features/traffic/TrafficDisclaimer.vue";

import { PROVINCES, type ProvinceId } from "../../data/arProvinces";
import { usePeakSchedule } from "../../logic/usePeakSchedule";

defineEmits<{ (e: "publish"): void }>();

/* ===================== DATA ===================== */

const provinces = PROVINCES;
const provinceId = ref<ProvinceId>(provinces[0].id);
const viewId = ref<string | null>(null);

const selectedProvince = computed(() =>
  provinces.find(p => p.id === provinceId.value)
);

/* ===================== MAP STATE ===================== */

const center = ref<google.maps.LatLngLiteral>(
  selectedProvince.value!.center
);
const zoom = ref<number>(
  selectedProvince.value!.zoom
);

/* ===================== CURRENT VIEW ===================== */

const currentView = computed(() => {
  if (!viewId.value || !selectedProvince.value?.views) return null;
  return (
    selectedProvince.value.views.find(v => v.id === viewId.value) ?? null
  );
});

/* ===================== LABEL ===================== */

const activeZoneLabel = computed(() => {
  return (
    currentView.value?.label ||
    selectedProvince.value?.focusCityLabel ||
    selectedProvince.value?.name ||
    ""
  );
});

/* ===================== TRAFFIC ===================== */

const trafficEnabled = ref(true);
const simEnabled = ref(true);

/* ===================== PEAK ===================== */

const { isPeakNow } = usePeakSchedule();
const isPeak = computed(() => isPeakNow.value);

const peakText = computed(() =>
  isPeak.value
    ? "Horario pico · alta presión de estacionamiento"
    : "Fuera de horario pico · flujo urbano moderado"
);

/* ===================== LEVEL ===================== */

const simLevel = computed<"green" | "yellow" | "red">(() => {
  if (isPeak.value) return "red";
  if (trafficEnabled.value) return "yellow";
  return "green";
});

/* ===================== COPY ===================== */

const narrative = computed(() => {
  const place = activeZoneLabel.value || "esta zona";

  if (isPeak.value) {
    return `Alta demanda ahora en ${place}. La congestión urbana incrementa la búsqueda de estacionamiento.`;
  }

  if (trafficEnabled.value) {
    return `El tráfico en vivo muestra flujo constante en ${place}.`;
  }

  return `Explorá el mapa urbano de ${place} y detectá oportunidades.`;
});

const panelTitle = computed(
  () => `Tráfico en vivo · ${selectedProvince.value?.name ?? ""}`
);

/* ===================== MAP OPTIONS ===================== */

const mapOptions = computed<google.maps.MapOptions>(() => ({
  clickableIcons: false,
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "on" }] },
  ],
}));

/* ===================== ACTIONS ===================== */

function flyToSelection() {
  const province = selectedProvince.value;
  if (!province) return;

  if (currentView.value) {
    center.value = currentView.value.center;
    zoom.value = currentView.value.zoom;
    return;
  }

  center.value = province.center;
  zoom.value = province.zoom;
}

function toggleTraffic() {
  trafficEnabled.value = !trafficEnabled.value;
}

/* ===================== SYNC ===================== */

watch(selectedProvince, (p) => {
  if (!p) return;
  viewId.value = null;
  center.value = p.center;
  zoom.value = p.zoom;
});
</script>
