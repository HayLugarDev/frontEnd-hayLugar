// hotZonesConfig.ts

export type LatLng = { lat: number; lng: number }

/**
 * HotZoneBase = Geografía + jerarquía + densidad base (estática).
 * - tier: jerarquía espacial (para reglas por zoom)
 * - seed: densidad base de la zona (0..1). NO es "tráfico en vivo":
 *         es un "baseline" para que el motor dinámico tenga realidad.
 */
export type HotZoneBase = {
  id: string
  title: string
  position: LatLng
  tier: 1 | 2 | 3 | 4 | 5
  seed: number // 0..1
}

/**
 * Normaliza seed a rango [0..1] y evita valores inválidos.
 */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/**
 * Helper para declarar zonas evitando repetir tier/seed clamp.
 */
const Z = (
  id: string,
  title: string,
  lat: number,
  lng: number,
  tier: HotZoneBase["tier"],
  seed: number
): HotZoneBase => ({
  id,
  title,
  position: { lat, lng },
  tier,
  seed: clamp01(seed),
})

/**
 * HOT_ZONES_BY_KEY
 * - Keys de nivel país/provincia (ej: "tucuman") -> ciudades principales (tier 2)
 * - Keys jerárquicas (ej: "tucuman:smt") -> zonas urbanas / microzonas (tier 3/4/5)
 *
 * IMPORTANTE:
 * - id debe ser estable y único DENTRO de cada key.
 * - seed es un baseline realista (0..1) para densidad.
 */
