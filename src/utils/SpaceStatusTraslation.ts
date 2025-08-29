export type SpaceStatus = 'active' | 'paused' | 'pending_review';

// Creamos un mapa fuertemente tipado
export const stateTraslation: Record<SpaceStatus, string> = {
  active: 'Activo',
  paused: 'Pausada',
  pending_review: 'Pendiente de revisión',
};

// Función reutilizable
export function getSpanishState(type: SpaceStatus): string {
  return stateTraslation[type] ?? 'Desconocido';
}
