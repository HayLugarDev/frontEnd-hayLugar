import type { HotZone } from "./HotZonesLayer"

export const HOT_ZONES_BY_KEY: Record<
  string,
  Omit<HotZone, "level" | "weight">[]
> = {
  /* ===================== CABA ===================== */
  caba: [
    {
      id: "microcentro",
      title: "Microcentro",
      position: { lat: -34.6037, lng: -58.3816 },
    },
    {
      id: "palermo",
      title: "Palermo",
      position: { lat: -34.5711, lng: -58.4233 },
    },
    {
      id: "once",
      title: "Once",
      position: { lat: -34.6075, lng: -58.4055 },
    },
  ],

  "caba:microcentro": [
    {
      id: "plaza-mayo",
      title: "Plaza de Mayo",
      position: { lat: -34.6083, lng: -58.3712 },
    },
    {
      id: "corrientes",
      title: "Av. Corrientes",
      position: { lat: -34.6031, lng: -58.3882 },
    },
  ],

  "caba:palermo": [
    {
      id: "palermo-soho",
      title: "Palermo Soho",
      position: { lat: -34.5875, lng: -58.4300 },
    },
    {
      id: "palermo-hollywood",
      title: "Palermo Hollywood",
      position: { lat: -34.5785, lng: -58.4353 },
    },
  ],

  /* ===================== BUENOS AIRES ===================== */
  buenos_aires: [
    {
      id: "amba",
      title: "AMBA",
      position: { lat: -34.6158, lng: -58.4333 },
    },
  ],

  "buenos_aires:amba": [
    {
      id: "microcentro",
      title: "Microcentro",
      position: { lat: -34.6037, lng: -58.3816 },
    },
    {
      id: "palermo",
      title: "Palermo",
      position: { lat: -34.5711, lng: -58.4233 },
    },
  ],

  "buenos_aires:mar_del_plata": [
    {
      id: "centro-mdp",
      title: "Centro",
      position: { lat: -38.00042, lng: -57.5562 },
    },
    {
      id: "guemes",
      title: "Güemes",
      position: { lat: -38.0186, lng: -57.5485 },
    },
    {
      id: "playa-grande",
      title: "Playa Grande",
      position: { lat: -38.0406, lng: -57.5402 },
    },
    {
      id: "puerto",
      title: "Puerto",
      position: { lat: -38.0470, lng: -57.5400 },
    },
  ],

  /* ===================== CÓRDOBA ===================== */
  cordoba: [
    {
      id: "centro",
      title: "Centro",
      position: { lat: -31.4167, lng: -64.1833 },
    },
    {
      id: "nueva-cordoba",
      title: "Nueva Córdoba",
      position: { lat: -31.4245, lng: -64.1810 },
    },
    {
      id: "guemes",
      title: "Güemes",
      position: { lat: -31.4230, lng: -64.1930 },
    },
  ],

  /* ===================== SANTA FE (ROSARIO) ===================== */
  santa_fe: [
    {
      id: "rosario-centro",
      title: "Rosario Centro",
      position: { lat: -32.9442, lng: -60.6505 },
    },
    {
      id: "pichincha",
      title: "Pichincha",
      position: { lat: -32.9396, lng: -60.6553 },
    },
  ],

  /* ===================== MENDOZA ===================== */
  mendoza: [
    {
      id: "centro",
      title: "Centro",
      position: { lat: -32.888355, lng: -68.838844 },
    },
    {
      id: "godoy-cruz",
      title: "Godoy Cruz",
      position: { lat: -32.9163, lng: -68.8446 },
    },
    {
      id: "parque",
      title: "Parque San Martín",
      position: { lat: -32.8815, lng: -68.8570 },
    },
  ],

  /* ===================== TUCUMÁN ===================== */
  tucuman: [
    {
      id: "centro",
      title: "Centro SMT",
      position: { lat: -26.8327, lng: -65.2041 },
    },
    {
      id: "barrio-norte",
      title: "Barrio Norte",
      position: { lat: -26.8205, lng: -65.2080 },
    },
    {
      id: "barrio-sur",
      title: "Barrio Sur",
      position: { lat: -26.8452, lng: -65.2056 },
    },
  ],

  "tucuman:smt": [
    {
      id: "plaza-independencia",
      title: "Plaza Independencia",
      position: { lat: -26.8316, lng: -65.2044 },
    },
  ],

  "tucuman:yerba_buena": [
    {
      id: "yerba-centro",
      title: "Yerba Buena",
      position: { lat: -26.8167, lng: -65.3167 },
    },
    {
      id: "av-aconquija",
      title: "Av. Aconquija",
      position: { lat: -26.8079, lng: -65.3004 },
    },
  ],

  /* ===================== MISIONES ===================== */
  misiones: [
    {
      id: "posadas",
      title: "Posadas",
      position: { lat: -27.3621, lng: -55.9009 },
    },
  ],

  "misiones:iguazu_falls": [
    {
      id: "cataratas",
      title: "Cataratas del Iguazú",
      position: { lat: -25.695230, lng: -54.436718 },
    },
    {
      id: "puerto-iguazu",
      title: "Puerto Iguazú",
      position: { lat: -25.5971, lng: -54.5780 },
    },
  ],

  /* ===================== RÍO NEGRO ===================== */
  rio_negro: [
    {
      id: "viedma",
      title: "Viedma",
      position: { lat: -40.8135, lng: -62.9967 },
    },
  ],

  "rio_negro:bariloche": [
    {
      id: "centro",
      title: "Centro Cívico",
      position: { lat: -41.134258, lng: -71.308525 },
    },
    {
      id: "cerro-catedral",
      title: "Cerro Catedral",
      position: { lat: -41.1667, lng: -71.4500 },
    },
  ],

  /* ===================== SALTA ===================== */
  salta: [
    {
      id: "centro",
      title: "Centro",
      position: { lat: -24.7821, lng: -65.4232 },
    },
  ],

  /* ===================== SANTIAGO DEL ESTERO ===================== */
  santiago_del_estero: [
    {
      id: "centro",
      title: "Centro",
      position: { lat: -27.7844, lng: -64.2667 },
    },
  ],
}