export const HOT_ZONES_BY_KEY: Record<string, HotZoneBase[]> = {
  /* ===================== BUENOS AIRES ===================== */
  buenos_aires: [
    Z("la_plata", "La Plata", -34.9214, -57.9544, 2, 0.85),
    Z("mar_del_plata", "Mar del Plata", -38.0055, -57.5426, 2, 0.8),
    Z("bahia_blanca", "Bahía Blanca", -38.7196, -62.2724, 2, 0.65),
    Z("quilmes", "Quilmes", -34.7245, -58.2526, 2, 0.75),
    Z("san_isidro", "San Isidro", -34.4708, -58.5286, 2, 0.72),
    Z("tigre", "Tigre", -34.4260, -58.5796, 2, 0.7),
  ],

  /* Sub-zonas urbanas (ejemplos listos para expandir) */
  "buenos_aires:la_plata": [
    Z("plaza_moreno", "Plaza Moreno", -34.9210, -57.9546, 4, 0.95),
    Z("estacion_lp", "Estación La Plata", -34.9144, -57.9521, 4, 0.88),
    Z("diag_74", "Diagonal 74", -34.9201, -57.9530, 3, 0.85),
  ],
  "buenos_aires:mar_del_plata": [
    Z("centro_mdp", "Centro", -38.0004, -57.5562, 4, 0.92),
    Z("guemes_mdp", "Güemes", -38.0186, -57.5485, 4, 0.9),
    Z("playa_grande", "Playa Grande", -38.0406, -57.5402, 3, 0.82),
    Z("puerto_mdp", "Puerto", -38.0470, -57.5400, 3, 0.78),
  ],
  "buenos_aires:bahia_blanca": [
    Z("centro_bb", "Centro", -38.7160, -62.2650, 4, 0.86),
    Z("terminal_bb", "Terminal", -38.7126, -62.2686, 4, 0.78),
    Z("av_alem", "Av. Alem", -38.7242, -62.2583, 3, 0.8),
  ],

  /* ===================== CABA ===================== */
  caba: [
    Z("microcentro", "Microcentro", -34.6037, -58.3816, 3, 0.95),
    Z("palermo", "Palermo", -34.5711, -58.4233, 3, 0.9),
    Z("recoleta", "Recoleta", -34.5880, -58.3977, 3, 0.88),
    Z("belgrano", "Belgrano", -34.5621, -58.4563, 3, 0.85),
  ],

  "caba:microcentro": [
    Z("plaza_de_mayo", "Plaza de Mayo", -34.6083, -58.3712, 4, 1.0),
    Z("obelisco", "Obelisco", -34.6037, -58.3816, 4, 0.98),
    Z("retiro", "Estación Retiro", -34.5920, -58.3750, 4, 0.9),
    Z("corrientes", "Av. Corrientes", -34.6031, -58.3882, 3, 0.92),
  ],
  "caba:palermo": [
    Z("plaza_serrano", "Plaza Serrano", -34.5895, -58.4307, 4, 1.0),
    Z("palermo_soho", "Palermo Soho", -34.5875, -58.4300, 4, 0.92),
    Z("palermo_hollywood", "Palermo Hollywood", -34.5785, -58.4353, 4, 0.88),
    Z("bosques_palermo", "Bosques de Palermo", -34.5696, -58.4118, 3, 0.84),
  ],
  "caba:recoleta": [
    Z("cementerio_recoleta", "Cementerio de Recoleta", -34.5882, -58.3925, 4, 0.9),
    Z("av_santa_fe", "Av. Santa Fe", -34.5950, -58.4088, 3, 0.84),
    Z("facultad_derecho", "Facultad de Derecho", -34.5837, -58.3952, 4, 0.86),
  ],
  "caba:belgrano": [
    Z("barrancas", "Barrancas de Belgrano", -34.5609, -58.4561, 4, 0.88),
    Z("cabildo_juramento", "Cabildo y Juramento", -34.5600, -58.4569, 4, 0.9),
    Z("av_libertador", "Av. del Libertador", -34.5476, -58.4473, 3, 0.82),
  ],

  /* ===================== CÓRDOBA ===================== */
  cordoba: [
    Z("cordoba_capital", "Córdoba Capital", -31.4167, -64.1833, 2, 0.9),
    Z("villa_carlos_paz", "Villa Carlos Paz", -31.4241, -64.4978, 2, 0.72),
    Z("rio_cuarto", "Río Cuarto", -33.1232, -64.3499, 2, 0.65),
    Z("san_francisco", "San Francisco", -31.4279, -62.0827, 2, 0.6),
  ],
  "cordoba:cordoba_capital": [
    Z("plaza_san_martin", "Plaza San Martín", -31.4157, -64.1833, 4, 0.92),
    Z("patio_olmos", "Patio Olmos", -31.4160, -64.1830, 4, 0.95),
    Z("nueva_cordoba", "Nueva Córdoba", -31.4245, -64.1810, 3, 0.86),
    Z("guemes_cba", "Güemes", -31.4230, -64.1930, 3, 0.84),
  ],

  /* ===================== SANTA FE ===================== */
  santa_fe: [
    Z("santa_fe_capital", "Santa Fe", -31.6333, -60.7000, 2, 0.7),
    Z("rosario", "Rosario", -32.9442, -60.6505, 2, 0.9),
    Z("rafaela", "Rafaela", -31.2526, -61.4917, 2, 0.62),
    Z("venado_tuerto", "Venado Tuerto", -33.7456, -61.9688, 2, 0.6),
  ],
  "santa_fe:rosario": [
    Z("monumento_bandera", "Monumento a la Bandera", -32.9473, -60.6290, 4, 0.95),
    Z("peatonal_cordoba", "Peatonal Córdoba", -32.9465, -60.6412, 4, 0.9),
    Z("pichincha", "Pichincha", -32.9396, -60.6553, 3, 0.86),
  ],

  /* ===================== MENDOZA ===================== */
  mendoza: [
    Z("mendoza_capital", "Mendoza", -32.8884, -68.8388, 2, 0.85),
    Z("san_rafael", "San Rafael", -34.6177, -68.3301, 2, 0.62),
    Z("godoy_cruz", "Godoy Cruz", -32.9163, -68.8446, 2, 0.75),
    Z("lujan_de_cuyo", "Luján de Cuyo", -33.0376, -68.8765, 2, 0.65),
  ],
  "mendoza:mendoza_capital": [
    Z("plaza_independencia_mza", "Plaza Independencia", -32.8896, -68.8440, 4, 0.95),
    Z("av_san_martin_mza", "Av. San Martín", -32.8891, -68.8426, 3, 0.88),
    Z("parque_san_martin_mza", "Parque San Martín", -32.8815, -68.8570, 3, 0.8),
  ],

  /* ===================== TUCUMÁN ===================== */
  tucuman: [
    Z("smt", "San Miguel de Tucumán", -26.8327, -65.2041, 2, 0.95),
    Z("yerba_buena", "Yerba Buena", -26.8167, -65.3167, 2, 0.75),
    Z("tafi_viejo", "Tafí Viejo", -26.7347, -65.2596, 2, 0.6),
    Z("concepcion", "Concepción", -27.3441, -65.5940, 2, 0.62),
  ],
  "tucuman:smt": [
    Z("plaza_independencia", "Plaza Independencia", -26.8316, -65.2044, 4, 1.0),
    Z("casa_historica", "Casa Histórica", -26.8333, -65.2029, 4, 0.92),
    Z("terminal_omnibus", "Terminal de Ómnibus", -26.8392, -65.2070, 4, 0.88),
    Z("av_sarmiento", "Av. Sarmiento", -26.8248, -65.2105, 3, 0.86),
  ],
  "tucuman:yerba_buena": [
    Z("av_aconquija", "Av. Aconquija", -26.8079, -65.3004, 3, 0.85),
    Z("yerba_centro", "Yerba Buena Centro", -26.8167, -65.3167, 4, 0.78),
  ],

  /* ===================== SALTA ===================== */
  salta: [
    Z("salta_capital", "Salta", -24.7821, -65.4232, 2, 0.8),
    Z("tartagal", "Tartagal", -22.5167, -63.8000, 2, 0.58),
    Z("oran", "Orán", -23.1390, -64.3240, 2, 0.6),
  ],
  "salta:salta_capital": [
    Z("plaza_9_julio", "Plaza 9 de Julio", -24.7892, -65.4105, 4, 0.92),
    Z("terminal_salta", "Terminal", -24.7820, -65.4117, 4, 0.82),
    Z("av_san_martin_salta", "Av. San Martín", -24.7877, -65.4158, 3, 0.8),
  ],

  /* ===================== JUJUY ===================== */
  jujuy: [
    Z("san_salvador", "San Salvador de Jujuy", -24.1858, -65.2995, 2, 0.75),
    Z("perico", "Perico", -24.3848, -65.1111, 2, 0.55),
    Z("palpala", "Palpalá", -24.2564, -65.2116, 2, 0.58),
  ],
  "jujuy:san_salvador": [
    Z("plaza_belgrano", "Plaza Belgrano", -24.1854, -65.2995, 4, 0.9),
    Z("terminal_jujuy", "Terminal", -24.1906, -65.2869, 4, 0.78),
    Z("av_alvear", "Av. Alvear", -24.1902, -65.2999, 3, 0.76),
  ],

  /* ===================== MISIONES ===================== */
  misiones: [
    Z("posadas", "Posadas", -27.3621, -55.9009, 2, 0.78),
    Z("puerto_iguazu", "Puerto Iguazú", -25.5971, -54.5780, 2, 0.72),
    Z("eldorado", "Eldorado", -26.4080, -54.6286, 2, 0.58),
    Z("obera", "Oberá", -27.4871, -55.1197, 2, 0.6),
  ],
  "misiones:posadas": [
    Z("costanera_posadas", "Costanera", -27.3678, -55.8958, 4, 0.9),
    Z("centro_posadas", "Centro", -27.3621, -55.9009, 4, 0.88),
    Z("terminal_posadas", "Terminal", -27.3883, -55.9397, 4, 0.78),
  ],
  "misiones:puerto_iguazu": [
    Z("cataratas", "Cataratas del Iguazú", -25.6952, -54.4367, 4, 0.95),
    Z("hito_tres_fronteras", "Hito Tres Fronteras", -25.6037, -54.5736, 4, 0.82),
    Z("centro_iguazu", "Centro", -25.5971, -54.5780, 4, 0.78),
  ],

  /* ===================== RÍO NEGRO ===================== */
  rio_negro: [
    Z("viedma", "Viedma", -40.8135, -62.9967, 2, 0.55),
    Z("bariloche", "San Carlos de Bariloche", -41.1343, -71.3085, 2, 0.78),
    Z("cipolletti", "Cipolletti", -38.9339, -67.9903, 2, 0.68),
  ],
  "rio_negro:bariloche": [
    Z("centro_civico", "Centro Cívico", -41.1343, -71.3085, 4, 0.9),
    Z("cerro_catedral", "Cerro Catedral", -41.1667, -71.45, 4, 0.85),
    Z("av_bustillo", "Av. Bustillo", -41.1007, -71.3870, 3, 0.78),
  ],

  /* ===================== NEUQUÉN ===================== */
  neuquen: [
    Z("neuquen_capital", "Neuquén", -38.9516, -68.0591, 2, 0.8),
    Z("cutral_co", "Cutral Co", -38.9374, -69.2326, 2, 0.55),
    Z("san_martin_andes", "San Martín de los Andes", -40.1579, -71.3534, 2, 0.72),
  ],
  "neuquen:neuquen_capital": [
    Z("centro_neuquen", "Centro", -38.9524, -68.0590, 4, 0.88),
    Z("terminal_neuquen", "Terminal", -38.9510, -68.0759, 4, 0.78),
    Z("av_argentina", "Av. Argentina", -38.9519, -68.0580, 3, 0.82),
  ],

  /* ===================== CHUBUT ===================== */
  chubut: [
    Z("rawson", "Rawson", -43.3002, -65.1023, 2, 0.5),
    Z("comodoro", "Comodoro Rivadavia", -45.8641, -67.4966, 2, 0.72),
    Z("puerto_madryn", "Puerto Madryn", -42.7692, -65.0385, 2, 0.7),
    Z("trelew", "Trelew", -43.2489, -65.3051, 2, 0.62),
  ],
  "chubut:puerto_madryn": [
    Z("centro_madryn", "Centro", -42.7692, -65.0385, 4, 0.85),
    Z("costanera_madryn", "Costanera", -42.7709, -65.0316, 4, 0.82),
    Z("terminal_madryn", "Terminal", -42.7725, -65.0367, 4, 0.7),
  ],
  "chubut:comodoro": [
    Z("centro_comodoro", "Centro", -45.8641, -67.4966, 4, 0.82),
    Z("av_rivadavia_comodoro", "Av. Rivadavia", -45.8655, -67.4882, 3, 0.76),
    Z("terminal_comodoro", "Terminal", -45.8671, -67.5025, 4, 0.68),
  ],

  /* ===================== SANTIAGO DEL ESTERO ===================== */
  santiago_del_estero: [
    Z("santiago_capital", "Santiago del Estero", -27.7844, -64.2667, 2, 0.7),
    Z("la_banda", "La Banda", -27.7333, -64.2333, 2, 0.62),
  ],
  "santiago_del_estero:santiago_capital": [
    Z("plaza_libertad", "Plaza Libertad", -27.7848, -64.2676, 4, 0.85),
    Z("terminal_sde", "Terminal", -27.7917, -64.2559, 4, 0.72),
  ],

  /* ===================== SAN JUAN ===================== */
  san_juan: [
    Z("san_juan_capital", "San Juan", -31.5375, -68.5364, 2, 0.75),
    Z("rawson_sj", "Rawson", -31.6100, -68.5240, 2, 0.62),
  ],
  "san_juan:san_juan_capital": [
    Z("plaza_25_mayo_sj", "Plaza 25 de Mayo", -31.5357, -68.5250, 4, 0.88),
    Z("terminal_sj", "Terminal", -31.5407, -68.5426, 4, 0.72),
    Z("av_libertador_sj", "Av. Libertador", -31.5369, -68.5369, 3, 0.78),
  ],

  /* ===================== SAN LUIS ===================== */
  san_luis: [
    Z("san_luis_capital", "San Luis", -33.3017, -66.3378, 2, 0.7),
    Z("villa_mercedes", "Villa Mercedes", -33.6757, -65.4578, 2, 0.68),
  ],
  "san_luis:san_luis_capital": [
    Z("plaza_pringles", "Plaza Pringles", -33.3027, -66.3363, 4, 0.85),
    Z("terminal_sl", "Terminal", -33.2924, -66.3321, 4, 0.7),
  ],

  /* ===================== LA PAMPA ===================== */
  la_pampa: [
    Z("santa_rosa", "Santa Rosa", -36.6167, -64.2833, 2, 0.62),
    Z("general_pico", "General Pico", -35.6566, -63.7568, 2, 0.6),
  ],
  "la_pampa:santa_rosa": [
    Z("centro_sr", "Centro", -36.6167, -64.2833, 4, 0.78),
    Z("terminal_sr", "Terminal", -36.6252, -64.2769, 4, 0.65),
  ],

  /* ===================== FORMOSA ===================== */
  formosa: [
    Z("formosa_capital", "Formosa", -26.1849, -58.1731, 2, 0.68),
    Z("clorinda", "Clorinda", -25.2848, -57.7185, 2, 0.58),
  ],
  "formosa:formosa_capital": [
    Z("centro_formosa", "Centro", -26.1849, -58.1731, 4, 0.8),
    Z("costanera_formosa", "Costanera", -26.1787, -58.1745, 4, 0.72),
  ],

  /* ===================== CHACO ===================== */
  chaco: [
    Z("resistencia", "Resistencia", -27.4514, -58.9867, 2, 0.72),
    Z("presidencia_roque_saenz_pena", "Pcia. Roque Sáenz Peña", -26.7905, -60.4418, 2, 0.6),
  ],
  "chaco:resistencia": [
    Z("microcentro_res", "Microcentro", -27.4514, -58.9867, 4, 0.82),
    Z("av_sarmiento_res", "Av. Sarmiento", -27.4414, -58.9813, 3, 0.74),
  ],

  /* ===================== CORRIENTES ===================== */
  corrientes: [
    Z("corrientes_capital", "Corrientes", -27.4692, -58.8306, 2, 0.72),
    Z("goya", "Goya", -29.1397, -59.2625, 2, 0.58),
  ],
  "corrientes:corrientes_capital": [
    Z("costanera_corrientes", "Costanera", -27.4688, -58.8342, 4, 0.82),
    Z("centro_corrientes", "Centro", -27.4692, -58.8306, 4, 0.8),
  ],

  /* ===================== ENTRE RÍOS ===================== */
  entre_rios: [
    Z("parana", "Paraná", -31.7319, -60.5238, 2, 0.75),
    Z("concordia", "Concordia", -31.3929, -58.0209, 2, 0.68),
    Z("gualeguaychu", "Gualeguaychú", -33.0103, -58.5172, 2, 0.65),
  ],
  "entre_rios:parana": [
    Z("microcentro_parana", "Microcentro", -31.7319, -60.5238, 4, 0.85),
    Z("costanera_parana", "Costanera", -31.7366, -60.5171, 4, 0.78),
  ],
}
