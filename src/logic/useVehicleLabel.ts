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