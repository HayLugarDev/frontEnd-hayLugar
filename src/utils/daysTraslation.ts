export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Mapa de traducción tipado
export const dayTranslation: Record<WeekDay, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

// Función reutilizable
export function getSpanishDay(day: WeekDay): string {
  return dayTranslation[day];
}

// Opcional: obtener todos los días en formato lista
export function getAllDays(): { value: WeekDay; label: string }[] {
  return (Object.keys(dayTranslation) as WeekDay[]).map((key) => ({
    value: key,
    label: dayTranslation[key],
  }));
}
