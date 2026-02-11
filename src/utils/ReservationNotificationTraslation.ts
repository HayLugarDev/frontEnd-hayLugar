export type ReservationStatus = 'pending'
    | 'payment_pending'
    | 'payment_approved'
    | 'failed'
    | 'verified'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
;
// Creamos un mapa fuertemente tipado
export const stateTraslation: Record<ReservationStatus, string> = {
  pending: 'RESERVA PENDIENTE',
  payment_pending: 'PAGO DE RESERVA PENDIENTE',
  payment_approved: 'PAGO DE RESERVA APROBADO',
  failed: 'RESERVA FALLIDA',
  verified: 'RESERVA VERIFICADA',
  in_progress: 'RESERVA EN PROGRESO',
  completed: 'RESERVA FINALIZADA',
  cancelled: 'RESERVA CANCELADA',
};

// Función reutilizable
export function getSpanishReservationStatus(type: ReservationStatus): string {
  return stateTraslation[type] ?? '';
}
