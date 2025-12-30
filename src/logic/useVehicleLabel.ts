import { VehicleType } from "../services/vehicleService";
import { vehicleTypeTranslations } from "../utils/vehicleTypeIconTraslation";

// Mapeo para mostrar texto más amigable
export default function vehicleLabel(type: string) {
  switch (type) {
    case 'car': return 'Auto';
    case 'van': return 'Camioneta';
    case 'motorcycle': return 'Moto';
    case 'bicycle': return 'Bicicleta';
    default: return type;
  }
}

export function getVehicleKey(
  spanishLabel?: string | null
): VehicleType | null {
  if (!spanishLabel) return null;

  const entry = Object.entries(vehicleTypeTranslations)
    .find(([_, value]) => value === spanishLabel);

  return entry ? (entry[0] as VehicleType) : null;
}
