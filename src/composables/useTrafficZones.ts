import { inject, shallowRef, watch, type Ref } from "vue";
import { TRAFFIC_ZONES } from "../data/trafficZones.ar";
import type { ProvinceId } from "../data/arProvinces";

export function useTrafficZones(provinceId: Ref<ProvinceId>) {
  const map = inject<google.maps.Map | null>("googleMap", null);
  const polygons = shallowRef<google.maps.Polygon[]>([]);

  function clear() {
    polygons.value.forEach(p => p.setMap(null));
    polygons.value = [];
  }

  function render(id: ProvinceId) {
    if (!map) return;
    clear();

    const zones = TRAFFIC_ZONES.filter(z => z.provinceId === id);

    zones.forEach(z => {
      const poly = new google.maps.Polygon({
        paths: z.polygon,
        strokeOpacity: 0,
        fillOpacity: z.severity === "high" ? 0.2 : 0.12,
        clickable: true,
        zIndex: 5,
      });

      poly.setMap(map);

      poly.addListener("click", () => {
        const bounds = new google.maps.LatLngBounds();
        z.polygon.forEach(pt => bounds.extend(pt));
        map.fitBounds(bounds, 80);
      });

      polygons.value.push(poly);
    });
  }

  watch(provinceId, (id) => render(id), { immediate: true });

  return { clear, render };
}
