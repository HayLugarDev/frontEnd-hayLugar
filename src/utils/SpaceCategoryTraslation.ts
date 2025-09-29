export type SpaceCategory = 'private_parking' | 'university' | 'public';

// Creamos un mapa fuertemente tipado
export const categoryTraslatation: Record<SpaceCategory, string> = {
  private_parking: 'Privado',
  university: 'Universidad',
  public: 'Público',
};

// Función reutilizable
export function getSpanishCategory(type: SpaceCategory): string {
  return categoryTraslatation[type];
}