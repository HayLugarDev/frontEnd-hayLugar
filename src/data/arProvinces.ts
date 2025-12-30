export type ProvinceId =
  | "caba"
  | "buenos_aires"
  | "cordoba"
  | "santa_fe"
  | "mendoza"
  | "tucuman"
  | "salta"
  | "misiones"
  | "entre_rios"
  | "neuquen"
  | "rio_negro"
  | "chubut"
  | "san_juan"
  | "san_luis"
  | "corrientes"
  | "chaco"
  | "formosa"
  | "jujuy"
  | "la_rioja"
  | "catamarca"
  | "la_pampa"
  | "santa_cruz"
  | "tierra_del_fuego"
  | "santiago_del_estero";

export type FocusPreset = {
  id: string; // ej: "amba", "mar_del_plata", "bariloche"
  label: string; // ej: "AMBA", "Mar del Plata"
  center: { lat: number; lng: number };
  zoom: number;
  focusCityLabel: string;
};
export type ProvinceView = {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
  focusCityLabel: string;
};

export type ProvinceConfig = {
  id: ProvinceId;
  name: string;

  // default (cuando elegís provincia)
  center: { lat: number; lng: number };
  zoom: number;
  focusCityLabel: string;

  // presets opcionales (ciudades turísticas / subzonas)
  presets?: FocusPreset[];
  views?: ProvinceView[];
};

export const PROVINCES: ProvinceConfig[] = [
  {
    id: "caba",
    name: "CABA",
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 12,
    focusCityLabel: "CABA",
    presets: [
      { id: "microcentro", label: "Microcentro", center: { lat: -34.6037, lng: -58.3816 }, zoom: 13, focusCityLabel: "Microcentro" },
      { id: "palermo", label: "Palermo", center: { lat: -34.5711, lng: -58.4233 }, zoom: 13, focusCityLabel: "Palermo" },
    ],
  },

  {
    id: "buenos_aires",
    name: "Buenos Aires",
    center: { lat: -34.6158, lng: -58.4333 }, // AMBA base
    zoom: 11,
    focusCityLabel: "AMBA",
    presets: [
      { id: "amba", label: "AMBA", center: { lat: -34.6158, lng: -58.4333 }, zoom: 11, focusCityLabel: "AMBA" },
      // Mar del Plata (real)
      { id: "mar_del_plata", label: "Mar del Plata", center: { lat: -38.00042, lng: -57.5562 }, zoom: 12, focusCityLabel: "Mar del Plata" },
    ],
  },

  {
    id: "cordoba",
    name: "Córdoba",
    center: { lat: -31.4201, lng: -64.1888 },
    zoom: 12,
    focusCityLabel: "Córdoba Capital",
  },

  {
    id: "santa_fe",
    name: "Santa Fe",
    center: { lat: -32.9442, lng: -60.6505 }, // Rosario base
    zoom: 12,
    focusCityLabel: "Rosario",
  },

  {
    id: "mendoza",
    name: "Mendoza",
    // Mendoza ciudad (real)
    center: { lat: -32.888355, lng: -68.838844 },
    zoom: 12,
    focusCityLabel: "Gran Mendoza",
  },

  {
    id: "tucuman",
    name: "Tucumán",
    center: { lat: -26.8083, lng: -65.2176 },
    zoom: 13,
    focusCityLabel: "San Miguel de Tucumán",
    presets: [
      { id: "smt", label: "San Miguel (centro)", center: { lat: -26.8327, lng: -65.2041 }, zoom: 14, focusCityLabel: "Centro SMT" },
      { id: "yerba_buena", label: "Yerba Buena", center: { lat: -26.8167, lng: -65.3167 }, zoom: 13, focusCityLabel: "Yerba Buena" },
    ],
  },

  {
    id: "misiones",
    name: "Misiones",
    center: { lat: -27.3621, lng: -55.9009 }, // Posadas (base)
    zoom: 12,
    focusCityLabel: "Posadas",
    presets: [
      // Iguazú (zona falls real). Si preferís Puerto Iguazú ciudad, lo armamos también.
      { id: "iguazu_falls", label: "Cataratas (Iguazú)", center: { lat: -25.695230, lng: -54.436718 }, zoom: 12, focusCityLabel: "Cataratas" },
    ],
  },

  {
    id: "rio_negro",
    name: "Río Negro",
    center: { lat: -40.8135, lng: -62.9967 }, // genérico provincial
    zoom: 6,
    focusCityLabel: "Río Negro",
    presets: [
      // Bariloche (real)
      { id: "bariloche", label: "Bariloche", center: { lat: -41.134258, lng: -71.308525 }, zoom: 12, focusCityLabel: "Bariloche" },
    ],
  },

  { id: "salta", name: "Salta", center: { lat: -24.7821, lng: -65.4232 }, zoom: 12, focusCityLabel: "Salta Capital" },
  { id: "santiago_del_estero", name: "Santiago del Estero", center: { lat: -27.7844, lng: -64.2667 }, zoom: 12, focusCityLabel: "Sgo. del Estero" },

  // El resto podés dejarlas genéricas por ahora y sumar presets de alto impacto cuando quieras:
  // neuquen, chubut, tierra_del_fuego (Ushuaia), etc.
];
