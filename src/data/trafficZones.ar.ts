import type { ProvinceId } from "./arProvinces";

export type TrafficZone = {
  id: string;
  provinceId: ProvinceId;
  name: string;
  severity: "high" | "medium";
  polygon: google.maps.LatLngLiteral[];
};

export const TRAFFIC_ZONES: TrafficZone[] = [
  // Tucumán (SMT) — aproximado
  {
    id: "tuc-centro",
    provinceId: "tucuman",
    name: "Centro",
    severity: "high",
    polygon: [
      { lat: -26.8340, lng: -65.2145 },
      { lat: -26.8340, lng: -65.1970 },
      { lat: -26.8180, lng: -65.1970 },
      { lat: -26.8180, lng: -65.2145 },
    ],
  },
  {
    id: "tuc-bn",
    provinceId: "tucuman",
    name: "Barrio Norte",
    severity: "medium",
    polygon: [
      { lat: -26.8168, lng: -65.2145 },
      { lat: -26.8168, lng: -65.1990 },
      { lat: -26.8060, lng: -65.1990 },
      { lat: -26.8060, lng: -65.2145 },
    ],
  },
  {
    id: "tuc-bs",
    provinceId: "tucuman",
    name: "Barrio Sur",
    severity: "medium",
    polygon: [
      { lat: -26.8445, lng: -65.2145 },
      { lat: -26.8445, lng: -65.1990 },
      { lat: -26.8345, lng: -65.1990 },
      { lat: -26.8345, lng: -65.2145 },
    ],
  },

  // Córdoba — centro aproximado
  {
    id: "cor-centro",
    provinceId: "cordoba",
    name: "Centro",
    severity: "high",
    polygon: [
      { lat: -31.4270, lng: -64.1955 },
      { lat: -31.4270, lng: -64.1760 },
      { lat: -31.4130, lng: -64.1760 },
      { lat: -31.4130, lng: -64.1955 },
    ],
  },
];
