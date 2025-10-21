export type SpaceCategory = 'private' | 'university' | 'public';

// Creamos un mapa fuertemente tipado
export const categoryTraslatation: Record<SpaceCategory, string> = {
  private: 'Privado',
  university: 'Universidad',
  public: 'Público',
};

// Función reutilizable
export function getSpanishCategory(type: SpaceCategory): string {
  return categoryTraslatation[type];
}