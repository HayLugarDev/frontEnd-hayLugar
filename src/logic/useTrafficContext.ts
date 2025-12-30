import { computed, Ref } from "vue"
import type { HotZone } from "../features/traffic/HotZonesLayer"

export function useTrafficContext(
  zones: Ref<HotZone[]>,
  isPeak: Ref<boolean>
) {
  return computed(() => {
    const hasRed = zones.value.some(z => z.level === "red")

    if (isPeak.value && hasRed) {
      return {
        cta: "Alta demanda ahora",
        message:
          "La congestión activa está generando presión de estacionamiento. Publicar tu espacio ahora puede generar ingresos inmediatos.",
      }
    }

    if (hasRed) {
      return {
        cta: "Zona con alta circulación",
        message:
          "Esta zona presenta flujo intenso. Publicar tu espacio puede posicionarte mejor antes del horario pico.",
      }
    }

    return {
      cta: "Explorá oportunidades",
      message:
        "Analizá el tráfico urbano y detectá zonas donde la movilidad genera demanda de estacionamiento.",
    }
  })
}
