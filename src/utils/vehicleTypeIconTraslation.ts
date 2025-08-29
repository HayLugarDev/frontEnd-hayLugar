export type VehicleType = 'car' | 'motorcycle' | 'van' | 'bicycle';

//Traducción
export const vehicleIconTranslations: Record<VehicleType, string> = {
  car: 'car-side',
  motorcycle: 'motorcycle',
  van: 'truck-pickup',
  bicycle: 'bicycle',
};

export const vehicleTypeTranslations: Record<VehicleType, string> = {
  car: 'Auto',
  motorcycle: 'Moto',
  van: 'Camioneta',
  bicycle: 'Bicicleta',
};

//Reutilizables
export function getVehicleIcon(type: VehicleType): string {
  return vehicleIconTranslations[type] ?? 'car-side';
}

export function getVehicleType(type: VehicleType): string {
  return vehicleTypeTranslations[type] ?? 'Otros';
}
