type AvailabilityValidationResult = {
  valid: boolean;
  message?: string;
};

export const isWithinAvailability = (
  start: Date,
  end: Date,
  availability: any
): AvailabilityValidationResult => {

  console.log(start, end);

  if (!availability?.start || !availability?.end) {
    return { valid: true };
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // 1️⃣ Validar día de la semana
  if (availability.days?.length) {
    const day = startDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    if (!availability.days.includes(day)) {
      return {
        valid: false,
        message: `El espacio no está disponible los ${capitalizeDay(day)}`
      };
    }
  }

  // 2️⃣ Validar horario
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  const availabilityStart = toMinutes(availability.start);
  const availabilityEnd = toMinutes(availability.end);

  if (startMinutes < availabilityStart || endMinutes > availabilityEnd) {
    return {
      valid: false,
      message: `El horario permitido es de ${availability.start} a ${availability.end}`
    };
  }

  return { valid: true };
};

const capitalizeDay = (day: string) => {
  const map: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };
  return map[day.toLowerCase()] || day;
};

