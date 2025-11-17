export type ReservationStatus = 'pending' | 'approved' | 'failed' | 'verified' | 'in_progress' | 'completed' | 'cancelled';
// Creamos un mapa fuertemente tipado
export const stateTraslation: Record<ReservationStatus, string> = {
  pending: 'PENDIENTE',
  approved: 'CONFIRMADA',
  failed: 'FALLIDA',
  verified: 'VERIFICADA',
  in_progress: 'EN PROGRESO',
  completed: 'FINALIZADA',
  cancelled: 'CENCELADA',
};

// Función reutilizable
export function getSpanishReservationStatus(type: ReservationStatus): string {
  return stateTraslation[type] ?? '';
}
