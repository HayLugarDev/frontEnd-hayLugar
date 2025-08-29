export type ReservationStatus = 'pending' | 'approved' | 'cancelled';

// Creamos un mapa fuertemente tipado
export const stateTraslation: Record<ReservationStatus, string> = {
  pending: 'PENDIENTE',
  approved: 'CONFIRMADA',
  cancelled: 'CENCELADA',
};

// Función reutilizable
export function getSpanishReservationStatus(type: ReservationStatus): string {
  return stateTraslation[type] ?? '';
}
